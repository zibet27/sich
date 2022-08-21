import { expect, test } from "vitest";
import { createStore } from "./store";

test('store', () => {
    const [useStore, set] = createStore({ bears: 0 });
    const { bears } = useStore(['bears']);
    expect(bears.value).toBe(0);
    set({ bears: 11 });
    expect(bears.value).toBe(11);
});