export type BasicObject = Record<string, any>;

export type AtomicObject<T> = {
    [Property in keyof T]: Atom<T[Property]>;
};

export type AtomicProps<Opts> = {
    [Property in keyof Opts]: Opts[Property] extends object
    ? Partial<AtomicProps<Opts[Property]>>
    : Opts[Property] | Atom<Opts[Property]>;
};

export type Atomic<T> = T | Atom<T> | ReadonlyAtom<T>;

export type Child = JSX.Element | JSX.Element[] | Atomic<string> | Atomic<number> | Atomic<boolean>;

export type Component<P extends object> = (
    props: P & { children: JSX.Element; }
) => JSX.Element;

export type SetFn<T> = (next: T | NextFn<T>) => void;

export interface AtomOptions<T, R extends boolean> {
    readonly?: R;
    compare?: boolean;
    equalsFn?: (prev: T, next: T) => boolean;
}

export interface Atom<T> {
    readonly value: T;
    readonly subscribers: Set<Subscriber<T>>;
    set: (next: T | NextFn<T>) => void;
    subscribe: (subscriber: Subscriber<T>) => void;
    unsubscribe: (subscriber: Subscriber<T>) => void;
}

export type ReadonlyAtom<T> = Omit<Atom<T>, 'set'>;

export type AtomRes<T, R extends boolean> = R extends true
    ? [ReadonlyAtom<T>, SetFn<T>]
    : Atom<T>;

export type NextFn<T> = (current: T) => T;

export type Subscriber<T> = (updatedValue: T) => void;

export type RenderFn<T, EnableStr = false> =
    (item: T, index: ReadonlyAtom<number>) => EnableStr extends true ? JSX.Element | string : JSX.Element;
