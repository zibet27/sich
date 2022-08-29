/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { createAtom } from '../reactive/atom';
import { from, useObject } from '../reactive/utils';
import { h, createFragment, insertBefore } from '../renderer';
import { For } from './For';

const abcd = 'abcd';
const aabbccdd = 'aabbccdd';
const n1 = 'a',
    n2 = 'b',
    n3 = 'c',
    n4 = 'd';

describe('Testing an only child each control flow', () => {
    const list = createAtom([n1, n2, n3, n4]);
    const div = (
        <div>
            <For each={list}>{(item) => <>{item}</>}</For>
        </div>
    ) as HTMLDivElement;

    function apply(array: string[]) {
        list.set(array);
        expect(div.innerHTML).toBe(array.join(''));
        list.set([n1, n2, n3, n4]);
        expect(div.innerHTML).toBe(abcd);
    }

    test('Create each control flow', () => {
        expect(div.innerHTML).toBe(abcd);
    });

    test('1 missing', () => {
        apply([n2, n3, n4]);
        apply([n1, n3, n4]);
        apply([n1, n2, n4]);
        apply([n1, n2, n3]);
    });

    test('2 missing', () => {
        apply([n3, n4]);
        apply([n2, n4]);
        apply([n2, n3]);
        apply([n1, n4]);
        apply([n1, n3]);
        apply([n1, n2]);
    });

    test('3 missing', () => {
        apply([n1]);
        apply([n2]);
        apply([n3]);
        apply([n4]);
    });

    test('all missing', () => {
        apply([]);
    });

    test('swaps', () => {
        apply([n2, n1, n3, n4]);
        apply([n3, n2, n1, n4]);
        apply([n4, n2, n3, n1]);
    });

    test('rotations', () => {
        apply([n2, n3, n4, n1]);
        apply([n3, n4, n1, n2]);
        apply([n4, n1, n2, n3]);
    });

    test('reversal', () => {
        apply([n4, n3, n2, n1]);
    });

    test('full replace', () => {
        apply(['e', 'f', 'g', 'h']);
    });

    test('swap backward edge', () => {
        list.set(['milk', 'bread', 'chips', 'cookie', 'honey']);
        list.set(['chips', 'bread', 'cookie', 'milk', 'honey']);
    });
});

describe('Testing an multi child each control flow', () => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode('z'));
    const list = createAtom([n1, n2, n3, n4]);
    const Component = <For each={list}>{(item) => <>{item}</>}</For>;

    function apply(array: string[]) {
        list.set(array);
        expect(div.innerHTML).toBe(array.join('') + 'z');
        list.set([n1, n2, n3, n4]);
        expect(div.innerHTML).toBe(abcd + 'z');
    }

    test('Create each control flow', () => {
        insertBefore(div, Component, div.firstChild as Element);
        expect(div.innerHTML).toBe(abcd + 'z');
    });

    test('1 missing', () => {
        apply([n2, n3, n4]);
        apply([n1, n3, n4]);
        apply([n1, n2, n4]);
        apply([n1, n2, n3]);
    });

    test('2 missing', () => {
        apply([n3, n4]);
        apply([n2, n4]);
        apply([n2, n3]);
        apply([n1, n4]);
        apply([n1, n3]);
        apply([n1, n2]);
    });

    test('3 missing', () => {
        apply([n1]);
        apply([n2]);
        apply([n3]);
        apply([n4]);
    });

    test('all missing', () => {
        apply([]);
    });

    test('swaps', () => {
        apply([n2, n1, n3, n4]);
        apply([n3, n2, n1, n4]);
        apply([n4, n2, n3, n1]);
    });

    test('rotations', () => {
        apply([n2, n3, n4, n1]);
        apply([n3, n4, n1, n2]);
        apply([n4, n1, n2, n3]);
    });

    test('reversal', () => {
        apply([n4, n3, n2, n1]);
    });

    test('full replace', () => {
        apply(['e', 'f', 'g', 'h']);
    });

    test('swap backward edge', () => {
        list.set(['milk', 'bread', 'chips', 'cookie', 'honey']);
        list.set(['chips', 'bread', 'cookie', 'milk', 'honey']);
    });
});

describe('Testing an only child each control flow with fragment children', () => {
    const list = createAtom([n1, n2, n3, n4]);
    const div = (
        <div>
            <For each={list}>
                {(item) => (
                    <>
                        {item}
                        {item}
                    </>
                )}
            </For>
        </div>
    ) as HTMLDivElement;

    function apply(array: string[]) {
        list.set(array);
        expect(div.innerHTML).toBe(array.map((p) => `${p}${p}`).join(''));
        list.set([n1, n2, n3, n4]);
        expect(div.innerHTML).toBe(aabbccdd);
    }

    test('Create each control flow', () => {
        expect(div.innerHTML).toBe(aabbccdd);
    });

    test('1 missing', () => {
        apply([n2, n3, n4]);
        apply([n1, n3, n4]);
        apply([n1, n2, n4]);
        apply([n1, n2, n3]);
    });

    test('2 missing', () => {
        apply([n3, n4]);
        apply([n2, n4]);
        apply([n2, n3]);
        apply([n1, n4]);
        apply([n1, n3]);
        apply([n1, n2]);
    });

    test('3 missing', () => {
        apply([n1]);
        apply([n2]);
        apply([n3]);
        apply([n4]);
    });

    test('all missing', () => {
        apply([]);
    });

    test('swaps', () => {
        apply([n2, n1, n3, n4]);
        apply([n3, n2, n1, n4]);
        apply([n4, n2, n3, n1]);
    });

    test('rotations', () => {
        apply([n2, n3, n4, n1]);
        apply([n3, n4, n1, n2]);
        apply([n4, n1, n2, n3]);
    });

    test('reversal', () => {
        apply([n4, n3, n2, n1]);
    });

    test('full replace', () => {
        apply(['e', 'f', 'g', 'h']);
    });

    test('swap backward edge', () => {
        list.set(['milk', 'bread', 'chips', 'cookie', 'honey']);
        list.set(['chips', 'bread', 'cookie', 'milk', 'honey']);
    });
});

describe('Testing an only child each control flow with array children', () => {
    const list = createAtom([n1, n2, n3, n4]);
    const div = (
        <div>
            {/* @ts-ignore */}
            <For each={list}>{(item) => [item, item]}</For>
        </div>
    ) as Element;

    function apply(array: string[]) {
        list.set(array);
        expect(div.innerHTML).toBe(array.map((p) => `${p}${p}`).join(''));
        list.set([n1, n2, n3, n4]);
        expect(div.innerHTML).toBe(aabbccdd);
    }

    test('Create each control flow', () => {
        expect(div.innerHTML).toBe(aabbccdd);
    });

    test('1 missing', () => {
        apply([n2, n3, n4]);
        apply([n1, n3, n4]);
        apply([n1, n2, n4]);
        apply([n1, n2, n3]);
    });

    test('2 missing', () => {
        apply([n3, n4]);
        apply([n2, n4]);
        apply([n2, n3]);
        apply([n1, n4]);
        apply([n1, n3]);
        apply([n1, n2]);
    });

    test('3 missing', () => {
        apply([n1]);
        apply([n2]);
        apply([n3]);
        apply([n4]);
    });

    test('all missing', () => {
        apply([]);
    });

    test('swaps', () => {
        apply([n2, n1, n3, n4]);
        apply([n3, n2, n1, n4]);
        apply([n4, n2, n3, n1]);
    });

    test('rotations', () => {
        apply([n2, n3, n4, n1]);
        apply([n3, n4, n1, n2]);
        apply([n4, n1, n2, n3]);
    });

    test('reversal', () => {
        apply([n4, n3, n2, n1]);
    });

    test('full replace', () => {
        apply(['e', 'f', 'g', 'h']);
    });

    test('swap backward edge', () => {
        list.set(['milk', 'bread', 'chips', 'cookie', 'honey']);
        list.set(['chips', 'bread', 'cookie', 'milk', 'honey']);
    });
});

describe('Testing each control flow with fallback', () => {
    const list = createAtom<string[]>([]);
    const div = (
        <div>
            <For each={list} fallback={() => 'Empty'}>
                {(item) => item}
            </For>
        </div>
    ) as Element;

    test('Create each control flow', () => {
        expect(div.innerHTML).toBe('Empty');
        list.set([n1, n2, n3, n4]);
        expect(div.innerHTML).toBe('abcd');
        list.set([]);
        expect(div.innerHTML).toBe('Empty');
    });
});

describe('Testing each that maps to undefined', () => {
    const list = createAtom<string[]>([]);
    const div = (
        <div>
            {/* @ts-ignore */}
            <For each={list}>{(item) => undefined}</For>
        </div>
    ) as Element;

    test('Create each control flow', () => {
        expect(div.innerHTML).toBe('');
        list.set([n1, n2, n3, n4]);
        expect(div.innerHTML).toBe('');
        list.set([]);
        expect(div.innerHTML).toBe('');
    });
});

describe('Testing each with indexes and atomic props', () => {
    const list = createAtom([] as string[]);
    const active = createAtom({
        [n1]: false,
        [n2]: false,
        [n3]: false,
        [n4]: false,
    } as Record<string, boolean>);
    const getColor = (active: boolean): string => (active ? 'red' : 'green');
    const toColor = (n: string) => from(useObject(active, [n])[n], getColor);

    const div = (
        <div>
            <For each={list} fallback={() => <span>Hi</span>}>
                {(item, i) => {
                    return (
                        <span style={{ color: toColor(item) }}>
                            {item}
                            {i}
                        </span>
                    );
                }}
            </For>
        </div>
    ) as HTMLDivElement;

    function toSpan(array: string[], colors: Record<string, boolean>) {
        return array.reduce(
            (c, n, i) =>
                c +
                `<span style="color: ${getColor(colors[n])};">${n}${i}</span>`,
            '',
        );
    }
    function apply(array: string[], nextActive: Record<string, boolean> = {}) {
        list.set(array);
        active.set(nextActive);
        expect(div.innerHTML).toBe(toSpan(array, active.value));
    }

    test('Create each control flow', () => {
        expect(div.innerHTML).toBe('<span>Hi</span>');

        apply([n1, n2, n3, n4]);

        /* apply([n2, n3, n4, n1], { [n2]: true });

        apply([n3, n4, n1], { [n3]: true });

        apply([n3, n2, n4, n1], { [n3]: true });

        list.set([]);
        expect(div.innerHTML).toBe('<span>Hi</span>');

        apply([n1]); */
    });
});
