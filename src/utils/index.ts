export const equal = <T>(a: T, b: T) => a === b;

export const { isArray } = Array;

export const flat = (arr: any[]): any[] => {
    return arr.flatMap(i => isArray(i) ? flat(i) : i);
}

export { NodesCache } from './nodes-cache';
