import { describe, expect, test, vi } from 'vitest';
import { createAtom } from './atom';
import { from, useIndex, useObject } from './utils';

describe('reactive utils', () => {
    test('from', () => {
        const a = createAtom(1);
        const b = from(a, (n) => n * 2);
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

    test('useIndex', () => {
        const arr = createAtom([1, 2]);
        const first = useIndex(arr, 0);
        const third = useIndex(arr, 2);
        expect(first.value).toBe(1);
        expect(third.value).toBe(undefined);
        const fSubscriber = vi.fn();
        const tSubscriber = vi.fn();
        first.subscribe(fSubscriber);
        third.subscribe(tSubscriber);
        arr.set([100, 10]);
        expect(first.value).toBe(100);
        expect(fSubscriber).toBeCalled();
        expect(tSubscriber).not.toBeCalled();
        arr.set((a) => [...a, 1]);
        expect(third.value).toBe(1);
        expect(fSubscriber).toBeCalledTimes(1);
        expect(tSubscriber).toBeCalled();
    });

    test('useIndex with atomic index', () => {
        const arr = createAtom([1, 2, 3, 4]);
        const index = createAtom(1);
        const el = useIndex(arr, index);
        const subscriber = vi.fn();
        el.subscribe(subscriber);
        expect(el.value).toBe(2);
        index.set(3);
        expect(el.value).toBe(4);
        expect(subscriber).toBeCalledTimes(1);
        arr.set([4, 3, 2, 1]);
        expect(el.value).toBe(1);
        expect(subscriber).toBeCalledTimes(2);
    });

    test('useObject', () => {
        const obj = createAtom({ val1: 1, val2: 2 });
        const { val1, val2 } = useObject(obj);
        expect(val1.value).toBe(1);
        expect(val2.value).toBe(2);
        const subscriber1 = vi.fn();
        const subscriber2 = vi.fn();
        val1.subscribe(subscriber1);
        val2.subscribe(subscriber2);
        obj.set({ val1: 3, val2: 4 });
        expect(val1.value).toBe(3);
        expect(val2.value).toBe(4);
        expect(subscriber1).toBeCalled();
        expect(subscriber2).toBeCalled();
    });
});