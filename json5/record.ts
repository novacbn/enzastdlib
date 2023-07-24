import { parseJSON5Expression } from './expression.ts';

import type { JSONSchema, JSONSchemaObject } from '../schema/mod.ts';

/**
 * Represents a record of JSON5 expressions.
 *
 * @example
 * ```typescript
 * import type { JSON5ExpressionRecord } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * const record = {
 *     myArray: `'Hello', 'World!'`,
 * } satisfies JSON5ExpressionRecord;
 * ```
 */
export type JSON5ExpressionRecord = Record<string, string | undefined>;

/**
 * Returns an expression parsed following a simplified JSON5 syntax using a
 * a JSON Schema for type hinting.
 *
 * > **WARNING**: Only top-level keys are used for type hinting during parsing.
 *
 * @param schema
 * @param record
 * @returns
 *
 * @exanoke
 * **schema.ts**
 * ```typescript
 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * export const MY_SCHEMA = {
 *     type: 'object',
 *
 *     required: ['_'],
 *     additionalProperties: false,
 *
 *     properties: {
 *         myArray: {
 *             type: 'array',
 *
 *             items: {
 *                 type: 'string',
 *             },
 *         },
 *     },
 * } as const satisfies JSONSchema;
 *
 * export type MySchemaType = typeofschema<typeof MY_SCHEMA>;
 * ```
 *
 * **mod.ts**
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { parseJSON5ExpressionRecord } from 'https://deno.land/x/enzastdlib/json5/mod.ts';
 *
 * import type { MySchemaType } from "./schema.ts";
 * import { MY_SCHEMA } from "./schema.ts";
 *
 * const parsed = parseJSON5ExpressionRecord<MySchemaType>(MY_SCHEMA, {
 *     myArray: `'Hello', 'World!'`,
 * });
 *
 * assertEquals(parsed, {
 *     myArray: ['Hello', 'World!'],
 * });
 * ```
 */
export function parseJSON5ExpressionRecord<Type>(
	schema: JSONSchemaObject,
	record: JSON5ExpressionRecord,
): Type {
	return Object.fromEntries(
		Object
			.entries(schema.properties ?? {})
			.map(([key, schema]) => {
				const type = (schema as JSONSchema).type!;
				const value = record[key];

				if (value === undefined) return [key, undefined];

				const parsed = parseJSON5Expression(
					// HACK: Function overloads are much stricter than union argument types.
					// deno-lint-ignore no-explicit-any
					type as any,
					value,
				);

				return [key, parsed];
			})
			// HACK: Cloudflare's JSON Schema validator errors on `undefined` values so we need to filter those out.
			.filter(([_variable, value]) => value !== undefined),
	);
}
