import { isAtomic } from "../reactive/atom";
import { Atom, BasicObject } from "../types";

type Directive = (el: HTMLElement, propValue: any) => BasicObject;

const directives = {} as Record<string, Directive>;

const declareDirective = (name: string, directive: Directive) => {
    if (!name.startsWith('$')) {
        return console.warn('Directive name should start with $');
    }
    directives[name] = directive;
}

const applyDirectives = (el: HTMLElement, props: BasicObject) => {
    const data: BasicObject = {};
    for (const dirName in directives) {
        if (dirName in props) {
            Object.assign(data, directives[dirName](el, props[dirName]));
            delete props[dirName];
        }
    }
    Object.assign(props, data);
}

type InputEl = HTMLInputElement | HTMLSelectElement;

const $model = (el: HTMLElement, atom: Atom<string>): BasicObject => {
    if (!isAtomic(atom)) return {};
    return (el as InputEl).type === 'checkbox'
        ? {
            checked: atom,
            onchange: (e: any) => atom.set(e.target.checked),
        }
        : { value: atom, onchange: (e: any) => atom.set(e.target.value) };
};

declareDirective('$model', $model);

export { applyDirectives, declareDirective };
