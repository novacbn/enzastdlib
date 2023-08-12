import type { LoadOptions } from '../vendor/@deno-std-dotenv.ts';
import { load } from '../vendor/@deno-std-dotenv.ts';

import { ValidationError } from '../errors/mod.ts';

import { parseJSON5ExpressionRecord } from '../json5/mod.ts';

import type { Error, JSONSchemaObject } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

type Options = Omit<LoadOptions, 'restrictEnvAccessTo'>;

/**
 * Returns `Error` objects of any validation errors that have occured regarding the
 * specified environment variables in a dotenv file, if any.
 *
 * > **NOTE**: To specify environment variables to test you **MUST** supply a JSON
 * > Schema that defines a top-level object.
 *
 * > **NOTE**: Only second-level keys are used for testing environment variables.
 *
 * @param schema
 * @param options
 * @returns
 *
 * @example
 * **.env**
 * ```bash
 * MY_STRING='Hello World!'
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
 * import { testDotenv } from 'https://deno.land/x/enzastdlib/environment/mod.ts';
 *
 * import { MY_STRING_SCHEMA } from './schema.ts';
 *
 * assertEquals(
 *     testDotenv(MY_STRING_SCHEMA, {
 *         envPath: './.env',
 *     }),
 *     undefined,
 * );
 * ```
 */
export async function testDotenv(
    schema: JSONSchemaObject,
    options?: Options,
): Promise<Error[] | undefined> {
    const parsed = await load(options);

    const env = parseJSON5ExpressionRecord(schema, parsed);
    const validator = makeValidator(schema);

    return validator.test(env);
}

/**
 * Throws an exception if any validation errors occured regarding the specified environment
 * variables in a dotenv file, otherwise returns the values of those environment variables.
 *
 * > **NOTE**: To specify environment variables to validate you **MUST** supply a JSON
 * > Schema that defines a top-level object.
 *
 * > **NOTE**: Only second-level keys are used for validating environment variables.
 *
 * @param schema
 * @param options
 * @returns
 *
 * @example
 * **.env**
 * ```bash
 * MY_STRING='Hello World!'
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
 * import { validateDotenv } from 'https://deno.land/x/enzastdlib/environment/mod.ts';
 *
 * import type { MyStringType } from "./schema.ts";
 * import { MY_STRING_SCHEMA } from './schema.ts';
 *
 * assertEquals(
 *     validateDotenv<MyStringType>(MY_STRING_SCHEMA, {
 *         envPath: './.env',
 *     }),
 *     { MY_STRING: 'Hello World!' },
 * );
 * ```
 */
export async function validateDotenv<Type>(
    schema: JSONSchemaObject,
    options?: Options,
): Promise<Type> {
    const parsed = await load(options);

    const env = parseJSON5ExpressionRecord<Type>(schema, parsed);
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
