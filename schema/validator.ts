import { Validator as CFWorkerValidator } from '../vendor/@cfworker-json-schema.ts';

import { ValidationError } from '../errors/mod.ts';

import type { Error } from './errors.ts';
import type { JSONSchema } from './schema.ts';
import { VERSION_SCHEMA } from './util.ts';

/**
 * Represents a JSON Schema validator made by `makeValidator`.
 */
export interface Validator<Type = unknown> {
	/**
	 * Returns `true` if the specified `value` has no validation errors, otherwise
	 * `false`.
	 *
	 * @param value
	 * @returns
	 *
	 * @example
	 * **schema.ts**
	 * ```
	 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
	 *
	 * const MY_STRING_SCHEMA = {
	 *     type: 'string',
	 *
	 *     minLength: 1,
	 * } as const satisfies JSONSchema;
	 *
	 * type MyStringType = typeofschema<typeof MY_STRING_SCHEMA>;
	 * ```
	 *
	 * **mod.ts**
	 * ```typescript
	 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
	 * import { makeValidator } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
	 *
	 * import type { MyStringType } from './schema.ts';
	 * import { MY_STRING_SCHEMA } from './schema.ts';
	 *
	 * const validator = makeValidator<MyStringType>(MY_STRING_SCHEMA);
	 *
	 * assertEquals(
	 *     validator.instanceOf('Hello World!'),
	 *     true,
	 * );
	 *
	 * assertEquals(
	 *     validator.instanceOf(''),
	 *     false,
	 * );
	 *
	 * assertEquals(
	 *     validator.instanceOf(42),
	 *     false,
	 * );
	 * ```
	 */
	instanceOf(value: Type | unknown): value is Type;

	/**
	 * Returns `Error` objects of any validation errors that have occured regarding
	 * the specified `value`, if any.
	 *
	 * @param value
	 * @returns
	 *
	 * @example
	 * **schema.ts**
	 * ```
	 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
	 *
	 * const MY_STRING_SCHEMA = {
	 *     type: 'string',
	 *
	 *     minLength: 1,
	 * } as const satisfies JSONSchema;
	 *
	 * type MyStringType = typeofschema<typeof MY_STRING_SCHEMA>;
	 * ```
	 *
	 * **mod.ts**
	 * ```typescript
	 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
	 * import { makeValidator } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
	 *
	 * import type { MyStringType } from './schema.ts';
	 * import { MY_STRING_SCHEMA } from './schema.ts';
	 *
	 * const validator = makeValidator<MyStringType>(MY_STRING_SCHEMA);
	 *
	 * assertEquals(
	 *     validator.instanceOf('Hello World!'),
	 *     undefined,
	 * );
	 *
	 * assertEquals(
	 *     validator.instanceOf(''),
	 *     [{ message: "String is too short (0 < 1).", property: "#" }],
	 * );
	 *
	 * assertEquals(
	 *     validator.instanceOf(42),
	 *     [{ message: 'Instance type "number" is invalid. Expected "string".', property: "#" }],
	 * );
	 * ```
	 */
	test(value: Type | unknown): Error[] | undefined;

	/**
	 * Throws an exception if any validation errors occured regarding the specified `value`,
	 * otherwise returns `true`.
	 *
	 * @param value
	 * @returns
	 *
	 * @example
	 * **schema.ts**
	 * ```
	 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
	 *
	 * const MY_STRING_SCHEMA = {
	 *     type: 'string',
	 *
	 *     minLength: 1,
	 * } as const satisfies JSONSchema;
	 *
	 * type MyStringType = typeofschema<typeof MY_STRING_SCHEMA>;
	 * ```
	 *
	 * **mod.ts**
	 * ```typescript
	 * import { assertEquals, assertThrows } from 'https://deno.land/std/testing/asserts.ts';
	 * import { ValidationError } from 'https://deno.land/x/enzastdlib/errors/mod.ts';
	 * import { makeValidator } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
	 *
	 * import type { MyStringType } from './schema.ts';
	 * import { MY_STRING_SCHEMA } from './schema.ts';
	 *
	 * const validator = makeValidator<MyStringType>(MY_STRING_SCHEMA);
	 *
	 * assertEquals(
	 *     validator.instanceOf('Hello World!'),
	 *     true,
	 * )
	 *
	 * assertThrows(
	 *     () => validator.instanceOf(''),
	 *     ValidationError,
	 * );
	 *
	 * assertThrows(
	 *     () => validator.instanceOf(42),
	 *     ValidationError,
	 * );
	 * ```
	 */
	validate(value: Type | unknown): value is Type;
}

/**
 * Makes a new `Validator` for validating input values are of the specified `schema`
 * JSON Schema definition.
 *
 * @param schema
 * @returns
 *
 * @example
 * **schema.ts**
 * ```
 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_STRING_SCHEMA = {
 *     type: 'string',
 *
 *     minLength: 1,
 * } as const satisfies JSONSchema;
 *
 * type MyStringType = typeofschema<typeof MY_STRING_SCHEMA>;
 * ```
 *
 * **mod.ts**
 * ```typescript
 * import { makeValidator } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * import type { MyStringType } from './schema.ts';
 * import { MY_STRING_SCHEMA } from './schema.ts';
 *
 * const validator = makeValidator<MyStringType>(MY_STRING_SCHEMA);
 * ```
 */
export function makeValidator<Type>(
	schema: JSONSchema,
): Validator<Type> {
	const validator = new CFWorkerValidator(
		// @ts-ignore - HACK: It's just typing mismatching between the two JSONSchema
		// libraries, any JSONSchema draft 2019-09 will work.
		schema,
		VERSION_SCHEMA,
		false,
	);

	return {
		instanceOf(value): value is Type {
			return !this.test(value);
		},

		test(value) {
			const { errors, valid } = validator.validate(value);
			if (valid) return;

			return errors.map((unit) => ({
				message: unit.error,
				property: unit.instanceLocation,
			}));
		},

		validate(value): value is Type {
			const errors = this.test(value);
			if (!errors) return true;

			throw new ValidationError(
				`bad argument #0 to 'Validator.validate' (JSON Schema failed to validate):\n\n${
					errors
						.map((error) => `${error.property}: ${error.message}`)
						.join('\n')
				}`,
			);
		},
	};
}
