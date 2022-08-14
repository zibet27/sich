import { setCloneEnabled } from '../global';
import {
    createEmptyNode,
    getParent,
    insertNode,
    removeNode,
    replaceWith
} from '../renderer';
import { Atom, RenderFn } from '../types';
import { equal, NodesCache } from '../utils';

interface Props<T> {
    each: Atom<T[]>;
    equalsFn?: (prev: T, next: T) => boolean;
    children: RenderFn<T>
}


export const For = <T>({ each, children, equalsFn }: Props<T>) => {
    setCloneEnabled(true);

    let arr = each.value;
    let parentNode: ParentNode | null;
    const eq = equalsFn ?? equal;
    const root = createEmptyNode();
    const cache = new NodesCache(children);
    let nodes = arr.map(cache.create);

    const exit = () => {
        setCloneEnabled(false);
        arr = each.value;
    }

    each.subscribe((nextArr) => {
        setCloneEnabled(true);
        const curLength = arr.length;
        const newLength = nextArr.length;

        if (!parentNode && nodes[0]) {
            parentNode = getParent(nodes[0]);
        }

        // fast create
        if (curLength === 0) {
            const newNodes = nextArr.map(cache.create);
            const parent = parentNode || getParent(root);
            if (parent) insertNode(parent as Element, newNodes);
            nodes = newNodes;
            return exit();
        }

        // fast clear
        if (newLength === 0) {
            removeNode(nodes);
            cache.clear();
            nodes = [];
            return exit();
        }

        const replacedItems = new Set<T>();

        for (let i = 0; i < newLength; i++) {
            if (eq(nextArr[i], arr[i])) {
                continue;
            }
            const nextValue = nextArr[i];
            const nextNode = cache.get(nextValue, i);
            if (i < curLength) {
                replacedItems.add(arr[i]);
                if (replacedItems.has(nextValue)) {
                    replacedItems.delete(nextValue);
                }
                replaceWith(nodes[i], nextNode);
                nodes[i] = nextNode;
            } else {
                const parent = parentNode || getParent(root);
                if (!parent) continue;
                nodes.push(nextNode);
                insertNode(parent as Element, nextNode);
            }
        }

        cache.delete(replacedItems);

        if (curLength > newLength) {
            for (let i = newLength; i < curLength; i++) {
                removeNode(nodes.pop()!);
            }
        }

        exit();
    });

    setCloneEnabled(false);
    return nodes.length > 0 ? nodes : root;
};
