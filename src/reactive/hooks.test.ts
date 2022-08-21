import { describe, expect, test, vi } from "vitest";
import { createAtom } from "./atom";
import { createEffect, createMemo, createRef, createResource, onAppMounted, onMount } from "./hooks";

const wait = (ms: number) => new Promise((resolve) => {
    setTimeout(resolve, ms)
});

describe('hooks', () => {
    // TODO: test in createApp
    test('onMount', () => {
        const effect = vi.fn();
        onMount(effect);
        onAppMounted();
        expect(effect).toBeCalled();
    });

    test('createEffect', () => {
        const dep = createAtom(1);
        const effect = vi.fn();
        createEffect(effect, [dep]);
        onAppMounted();
        expect(effect).toBeCalledTimes(1);
        dep.set(2);
        expect(effect).toBeCalledTimes(2);
    });

    test('createMemo', () => {
        const a = createAtom(1);
        const b = createMemo(() => a.value * 2, [a]);
        expect(b.value).toBe(2);
        const aSubscriber = vi.fn();
        const bSubscriber = vi.fn();
        a.subscribe(aSubscriber);
        b.subscribe(bSubscriber);
        a.set(2);
        expect(aSubscriber).toBeCalled();
        expect(bSubscriber).toBeCalled();
        expect(b.value).toBe(4);
    });

    // TODO: test in renderer
    test('createRef', () => {
        const ref = createRef<any>();
        expect(ref.current).toBe(null);
        const el = { active: true }
        ref.current = el;
        expect(ref.current).toBe(el);
    });

    test('createResource', async () => {
        let counter = 0;
        const successData = { data: 'success' };
        const fetch = vi.fn(() => {
            counter++;
            return counter === 1
                ? Promise.resolve(successData)
                : Promise.reject('Some error');
        });
        const initial = { data: 'noting' };
        const [res, { error, loading, refetch }] = createResource(fetch, initial);
        const shouldBe = (resVal: typeof initial, errorVal: string | null, loadingVal: boolean = false) => {
            expect(res.value).toBe(resVal);
            expect(error.value).toBe(errorVal);
            expect(loading.value).toBe(loadingVal);
        }
        shouldBe(initial, null, false);
        onAppMounted();
        expect(fetch).toBeCalled();
        shouldBe(initial, null, true);
        // wait until promise is resolved
        await wait(0);
        shouldBe(successData, null, false);
        await refetch();
        expect(fetch).toBeCalledTimes(2);
        shouldBe(successData, 'Some error', false);
    });
});