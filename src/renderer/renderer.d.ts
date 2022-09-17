export type ModifiedCloneFn<E> = (initialClone: CloneFn<E>) => CloneFn<E>;

export type CloneFn<E> = (deep?: boolean) => E;

interface BaseRendererOptions<NodeType> {
    createElement(tag: string): NodeType;
    createTextNode(value: string): NodeType;
    replaceText(textNode: NodeType, value: string): void;
    setProperty(node: NodeType, key: string | string[], value: any): void;
}

export interface RendererOptions<NodeType> extends BaseRendererOptions<NodeType> {
    insertNode(parent: NodeType, node: NodeType, before?: NodeType): void;
    removeNode(node: NodeType): void;
    getParentNode(node: NodeType): NodeType;
    getFirstChild(node: NodeType): NodeType;
    getNextSibling(node: NodeType): NodeType;
}

export interface Renderer<NodeType> extends BaseRendererOptions<NodeType> {
    createEmptyNode(): NodeType;
    getParent(node: NodeType): NodeType;
    insert(parent: NodeType, child: NodeType): void;
    insertBefore(
        parent: NodeType,
        child: NodeType,
        before: NodeType,
    ): void;
    insertAfter(
        parent: NodeType,
        child: NodeType,
        after: NodeType,
    ): void;
    remove(node: NodeType): void;
    replaceWith(curNode: NodeType, nextNode: NodeType, parent?: NodeType): void;
}