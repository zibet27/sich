import { Atom, AtomicObject } from "../types";
import { createAtom } from "./atom";

const from = <R, T>(atom: Atom<T>, listener: (value: T) => R) => {
    const result = createAtom(listener(atom.value));
    atom.subscribe((next) => {
        result.set(listener(next));
    });
    return result;
}

const useIndex = <T>(arr: Atom<T[]>, index: number) => {
    const atom = createAtom(arr.value[index]);
    arr.subscribe((val) => atom.set(val[index]));
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