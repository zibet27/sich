import { isArray } from '../utils';
import { Renderer, RendererOptions } from './renderer';

const getFirstElement = <N>(node: N): N => {
    return isArray(node) ? getFirstElement(node[0]) : node;
};

const forEach = <N>(node: N | N[], fn: (n: N) => void) => {
    if (!isArray(node)) return fn(node);
    for (const n of node) {
        if (isArray(n)) forEach(n, fn);
        else fn(n);
    }
}

export const createRenderer = <N>(self: RendererOptions<N>): Renderer<N> => {
    const getNextSibling = (node: N): N => {
        return isArray(node)
            ? getNextSibling(node[node.length - 1])
            : self.getNextSibling(node);
    };
    const getParent = (node: N): N => {
        return isArray(node) ? getParent(node[0]) : self.getParentNode(node);
    };

    const createEmptyNode = () => {
        return self.createTextNode('');
    };
    const insert = (parent: N, child: N) => {
        forEach(child, (n) => self.insertNode(parent, n));
    };

    const insertBefore = (parent: N, child: N, before: N) => {
        const nodeBefore = getFirstElement(before);
        forEach(child, (node) => {
            self.insertNode(parent, node, nodeBefore);
        });
    };
    const insertAfter = (parent: N, child: N, after: N) => {
        insertBefore(parent, child, getNextSibling(after));
    };

    const remove = (node: N) => {
        forEach(node, self.removeNode);
    };

    const replaceWith = (curNode: N, nextNode: N, parent = getParent(curNode)) => {
        const nextSibling = getNextSibling(curNode);
        remove(curNode);
        if (nextSibling) insertBefore(parent, nextNode, nextSibling);
        else insert(parent, nextNode);
    };

    return {
        ...self,
        getParent,
        createEmptyNode,
        insert,
        insertBefore,
        insertAfter,
        remove,
        replaceWith,
    };
};
