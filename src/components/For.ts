import { setCloneEnabled } from '../global';
import {
    createEmptyNode, getParent, insertAfter, remove, replaceWith
} from '../renderer';
import { Atom, RenderFn } from '../types';
import { equal, NodesCache, toNode } from '../utils';

interface Props<T> {
    each: Atom<T[]>;
    equalsFn?: (prev: T, next: T) => boolean;
    children: RenderFn<T, true>;
    fallback?: () => JSX.Element | string;
}

export const For = <T>({ each, children, equalsFn = equal, fallback }: Props<T>) => {
    setCloneEnabled(true);

    let arr = each.value;
    let parentNode: JSX.Element;
    const cache = new NodesCache(children);
    let nodes = arr.map(cache.create);
    let $root: JSX.Element;
    const root = () => {
        if (!$root) {
            $root = (fallback && toNode(fallback())) ?? createEmptyNode();
        }
        return $root;
    };

    const exit = () => {
        setCloneEnabled(false);
        arr = each.value;
    }

    each.subscribe((nextArr) => {
        setCloneEnabled(true);
        const curLength = arr.length;
        const newLength = nextArr.length;

        if (!parentNode) {
            parentNode = getParent(nodes[0] ?? root());
        }

        // fast create
        if (curLength === 0) {
            const newNodes = nextArr.map(cache.create);
            replaceWith(root(), newNodes);
            nodes = newNodes;
            return exit();
        }

        // fast clear
        if (newLength === 0) {
            replaceWith(nodes, root());
            cache.clear();
            nodes = [];
            return exit();
        }

        const replacedItems = new Set<T>();

        for (let i = 0; i < newLength; i++) {
            if (equalsFn(nextArr[i], arr[i])) {
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
                insertAfter(parentNode, nextNode, nodes.at(-1)!);
                nodes.push(nextNode);
            }
        }

        cache.delete(replacedItems);

        if (curLength > newLength) {
            for (let i = newLength; i < curLength; i++) {
                remove(nodes.pop()!);
            }
        }

        exit();
    });

    setCloneEnabled(false);
    return nodes.length > 0 ? nodes : root();
};

