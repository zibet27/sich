import { expect, test, vi } from "vitest";
import { Atom } from "../types";
import { createAtom } from "./atom";
import { applyProviders, createContext, createProvider, useContext } from "./context";

test('context', () => {
    const ctx = createContext<{ count: Atom<number> }>();
    const ctxValue = { count: createAtom(0) };
    const Provider = vi.fn(() => {
        return createProvider(ctx, ctxValue);
    });
    expect(useContext(ctx)).toBe(undefined);
    const component = vi.fn();
    applyProviders(component, Provider)({ children: [] });
    expect(Provider).toBeCalled();
    expect(useContext(ctx)).toStrictEqual(ctxValue);
});