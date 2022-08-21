import { describe, expect, test } from "vitest";
import { createAtom, isAtomic } from "./atom";
import { createForm } from "./form";

describe('createForm', () => {
    const fields = ['username', 'password'] as const;
    const values = { username: 'user1', password: '123' };

    test('regular', () => {
        const [models, form] = createForm(fields);
        for (const field of fields) {
            expect(isAtomic(models[field])).toBe(true);
            expect(models[field].value).toBe('');
        }
        form.set(values);
        expect(form.values()).toStrictEqual(values);
        form.reset();
        expect(form.values()).toStrictEqual({ username: '', password: '' });
    });

    test('with initial object', () => {
        const [, form] = createForm(fields, values);
        expect(form.values()).toStrictEqual(values);
    });

    test('with initial atom', () => {
        const initial = createAtom({ username: 'user2', password: 123 });
        const [, form] = createForm(fields, initial);
        expect(form.values()).toStrictEqual(initial.value);
        initial.set({ username: 'next', password: 10 });
        expect(form.values()).toStrictEqual(initial.value);
    });

    test('with initial object of atoms', () => {
        const initial = { password: createAtom(123) };
        const [{ password }] = createForm(fields, initial);
        expect(password.value).toBe(123);
        initial.password.set(1234);
        expect(password.value).toBe(1234);
    });
});