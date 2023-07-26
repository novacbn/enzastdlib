import { ValidationError } from '../errors/mod.ts';

import { parseJSON5ExpressionRecord } from '../json5/mod.ts';

import type { Error, JSONSchemaObject } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

/**
 * Returns `Error` objects of any validation errors that have occured regarding the
 * specified environment variables, if any.
 *
 * > **NOTE**: To specify environment variables to test you **MUST** supply a JSON
 * > Schema that defines a top-level object.
 *
 * > **NOTE**: Only second-level keys are used for testing environment variables.
 *
 * @param schema
 * @returns
 *
 * @example
 * **terminal**
 * ```bash
 * export MY_STRING='Hello World!'
 * ```
 *
 * **schema.ts**
 * ```typescript
 * import type { JSONSchema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * export const MY_STRING_SCHEMA = {
 *     type: 'object',
 *
 *     properties: {
 *         MY_STRING: {
 *             type: 'string',
 *
 *             minLength: 1,
 *         },
 *     },
 * } as const satisfies JSONSchema;
 * ```
 *
 * **mod.ts**
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { testEnvironment } from 'https://deno.land/x/enzastdlib/environment/mod.ts';
 *
 * import { MY_STRING_SCHEMA } from './schema.ts';
 *
 * assertEquals(
 *     testEnvironment(MY_STRING_SCHEMA),
 *     undefined,
 * );
 * ```
 */
export function testEnvironment(
	schema: JSONSchemaObject,
): Error[] | undefined {
	const env = parseJSON5ExpressionRecord(schema, Deno.env.toObject());
	const validator = makeValidator(schema);

	return validator.test(env);
}

/**
 * Throws an exception if any validation errors occured regarding the specified environment
 * variables, otherwise returns the values of those environment variables.
 *
 * > **NOTE**: To specify environment variables to validate you **MUST** supply a JSON
 * > Schema that defines a top-level object.
 *
 * > **NOTE**: Only second-level keys are used for validate environment variables.
 *
 * @param schema
 * @returns
 *
 * @example
 * **terminal**
 * ```bash
 * export MY_STRING='Hello World!'
 * ```
 *
 * **schema.ts**
 * ```typescript
 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * export const MY_STRING_SCHEMA = {
 *     type: 'object',
 *
 *     properties: {
 *         MY_STRING: {
 *             type: 'string',
 *
 *             minLength: 1,
 *         },
 *     },
 * } as const satisfies JSONSchema;
 *
 * export type MyStringType = typeofschema<typeof MY_STRING_SCHEMA>;
 * ```
 *
 * **mod.ts**
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { validateEnvironment } from 'https://deno.land/x/enzastdlib/environment/mod.ts';
 *
 * import type { MyStringType } from "./schema.ts";
 * import { MY_STRING_SCHEMA } from './schema.ts';
 *
 * assertEquals(
 *     validateEnvironment<MyStringType>(MY_STRING_SCHEMA),
 *     { MY_STRING: 'Hello World!' },
 * );
 * ```
 */
export function validateEnvironment<Type>(
	schema: JSONSchemaObject,
): Type {
	const env = parseJSON5ExpressionRecord<Type>(schema, Deno.env.toObject());
	const validator = makeValidator<Type>(schema);

	const errors = validator.test(env);
	if (errors) {
		throw new ValidationError(
			`bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):\n\n${
				errors
					.map((error) => `${error.property}: ${error.message}`)
					.join('\n')
			}`,
		);
	}

	return env;
}
