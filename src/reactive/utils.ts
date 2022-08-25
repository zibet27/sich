import { Atom, Atomic, AtomicObject } from "../types";
import { createAtom, isAtomic } from "./atom";

const from = <R, T>(atom: Atom<T>, listener: (value: T) => R) => {
    const result = createAtom(listener(atom.value));
    atom.subscribe((next) => {
        result.set(listener(next));
    });
    return result;
}

const useIndex = <T>(arr: Atom<T[]>, index: Atomic<number>) => {
    const isIndexAtomic = isAtomic(index);
    let indexNumber = isIndexAtomic ? index.value : index;
    const atom = createAtom(arr.value[indexNumber]);
    arr.subscribe((val: T[]) => {
        atom.set(val[indexNumber]);
    });
    if (isIndexAtomic) {
        index.subscribe((nextIndex) => {
            atom.set(arr.value[nextIndex]);
            indexNumber = nextIndex;
        });
    }
    return atom;
}

const useObject = <T extends object, K extends keyof T>(
    object: Atom<T>,
    keys = Object.keys(object.value) as K[]
) => {
    const value = object.value;
    const atoms = {} as AtomicObject<Pick<T, K>>;
    for (const key of keys) {
        atoms[key] = createAtom(value[key]);
    }
    object.subscribe((updated) => {
        for (const key of keys) {
            atoms[key].set(updated[key]);
        }
    });
    return atoms;
};

export { from, useIndex, useObject };