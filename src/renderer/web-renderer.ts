import { flat, isArray } from "../utils";
import { BaseRenderer, ModifiedCloneFn } from "./renderer";

type E = Element | E[];

const getFirstChild = (node: E): Element => {
    return isArray(node) ? getFirstChild(node[0]) : node;
}

export const getNextSibling = (el: JSX.Element): Element => {
    return isArray(el)
        ? getNextSibling(el[el.length - 1])
        : el.nextSibling as Element;
}

export class WebRenderer implements BaseRenderer<E> {
    createElement = (tag: string) => {
        return document.createElement(tag);
    }
    createTextNode = (text: string): Element => {
        // @ts-ignore
        return document.createTextNode(text);
    }
    createEmptyNode = (): E => {
        // @ts-ignore
        return document.createTextNode('');
    }
    insertNode = (parent: Element, child: E) => {
        if (isArray(child)) parent.append(...flat(child));
        else parent.appendChild(child);
    }
    insertBefore = (parent: Element, child: E, before: E) => {
        const pointer = getFirstChild(before);
        if (isArray(child)) {
            for (const node of flat(child)) {
                parent.insertBefore(node, pointer);
            }
        } else {
            parent.insertBefore(child, pointer);
        }
    }
    insertAfter = (parent: Element, child: E, after: E) => {
        this.insertBefore(parent, child, getNextSibling(after));
    }
    removeNode = (element: E | E[]) => {
        if (isArray(element)) {
            for (const e of flat(element)) e.remove();
        } else {
            element.remove();
        }
    }
    getParent = (el: E): Element => {
        // @ts-ignore
        return isArray(el) ? this.getParent(el[0]) : el.parentNode;
    }
    replaceWith = (curElement: E, nextElement: E) => {
        if (isArray(curElement) || isArray(nextElement)) {
            const parent = this.getParent(curElement);
            this.insertBefore(parent, nextElement, curElement);
            this.removeNode(curElement);
        } else {
            curElement.replaceWith(nextElement);
        }
    }
    cloneNode = (node: E, deep?: boolean): E => {
        if (isArray(node)) {
            return node.map((e) => this.cloneNode(e, deep));
        }
        return node.cloneNode(deep) as E;
    }
    modifyClone = (node: E, cloneFn: ModifiedCloneFn<E>) => {
        if (isArray(node)) {
            for (const n of node) this.modifyClone(n, cloneFn);
            return;
        }
        const initialClone = node.cloneNode.bind(node);
        // @ts-ignore
        node.cloneNode = cloneFn(initialClone);
    }
}
