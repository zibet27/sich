import { Atom } from '../types';
import { createAtom } from './atom';

type Handler = () => void;

let isMounted = false;

const mountHandlers: Handler[] = [];

const onMount = (handler: Handler) => {
    if (isMounted) {
        setTimeout(onAppMounted, 0);
        isMounted = true;
    }
    mountHandlers.push(handler);
};

const onAppMounted = () => {
    for (let i = 0; i < mountHandlers.length; i++) {
        mountHandlers.pop()!();
    };
    isMounted = true;
};

const createEffect = (effect: () => void, dependencies: Atom<any>[]) => {
    onMount(effect);
    for (const dependency of dependencies) {
        dependency.subscribe(() => effect());
    }
};

const createMemo = <T>(computations: () => T, dependencies: Atom<any>[]) => {
    const result = createAtom(computations());
    for (const dependency of dependencies) {
        dependency.subscribe(() => {
            result.set(computations());
        });
    }
    return result;
};

const createRef = <E extends HTMLElement>(): Ref<E> => ({ current: null });

const createResource = <T>(request: () => Promise<T>, initial?: T) => {
    const loading = createAtom(false);
    const error = createAtom<any>(null);
    const response = createAtom<T | undefined>(initial);
    const fetch = () => {
        loading.set(true);
        return request()
            .then((res) => {
                response.set(res);
                return res;
            })
            .catch(error.set)
            .finally(() => loading.set(false));
    }
    onMount(fetch);
    return [response, { refetch: fetch, loading, error }] as const;
}

export {
    createResource,
    createEffect,
    createMemo,
    createRef,
    onMount,
    onAppMounted,
};

