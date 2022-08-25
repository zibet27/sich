import { createEmptyNode, replaceWith } from "../renderer";
import { Atom } from "../types";
import { toNode } from "../utils";

export interface SwitchProps {
    fallback?: () => JSX.Element | string;
    children: any;
}

interface MatchProps {
    when: Atom<any>;
    children: () => JSX.Element;
}

const Match = (props: MatchProps): JSX.Element => {
    // @ts-ignore
    return props;
}

const Switch = ({ fallback, children }: SwitchProps) => {
    const empty = () => (
        (fallback && toNode(fallback())) ?? createEmptyNode()
    );

    const render = () => {
        for (const child of children) {
            if (child.when.value) {
                return toNode(child.children());
            }
        }
        return empty();
    }

    let current = render();

    for (const child of children) {
        child.when.subscribe(() => {
            const nextChild = render();
            replaceWith(current, nextChild);
            current = nextChild;
        });
    }

    return current;
}

export { Switch, Match };
