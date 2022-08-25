/**
 * @vitest-environment jsdom
 */
import { h, createFragment, insertNode } from '../renderer';
import { describe, expect, test } from 'vitest';
import { createAtom } from '../reactive/atom';
import { from } from '../reactive/utils';
import { Match, Switch } from './Switch';

describe('Testing a single match switch control flow', () => {
    const count = createAtom(0);
    const div = (
        <div>
            <Switch fallback={() => 'fallback'}>
                <Match when={from(count, (c) => !!c && c < 2)}>
                    {() => <>1</>}
                </Match>
            </Switch>
        </div>
    ) as Element;

    test('Create Switch control flow', () => {
        expect(div.innerHTML).toBe('fallback');
    });

    test('Toggle Switch control flow', () => {
        count.set(1);
        expect(div.innerHTML).toBe('1');
        count.set(3);
        expect(div.innerHTML).toBe('fallback');
    });
});

describe('Testing an only child Switch control flow', () => {
    const count = createAtom(0);
    const div = (
        <div>
            <Switch fallback={() => 'fallback'}>
                <Match when={from(count, (c) => c && c < 2)}>
                    {() => <>1</>}
                </Match>
                <Match when={from(count, (c) => c && c < 5)}>
                    {() => <>2</>}
                </Match>
                <Match when={from(count, (c) => c && c < 8)}>
                    {() => <>3</>}
                </Match>
            </Switch>
        </div>
    ) as Element;

    test('Create Switch control flow', () => {
        expect(div.innerHTML).toBe('fallback');
    });

    test('Toggle Switch control flow', () => {
        count.set(1);
        expect(div.innerHTML).toBe('1');
        count.set(4);
        expect(div.innerHTML).toBe('2');
        count.set(7);
        expect(div.innerHTML).toBe('3');
        count.set(9);
        expect(div.innerHTML).toBe('fallback');
    });

    test("doesn't re-render on same option", () => {
        count.set(4);
        expect(div.innerHTML).toBe('2');
        const c = div.firstChild;
        count.set(4);
        expect(div.innerHTML).toBe('2');
        expect(div.firstChild).toBe(c);
    });
});

describe('Testing function handler Switch control flow', () => {
    const a = createAtom(0),
        b = createAtom(0),
        c = createAtom(0);
    const div = (
        <div>
            <Switch fallback={() => 'fallback'}>
                <Match when={a}>{() => <>{a}</>}</Match>
                <Match when={b}>{() => <>{b}</>}</Match>
                <Match when={c}>{() => <>{c}</>}</Match>
            </Switch>
        </div>
    ) as Element;

    test('Create Switch control flow', () => {
        expect(div.innerHTML).toBe('fallback');
    });

    test('Toggle Switch control flow', () => {
        c.set(1);
        expect(div.innerHTML).toBe('1');
        b.set(2);
        expect(div.innerHTML).toBe('2');
        a.set(3);
        expect(div.innerHTML).toBe('3');
        a.set(0);
        expect(div.innerHTML).toBe('2');
    });
});

describe('Test top level switch control flow', () => {
    const div = document.createElement('div');
    const count = createAtom(0);

    const Component = (
        <Switch fallback={() => 'fallback'}>
            <Match when={from(count, (c) => !!c && c < 2)}>
                {() => <>1</>}
            </Match>
        </Switch>
    ) as Element;

    test('Create switch control flow', () => {
        insertNode(div, Component);
        expect(div.innerHTML).toBe('fallback');
        count.set(1);
        expect(div.innerHTML).toBe('1');
    });
});
