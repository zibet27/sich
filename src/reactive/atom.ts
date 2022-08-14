import { Atom, AtomOptions, AtomRes, SetFn, Subscriber } from '../types';
import { equal } from '../utils';

const baseOptions: AtomOptions<any, any> = {
    compare: true,
    readonly: false,
    equalsFn: equal,
} as const;

const createAtom = <T, R extends boolean = false>(
    initial: T,
    options: AtomOptions<T, R> = baseOptions
) => {
    let value = initial;
    const { compare, readonly, equalsFn = equal } = options;
    const subscribers: Set<Subscriber<T>> = new Set();

    const atom = {
        get value() {
            return value;
        },
        get subscribers() {
            return subscribers;
        },
        subscribe: (subscriber: Subscriber<T>) => {
            subscribers.add(subscriber);
        },
        unsubscribe: (subscriber: Subscriber<T>) => {
            subscribers.delete(subscriber);
        },
    };

    const set: SetFn<T> = (next) => {
        const val = next instanceof Function ? next(value) : next;
        if (compare === true && equalsFn(value, val)) return;
        value = val;
        for (const s of subscribers) s(val);
    };

    if (!readonly) (atom as Atom<T>).set = set;

    return (readonly ? [atom, set] : atom) as AtomRes<T, R>;
};

const isAtomic = (obj: any): obj is Atom<any> =>
    typeof obj === 'object' && 'subscribe' in obj && 'value' in obj;

export { createAtom, isAtomic };
