import { parse } from '../vendor/@CesiumLabs-json5.ts';

import type {
    JSON5Array,
    JSON5Object,
    JSON5TypeNames,
    JSON5Types,
} from './types.ts';
import { JSON5_TYPE_NAMES } from './types.ts';

/**
 * Returns an expression parsed following a simplified JSON5 syntax.
 *
 * > **NOTE**: Arrays do not need start / end delimiters.
 * >
 * > Use `'Hello', 'World!'` instead of `['Hello', 'World!']`.
 *
 * @param type
 * @param expression
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import {
 *     JSON5_TYPE_NAMES,
 *     parseJSON5Expression,
 * } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     parseJSON5Expression(JSON5_TYPE_NAMES.array, `'Hello', 'World!'`),
 *     ['Hello', 'World!']
 * );
 * ```
 */
export function parseJSON5Expression(
    type: (typeof JSON5_TYPE_NAMES)['array'],
    expression: string,
): JSON5Array;
/**
 * Returns an expression parsed following a simplified JSON5 syntax.
 *
 * @param type
 * @param expression
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import {
 *     JSON5_TYPE_NAMES,
 *     parseJSON5Expression,
 * } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     parseJSON5Expression(JSON5_TYPE_NAMES.boolean, 'true'),
 *     true
 * );
 * ```
 */
export function parseJSON5Expression(
    type: (typeof JSON5_TYPE_NAMES)['boolean'],
    expression: string,
): boolean;
/**
 * Returns an expression parsed following a simplified JSON5 syntax.
 *
 * @param type
 * @param expression
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import {
 *     JSON5_TYPE_NAMES,
 *     parseJSON5Expression,
 * } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     parseJSON5Expression(JSON5_TYPE_NAMES.null, 'null'),
 *     null
 * );
 * ```
 */
export function parseJSON5Expression(
    type: (typeof JSON5_TYPE_NAMES)['null'],
    expression: string,
): null;
/**
 * Returns an expression parsed following a simplified JSON5 syntax.
 *
 * @param type
 * @param expression
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import {
 *     JSON5_TYPE_NAMES,
 *     parseJSON5Expression,
 * } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     parseJSON5Expression(JSON5_TYPE_NAMES.number, '42'),
 *     42
 * );
 * ```
 */
export function parseJSON5Expression(
    type: (typeof JSON5_TYPE_NAMES)['number'],
    expression: string,
): number;
/**
 * Returns an expression parsed following a simplified JSON5 syntax.
 *
 * > **NOTE**: Objects do not need start / end delimiters.
 * >
 * > Use `propA: 'Hello', propB: 'World!'` instead of `{ propA: 'Hello', propB: 'World!' }`
 *
 * @param type
 * @param expression
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import {
 *     JSON5_TYPE_NAMES,
 *     parseJSON5Expression,
 * } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     parseJSON5Expression(JSON5_TYPE_NAMES.object, `propA: 'Hello', propB: 'World!'`),
 *     { propA: 'Hello', propB: 'World!' }
 * );
 * ```
 */
export function parseJSON5Expression(
    type: (typeof JSON5_TYPE_NAMES)['object'],
    expression: string,
): JSON5Object;
/**
 * Returns an expression parsed following a simplified JSON5 syntax.
 *
 * @param type
 * @param expression
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import {
 *     JSON5_TYPE_NAMES,
 *     parseJSON5Expression,
 * } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     parseJSON5Expression(JSON5_TYPE_NAMES.string, 'Hello World!'),
 *     'Hello World!'
 * );
 * ```
 */
export function parseJSON5Expression(
    type: (typeof JSON5_TYPE_NAMES)['string'],
    expression: string,
): string;
export function parseJSON5Expression(
    type: JSON5TypeNames,
    expression: string,
): JSON5Types {
    switch (type) {
        case JSON5_TYPE_NAMES.array:
            return parse(`[${expression}]`);

        case JSON5_TYPE_NAMES.boolean:
            if (expression === 'true') {
                return true;
            } else if (expression === 'false') {
                return false;
            }

            // HACK: We would need to implement a proper parser to provide
            // the column and line details... so let's just return the expression
            // back.

            throw SyntaxError(
                `JSON5: invalid expression '${expression}'`,
            );

        case JSON5_TYPE_NAMES.null:
            if (expression === 'null') {
                return null;
            }

            throw SyntaxError(
                `JSON5: invalid expression '${expression}'`,
            );

        case JSON5_TYPE_NAMES.number: {
            if (expression === 'NaN') {
                return NaN;
            } else if (expression === 'Infinity') {
                return Number.POSITIVE_INFINITY;
            } else if (expression === '-Infinity') {
                return Number.NEGATIVE_INFINITY;
            }

            const parsed = expression.includes('.')
                ? parseFloat(expression)
                : parseInt(expression);

            if (isNaN(parsed)) {
                throw SyntaxError(
                    `JSON5: invalid expression '${expression}'`,
                );
            }

            return parsed;
        }

        case JSON5_TYPE_NAMES.object:
            return parse(`{${expression}}`);

        case JSON5_TYPE_NAMES.string:
            return expression;
    }

    throw new TypeError(
        `bad argument #1 to 'parseJSON5Expression' (unsupported type '${type}')`,
    );
}
