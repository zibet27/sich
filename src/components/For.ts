import { createEmptyNode, getParent, replaceWith } from '../renderer';
import { Atom, RenderFn } from '../types';
import { equal, NodesCache, toNode } from '../utils';

interface Props<T> {
    each: Atom<T[]>;
    equalsFn?: (prev: T, next: T) => boolean;
    children: RenderFn<T, true>;
    fallback?: () => JSX.Element | string;
}

export const For = <T>({ each, children, equalsFn, fallback }: Props<T>) => {
    let arr = each.value;
    let $root: JSX.Element;
    let parentNode: JSX.Element;
    const cache = new NodesCache(children, equalsFn ?? equal, arr);
    const root = () => {
        if (!$root) {
            $root = (fallback && toNode(fallback())) ?? createEmptyNode();
        }
        return $root;
    };

    each.subscribe((nextArr) => {
        const nodes = cache.nodes;
        if (!parentNode) {
            parentNode = getParent(nodes[0] ?? root());
        }
        const nextNodes = cache.map(arr, nextArr);
        replaceWith(
            nodes.length ? nodes : root(),
            nextNodes.length ? nextNodes : root(),
            parentNode
        );
        cache.nodes = nextNodes;
        arr = nextArr;
    });

    return cache.nodes.length > 0 ? cache.nodes : root();
};
