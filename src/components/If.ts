import { createEmptyNode, replaceWith } from '../renderer';
import { Atom } from '../types';

interface Props {
    exp: Atom<any>;
    children(): JSX.Element;
}

const createCondition = (positive: boolean) => ({ exp, children }: Props) => {
    const blankNode = createEmptyNode();

    const show = () => positive ? !!exp.value : !exp.value;

    const render = () => {
        return show() ? children() : blankNode;
    }

    let current = render();

    exp.subscribe(() => {
        const next = render();
        replaceWith(current, next);
        current = next;
    });

    return current;
};

export const If = createCondition(true);
export const Else = createCondition(false);
