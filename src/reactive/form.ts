import { Atom, Atomic, AtomicObject } from "../types";
import { createAtom, isAtomic } from "./atom";
import { createEffect } from "./hooks";

type Initial<K extends string, V = Atomic<FormTypes>> = Partial<Record<K, V>>;

type FormTypes = Atomic<string> | Atomic<boolean> | Atomic<number>;

type Get<K extends string, I extends Initial<K, any>> = {
    [Prop in K]:
    I[Prop] extends Atom<infer T>
    ? T
    : I[Prop] extends FormTypes ? I[Prop] : string;
}

const createForm = <K extends string, I extends Initial<K> = Initial<K, string>>(
    keys: readonly K[],
    initialValues = {} as I | Atom<I> | AtomicObject<I>
) => {
    type F = Get<K, I>;
    let initialized = false;
    const models = {} as AtomicObject<F>;
    const initIsAtom = isAtomic(initialValues);
    const initial = initIsAtom && initialValues.value;

    const getInitial = (k: K) => {
        if (initIsAtom) return initial[k];
        if (isAtomic((initialValues as AtomicObject<I>)[k])) {
            const initAtom = (initialValues as AtomicObject<I>)[k];
            if (!initialized) {
                initAtom.subscribe((v) => models[k].set(v as F[K]));
            }
            return initAtom.value;
        }
        return (initialValues as I)[k];
    }

    for (const key of keys) {
        models[key] = createAtom(getInitial(key) ?? "");
    }
    initialized = true;

    if (initIsAtom) createEffect(() => {
        const init = initialValues.value;
        if (!init) return;
        for (const key of keys) {
            if (init[key]) models[key].set(init[key]);
        }
    }, [initialValues]);

    const form = {
        set: (value: Partial<F>) => {
            for (const key in value) {
                models[key].set(value[key]!);
            }
        },
        values: () => {
            const val = {} as F;
            for (const key of keys) {
                val[key] = models[key].value;
            }
            return val;
        },
        reset: () => {
            for (const key of keys) {
                models[key].set(getInitial(key) ?? "");
            }
        }
    };

    return [models, form] as const;
}

export { createForm };