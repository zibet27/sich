import { createEmptyNode, replaceWith } from "../renderer";
import { Atom, Component } from "../types";

export interface SwitchProps<T> {
    value: Atom<T>;
    fallback?: Component<{}>;
    children: any;
}

interface MatchProps<T> {
    when: T;
    and?: Atom<boolean>;
    children: () => JSX.Element;
}

const Match = <T>(props: MatchProps<T>): JSX.Element => {
    // @ts-ignore
    return props;
}

const Switch = <T>(props: SwitchProps<T>) => {
    const render = (value: T) => {
        for (const child of props.children) {
            if (child.when !== value) continue;
            if (child.and && !child.and.value) continue;
            return child.children();
        }
        return (
            props.fallback && props.fallback({ children: [] })
        ) ?? createEmptyNode();
    }

    let current = render(props.value.value);

    props.value.subscribe((next) => {
        const nextChild = render(next);
        replaceWith(current, nextChild);
        current = nextChild;
    });

    return current;
}

export { Switch, Match };