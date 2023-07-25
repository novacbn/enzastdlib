import { parse, stringify } from '../vendor/@CesiumLabs-json5.ts';

/**
 * Parses a JSON5 document into a JavaScript value.
 *
 * @param text
 * @param reviver
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { parseJSON5 } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     parseJSON5(`{propA:'Hello',propB:'World!'}`),
 *     { propA: 'Hello', propB: 'World!' }
 * );
 * ```
 */
export const parseJSON5 = parse;

/**
 * Returns a JavaScript value stringified into a JSON5 document.
 *
 * @param value
 * @param replacer
 * @param space
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { stringifyJSON5 } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * assertEquals(
 *     stringifyJSON5({ propA: 'Hello', propB: 'World!' }),
 *     `{propA:'Hello',propB:'World!'}`
 * );
 * ```
 */
export const stringifyJSON5 = stringify;
