export interface BaseRenderer<E> {
    createElement(tag: string): E;
    createTextNode(text: string): E;
    createEmptyNode(): E;
    getParent(node: E): E;
    insertNode(parent: E, child: E | E[]): void;
    removeNode(node: E | E[]): void;
    replaceWith(curNode: E | E[], nextNode: E | E[]): void;
    cloneNode(node: E, deep?: boolean): E;
    modifyClone(node: E, cloneFn: ModifiedCloneFn<E>): void;
}

export type ModifiedCloneFn<E> = (initialClone: CloneFn<E>) => CloneFn<E>;

export type CloneFn<E> = (deep?: boolean) => E;