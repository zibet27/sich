import { describe, expect, test } from "vitest";
import { flat } from ".";

describe('utils', () => {
    test('flat', () => {
        const arr = [[[1]], [2], [[3]]];
        const flatArr = flat(arr);
        expect(flatArr).toStrictEqual([1, 2, 3]);
    });
})