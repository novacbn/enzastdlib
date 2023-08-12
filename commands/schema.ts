import { makeDecorator } from '../decorators/mod.ts';

import type { JSONSchemaObject } from '../schema/mod.ts';

import { CommandCallback } from './command.ts';

/**
 * Associates a `JSONSchemaObject` value with the function.
 *
 * @example
 * **schema.ts**
 * ```typescript
 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * export const MY_STRING_SCHEMA = {
 *     type: 'object',
 *
 *     properties: {
 *         mystring: {
 *             type: 'string',
 *
 *             minLength: 1,
 *         },
 *     },
 * } as const satisfies JSONSchema;
 *
 * export type MyStringOptions = typeofschema<typeof MY_STRING_SCHEMA>;
 * ```
 *
 * **mycommand.ts**
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { schema } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
 *
 * import type { MyStringOptions } from './schema.ts';
 * import { MY_STRING_SCHEMA } from './schema.ts';
 *
 * schema(mycommand, MY_STRING_SCHEMA);
 * export function mycommand(options: MyStringOptions): void {
 *     assertEquals(
 *         options,
 *         { mystring: 'Hello World!' },
 *     );
 * }
 * ```
 *
 * **terminal**
 * ```bash
 * deno run ./mod.ts --mystring "Hello World!"
 * ```
 */
export const schema = makeDecorator<
    JSONSchemaObject,
    CommandCallback
>((func, _schema) => {
    schema.set(func, _schema);
});
