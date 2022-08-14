import { createAtom } from './reactive/atom';
import { Atom, AtomicObject } from './types';

type UpdateStore<T extends object> = (
    next: Partial<T> | ((store: T) => Partial<T>)
) => void;

const createStore = <T extends object>(store: T) => {
    const selectedAtoms = {} as Record<keyof T, Atom<any>>;

    const set: UpdateStore<T> = (next) => {
        const value = next instanceof Function ? next(store) : next;
        Object.assign(store, value);
        for (const key in value) {
            selectedAtoms[key]?.set(value[key]!);
        }
    };

    const listen = <K extends keyof T>(key: K) => {
        const atom = createAtom(store[key]);
        selectedAtoms[key] = atom;
        return atom;
    };

    const selector = <K extends keyof T>(keys = Object.keys(store) as K[]) => {
        const selected = {} as AtomicObject<Pick<T, K>>;
        for (const key of keys) {
            selected[key] = selectedAtoms[key] ?? listen(key);
        }
        return selected;
    };

    return [selector, set] as const;
};

export { createStore };
