import { AtomicProps, Child } from './types';

declare global {
    type DomElement = Element;
    type Ref<E> = { current: E | null };
    type RefProp<E> = { ref?: Ref<E> };
    type Dom<E extends JSX.Element> =
        Partial<AtomicProps<Omit<E, 'children' | 'innerHTML'>>>
        & RefProp<E>
        & { children?: Child | Child[] };
    type DomInput<E extends JSX.Element> = Dom<E> & { $model?: Atom<any> }

    namespace JSX {
        interface IntrinsicElements {
            div: Dom<HTMLDivElement>;
            button: Dom<HTMLButtonElement>;
            h1: Dom<HTMLHeadingElement>;
            h2: Dom<HTMLHeadingElement>;
            h3: Dom<HTMLHeadingElement>;
            h4: Dom<HTMLHeadingElement>;
            h5: Dom<HTMLHeadingElement>;
            h6: Dom<HTMLHeadingElement>;
            span: Dom<HTMLSpanElement>;
            a: Dom<HTMLAnchorElement>;
            p: Dom<HTMLParagraphElement>;
            input: DomInput<HTMLInputElement>;
            label: Dom<HTMLLabelElement>;
            select: DomInput<HTMLSelectElement>;
            option: Dom<HTMLOptionElement>;
            form: Dom<HTMLFormElement>;
        }
        type Element = DomElement | ArrayElement;
        interface ArrayElement extends Array<Element> { }
        interface ElementChildrenAttribute {
            children: {};
        }
    }
}
