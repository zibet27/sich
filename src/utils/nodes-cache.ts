import { isArray, toNode } from '.';
import { createAtom } from '../reactive/atom';
import { RenderFn } from '../types';

const readonly = { readonly: true } as const;

type E = JSX.Element;
type SetIndexFn = (value: number) => void;

class NodesCache<T> {
    nodes: E[];
    #cache = new Map<T, E[]>();
    #nextCache = new Map<T, E[]>();
    #indexes = new Map<T, SetIndexFn | SetIndexFn[]>();

    constructor(
        private readonly render: RenderFn<T, true>,
        private readonly equalsFn: (prev: T, next: T) => boolean,
        initial: T[],
    ) {
        this.nodes = initial.map(this.create);
    }

    private create = (item: T, index: number) => {
        const [atomicIndex, setIndex] = createAtom(index, readonly);
        const node = toNode(this.render(item, atomicIndex));
        this.#indexes.set(item, setIndex);
        this.#nextCache.set(item, [node]);
        return node;
    };

    private clone(nodes: E[], item: T, index: number) {
        const node = nodes.pop()!;
        this.changeIndex(item, index, nodes.length);
        this.setToNextCache(item, node);
        return node;
    }

    private setToNextCache(item: T, node: E) {
        const saved = this.#nextCache.get(item);
        if (!saved) this.#nextCache.set(item, [node]);
        else saved.push(node);
    };

    private changeIndex(item: T, nextIndex: number, itemIndex: number) {
        const setIndex = this.#indexes.get(item)!;
        if (isArray(setIndex)) setIndex[itemIndex](nextIndex);
        else setIndex(nextIndex);
    }

    private clearNextCache() {
        this.#cache = this.#nextCache;
        this.#nextCache = new Map();
    }

    map(arr: T[], nextArr: T[]) {
        const curLength = arr.length;
        const newLength = nextArr.length;

        // fast create
        if (curLength === 0) {
            const nextNodes = nextArr.map(this.create);
            this.clearNextCache();
            return nextNodes;
        }
        // fast clear
        if (newLength === 0) {
            this.#cache.clear();
            this.#indexes.clear();
            return [];
        }

        let nextValue: T;
        const nextNodes = new Array<E>(newLength);

        for (let i = 0; i < newLength; i++) {
            nextValue = nextArr[i];
            if (this.equalsFn(nextValue, arr[i])) {
                this.setToNextCache(nextValue, this.nodes[i]);
                this.#cache.get(nextValue)?.pop();
                nextNodes[i] = this.nodes[i];
                continue;
            }
            const nodes = this.#cache.get(nextValue);
            nextNodes[i] = nodes?.length
                ? this.clone(nodes, nextValue, i)
                : this.create(nextValue, i);
        }

        this.clearNextCache();
        return nextNodes;
    }
}

export { NodesCache };
