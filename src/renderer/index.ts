import { CloneEnabled } from '../global';
import { isAtomic } from '../reactive/atom';
import { onAppMounted } from '../reactive/hooks';
import { AtomicProps, BasicObject, Child, Component } from '../types';
import { isArray } from '../utils';
import { addAtom, bindAtomicChildren, bindProps } from './bind';
import { createRenderer } from './createRenderer';
import { applyDirectives } from './directives';
import { RendererOptions } from './renderer';
import { webRendererOptions } from './web-renderer';

const applyProps = <T extends BasicObject>(
    parent: Element,
    props: AtomicProps<T>,
    prevKeys = [] as string[]
) => {
    for (const prop in props) {
        const value = props[prop];
        const keys = [...prevKeys, prop];
        try {
            if (isAtomic(value)) {
                value.subscribe((nextVal: any) => {
                    setProperty(parent, keys, nextVal);
                });
            } else if (typeof value === 'object') {
                applyProps(parent, value, keys);
                return;
            }
            setProperty(parent, keys, value?.value ?? value);
        } catch (err) {
            console.warn(`Failed to applyProp ${prevKeys.join('.')}.${prop} = ${value}`);
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
        child.subscribe(replaceText.bind(null, node));
        insert(parent, node);
        if (CloneEnabled) addAtom(parent, child, index);
    } else if (child instanceof Node) {
        insert(parent, child);
    } else {
        insert(parent, createTextNode(child as string));
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
    const el = createElement(tag) as Element;
    if (props) {
        if (props.ref) {
            props.ref.current = el;
            delete props.ref;
        }
        applyDirectives(el, props);
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

const webRenderer = createRenderer<JSX.Element>(webRendererOptions as RendererOptions<JSX.Element>);

export const {
    getParent,
    cloneNode,
    modifyClone,
    insert,
    insertBefore,
    insertAfter,
    remove,
    replaceWith,
    replaceText,
    setProperty,
    createElement,
    createTextNode,
    createEmptyNode,
} = webRenderer;

const createApp = (root: Element, app: Component<{}>) => {
    appendChild(root, h(app, {}));
    onAppMounted();
};

export { h, createApp, applyProps };

