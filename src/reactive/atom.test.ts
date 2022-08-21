import { describe, expect, test, vi } from 'vitest';
import { createAtom, isAtomic } from './atom';

describe('atom', () => {
    test('regular atom', () => {
        const counter = createAtom(0);
        const subscriber = vi.fn();
        counter.subscribe(subscriber);
        counter.set(1);
        expect(subscriber).toBeCalled();
        expect(counter.subscribers.size).toBe(1);
        counter.unsubscribe(subscriber);
        expect(counter.subscribers.size).toBe(0);
    });

    test('compare option', () => {
        const VALUE = 1;
        const c1 = createAtom(VALUE, { compare: true });
        const c2 = createAtom(VALUE, { compare: false });
        const s1 = vi.fn();
        const s2 = vi.fn();
        c1.subscribe(s1);
        c2.subscribe(s2);
        c1.set(VALUE);
        c2.set(VALUE);
        expect(s1).not.toBeCalled();
        expect(s2).toBeCalled();
    });

    test('readonly option', () => {
        const regular = createAtom(1);
        const [atom, setAtom] = createAtom(0, { readonly: true });
        const subscriber = vi.fn();
        atom.subscribe(subscriber);
        setAtom(2);
        expect(subscriber).toBeCalled();
        expect(Array.isArray(regular)).toBeFalsy();
        expect(Object.hasOwn(atom, 'set')).toBeFalsy();
        expect(Object.hasOwn(regular, 'set')).toBeTruthy();
    });

    test('equalsFn option', () => {
        const equalLength = vi.fn(<T>(a: T[], b: T[]) => {
            return a.length === b.length;
        });
        const arr = createAtom([0], { equalsFn: equalLength });
        const subscriber = vi.fn();
        arr.subscribe(subscriber);
        arr.set([0, 1]);
        expect(subscriber).toBeCalled();
        expect(equalLength).toBeCalled();
    });

    test('isAtomic fn', () => {
        const atom = createAtom(true);
        const notAtom = { value: true };
        expect(isAtomic(atom)).toBeTruthy();
        expect(isAtomic(notAtom)).toBeFalsy();
    });
});