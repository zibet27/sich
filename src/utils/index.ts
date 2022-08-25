import { isAtomic } from '../reactive/atom';
import { createTextNode } from '../renderer';

export const equal = <T>(a: T, b: T) => a === b;

export const { isArray } = Array;

export const flat = (arr: any[]): any[] => {
    return arr.flatMap(i => isArray(i) ? flat(i) : i);
}

export const wait = (ms: number) => new Promise((resolve) => {
    setTimeout(resolve, ms)
});

type In = (Node | string) | In[];

export const toNode = (node: In): JSX.Element => {
    if (isArray(node)) return node.map(toNode);
    if (node instanceof Node) return node as JSX.Element;
    return createTextNode((isAtomic(node) ? node.value : node) ?? "");
}

export { NodesCache } from './nodes-cache';
