import { createAtom } from '../reactive/atom';
import { cloneNode, createEmptyNode } from '../renderer';
import { bindAtomicClone } from '../renderer/bind';
import { ReadonlyAtom, RenderFn } from '../types';

const readonly = { readonly: true } as const;

type E = JSX.Element;

class NodesCache<T> {
    private readonly cache = new Map<T, E>();
    private readonly indexes = new Map<T, ReadonlyAtom<number>>();

    constructor(private readonly render: RenderFn<T>) { }

    get = (item: T, index: number) => {
        const saved = this.cache.get(item);
        return saved
            ? this.clone(saved, item, index)
            : this.create(item, index);
    };

    clone = (node: E, item: T, index: number) => {
        const [nextIndex, setNextIndex] = createAtom(0, readonly);
        const curIndex = this.indexes.get(item)!;
        const start = curIndex.subscribers.size;
        const clone = cloneNode(node);
        let i = 0;
        for (const subscriber of curIndex.subscribers) {
            if (i++ < start) continue;
            nextIndex.subscribe(subscriber);
            curIndex.unsubscribe(subscriber);
        }
        setNextIndex(index);
        return clone;
    };

    create = (item: T, index: number) => {
        const [atomicIndex] = createAtom(index, readonly);
        const node = this.render(item, atomicIndex) || createEmptyNode();
        this.indexes.set(item, atomicIndex);
        this.cache.set(item, node);
        bindAtomicClone(node);
        return node;
    };

    clear = () => {
        this.cache.clear();
        this.indexes.clear();
    }

    delete = (iterator: Iterable<T>) => {
        for (const item of iterator) {
            this.cache.delete(item);
            this.indexes.delete(item);
        }
    };
}

export { NodesCache };
