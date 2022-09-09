import { flat, isArray } from '../utils';
import { ModifiedCloneFn, Renderer, RendererOptions } from './renderer';

export const createRenderer = <NodeType>(self: RendererOptions<NodeType>): Renderer<NodeType> => {
    const getFirstChild = (node: NodeType): NodeType => {
        return isArray(node) ? getFirstChild(node[0]) : node;
    };
    const getNextSibling = (node: NodeType): NodeType => {
        return isArray(node)
            ? getNextSibling(node[node.length - 1])
            : self.getNextSibling(node);
    };
    const getParent = (node: NodeType): NodeType => {
        return isArray(node) ? getParent(node[0]) : self.getParentNode(node);
    };

    const createEmptyNode = () => {
        return self.createTextNode('');
    };
    const insert = (parent: NodeType, child: NodeType) => {
        if (isArray(child)) {
            child.forEach(insert.bind(null, parent));
        } else self.insertNode(parent, child);
    };
    const insertBefore = (
        parent: NodeType,
        child: NodeType,
        before: NodeType,
    ) => {
        const nodeBefore = getFirstChild(before);
        if (isArray(child)) {
            for (const node of flat(child)) {
                self.insertNode(parent, node, nodeBefore);
            }
        } else {
            self.insertNode(parent, child, nodeBefore);
        }
    };
    const insertAfter = (
        parent: NodeType,
        child: NodeType,
        after: NodeType,
    ) => {
        insertBefore(parent, child, getNextSibling(after));
    };

    const remove = (node: NodeType) => {
        if (isArray(node)) node.forEach(remove);
        else self.removeNode(node);
    };
    const replaceWith = (curNode: NodeType, nextNode: NodeType) => {
        const parent = getParent(curNode);
        insertBefore(parent, nextNode, curNode);
        remove(curNode);
    };
    const cloneNode = (node: NodeType, deep = false): NodeType => {
        // @ts-ignore
        return isArray(node)
            ? node.map((e) => cloneNode(e, deep))
            : self.cloneNode(node, deep);
    };
    const modifyClone = (
        node: NodeType,
        cloneFn: ModifiedCloneFn<NodeType>,
    ) => {
        if (isArray(node)) {
            for (const n of node) modifyClone(n, cloneFn);
        } else self.modifyClone(node, cloneFn);
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
        cloneNode,
        modifyClone,
    };
};
