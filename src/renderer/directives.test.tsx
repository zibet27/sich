/**
 * @vitest-environment jsdom
 */
import { describe, expect, test } from 'vitest';
import { h } from './';
import { createAtom } from '../reactive/atom';
import { from } from '../reactive/utils';
import { Atom } from '../types';
import { declareDirective } from './directives';

describe('directives', () => {
    test('$model directive', () => {
        const model = createAtom('');
        const input = (<input $model={model} />) as HTMLInputElement;
        // check two-way binding
        const nextValue = 'some new text';
        input.value = nextValue;
        const event = new Event('change', { bubbles: true, cancelable: true });
        input.dispatchEvent(event);
        expect(model.value).toBe(nextValue);
        model.set('');
        expect(input.value).toBe('');
    });

    test('custom directive', () => {
        declareDirective('$test', (_, active: Atom<boolean>) => {
            return {
                style: { color: from(active, (a) => (a ? 'red' : 'green')) },
            };
        });
        const active = createAtom(false);
        // @ts-ignore
        const div = (<div $test={active}></div>) as HTMLDivElement;
        expect(div.style.color).toBe('green');
        active.set(true);
        expect(div.style.color).toBe('red');
    });
});
