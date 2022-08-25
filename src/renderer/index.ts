import { CloneEnabled } from '../global';
import { isAtomic } from '../reactive/atom';
import { onAppMounted } from '../reactive/hooks';
import { AtomicProps, Component, BasicObject, Child } from '../types';
import { isArray } from '../utils';
import { addAtom, bindAtomicChildren, bindProps } from './bind';
import { WebRenderer } from './web-renderer';

const applyProps = <T extends BasicObject>(
    parent: BasicObject,
    props: AtomicProps<T>
) => {
    for (const prop in props) {
        const value = props[prop];
        try {
            if (isAtomic(value)) {
                parent[prop] = value.value;
                value.subscribe((next: string) => {
                    parent[prop] = next;
                });
            } else if (typeof value === 'object' && !isArray(value)) {
                applyProps(parent[prop], value);
            } else {
                parent[prop] = value;
            }
        } catch (err) {
            console.warn(`Failed to applyProp ${prop} = ${value}`);
        }
    };
}

const appendChild = (parent: Element, child: Child, index = 0) => {
    if (isArray(child)) {
        for (let i = 0; i < child.length; i++) {
            appendChild(parent, child[i], i);
        }
        return;
    }
    if (isAtomic(child)) {
        const node = createTextNode(child.value);
        child.subscribe((updated) => {
            node.textContent = updated;
        });
        insertNode(parent, node);
        if (CloneEnabled) addAtom(parent, child, index);
    } else if (child instanceof Node) {
        insertNode(parent, child);
    } else {
        insertNode(parent, createTextNode(child as string));
    }
};

const prepareChildren = (c: JSX.Element[]) => {
    const isRenderFn = c.length === 1 && typeof c[0] === 'function';
    return isRenderFn ? c[0] : c;
}

const h = <P extends BasicObject>(
    tag: string | Component<Omit<P, 'ref'>>,
    props: P,
    ...children: JSX.Element[]
) => {
    if (typeof tag === 'function') {
        return tag({ ...props, children: prepareChildren(children) });
    }
    const el = createElement(tag);
    if (props) {
        if (props.ref) {
            props.ref.current = el;
            delete props.ref;
        }
        applyProps(el, props);
    }
    if (children) {
        appendChild(el, children);
    }
    if (CloneEnabled) {
        bindProps(el, props);
        bindAtomicChildren(el);
    }
    return el;
};

export const createFragment: Component<{}> = (p) => p.children;

const renderer = new WebRenderer();

export const {
    getParent,
    cloneNode,
    modifyClone,
    insertNode,
    insertBefore,
    insertAfter,
    removeNode,
    replaceWith,
    createElement,
    createTextNode,
    createEmptyNode,
} = renderer;

const createApp = (root: Element, app: Component<{}>) => {
    appendChild(root, h(app, {}));
    onAppMounted();
};

export { h, createApp, applyProps };

