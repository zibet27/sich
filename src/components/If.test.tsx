/**
 * @vitest-environment jsdom
 */
import { h } from '../renderer';
import { expect, test, vi } from 'vitest';
import { createAtom } from '../reactive/atom';
import { Else, If } from './If';

test('If Else components', () => {
    const expression = createAtom(true);
    const onTrue = vi.fn(() => <div>True</div>);
    const onFalse = vi.fn(() => <div>False</div>);
    const parent = (
        <div>
            <If exp={expression}>{onTrue}</If>
            <Else exp={expression}>{onFalse}</Else>
        </div>
    ) as Element;
    expect(onTrue).toBeCalledTimes(1);
    expect(onFalse).toBeCalledTimes(0);
    expect(parent.textContent).toBe('True');
    expression.set(false);
    expect(onTrue).toBeCalledTimes(1);
    expect(onFalse).toBeCalledTimes(1);
    expect(parent.textContent).toBe('False');
});
