import type { ValueOf } from '../collections/mod.ts';

/**
 * Represents all the possible JavaScript types serializable to JSON5.
 *
 * @example
 * ```typescript
 * import type { JSON5Types } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * const my_value = true satisfies JSON5Types;
 * ```
 */
export type JSON5Types =
    | boolean
    | null
    | number
    | string
    | JSON5Array
    | JSON5Object;

/**
 * Represents an array made up of JSON5 serializable members.
 *
 * @example
 * ```typescript
 * import type { JSON5Array } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * const my_array = [42, 'Hello World'] satisfies JSON5Array;
 * ```
 */
export type JSON5Array = JSON5Types[];

/**
 * Represents an array made up of JSON5 serializable members.
 *
 * @example
 * ```typescript
 * import type { JSON5Object } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * const my_object = {
 *     hello: 'World!',
 * } satisfies JSON5Object;
 * ```
 */
export type JSON5Object = { [index: string]: JSON5Types | undefined };

/**
 * Represents an enumeration of JavaScript type names supported by JSON5.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { JSON5_TYPE_NAMES } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(JSON5_TYPE_NAMES.string, 'string');
 * ```
 */
export const JSON5_TYPE_NAMES = {
    array: 'array',

    boolean: 'boolean',

    null: 'null',

    number: 'number',

    string: 'string',

    object: 'object',
} as const;

/**
 * Represents a union of JavaScript type name literals supported by JSON5.
 *
 * @example
 * ```typescript
 * import type { JSON5TypeNames } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * const type_name = 'string' satisfies JSON5TypeNames;
 * ```
 */
export type JSON5TypeNames = ValueOf<typeof JSON5_TYPE_NAMES>;
