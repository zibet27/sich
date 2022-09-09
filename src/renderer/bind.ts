import { applyProps, cloneNode, insert, modifyClone, replaceText } from '.';
import { Atom, AtomicProps } from '../types';
import { isArray } from '../utils';

type El = JSX.Element;

const boundAtoms = new Map<El, Record<number, Atom<any>>>();

const addAtom = <T>(node: El, atom: Atom<T>, index: number) => {
    if (boundAtoms.has(node)) {
        boundAtoms.get(node)![index] = atom;
    } else {
        boundAtoms.set(node, { [index]: atom });
    }
};

const bindProps = <T extends object>(
    parent: Element,
    props: AtomicProps<T>
) => {
    modifyClone(parent, (clone) => (deep = false) => {
        const node = clone(deep) as Element;
        applyProps(node, props);
        return node;
    });
};

const bindAtomicChildren = (parent: Element) => {
    if (!boundAtoms.has(parent)) {
        return;
    }
    modifyClone(parent, (clone) => (deep = false) => {
        const atoms = boundAtoms.get(parent)!;
        const indexes = Object.keys(atoms || {});
        const node = clone(deep) as Element;
        for (const index of indexes) {
            atoms[+index].subscribe((updated) => {
                replaceText(node.childNodes[+index] as Element, updated);
            });
        }
        return node;
    });
};

const bindAtomicClone = (parent: El) => {
    if (isArray(parent)) {
        parent.forEach(bindAtomicClone);
        return;
    }
    modifyClone(parent, (cloneParent) => {
        const cloneWithChildren = (node: Element, start = false) => {
            const clone = (start ? cloneParent(false) : cloneNode(node, false)) as Element;
            const children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                insert(clone, cloneWithChildren(children[i] as Element));
            }
            return clone;
        };
        return cloneWithChildren.bind(null, parent, true);
    });
};

export { bindProps, bindAtomicChildren, bindAtomicClone, addAtom };
