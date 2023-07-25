import type { FromSchema } from '../vendor/@ThomasAribart-json-schema-to-ts.ts';

import type {
	JSONSchema as JSONSchema201909,
	TypeName,
} from '../vendor/@jrylan-json-schema-typed.ts';

/**
 * Represents the JSON Schema structure typing for arrays.
 *
 * @example
 * ```typescript
 * import type { JSONSchemaArray } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_ARRAY_SCHEMA = {
 *     type: 'array',
 *
 *     items: {
 *         type: 'string',
 *     },
 * } as const satisfies JSONSchemaArray;
 * ```
 */
export type JSONSchemaArray = JSONSchema201909.Array;

/**
 * Represents the JSON Schema structure typing for booleans.
 *
 * @example
 * ```typescript
 * import type { JSONSchemaBoolean } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_BOOLEAN_SCHEMA = {
 *     type: 'boolean',
 * } as const satisfies JSONSchemaBoolean;
 * ```
 */
export type JSONSchemaBoolean = JSONSchema201909.Boolean;

/**
 * Represents the JSON Schema structure typing for nulls.
 *
 * @example
 * ```typescript
 * import type { JSONSchemaNull } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_NULL_SCHEMA = {
 *     type: 'null',
 * } as const satisfies JSONSchemaNull;
 * ```
 */
export type JSONSchemaNull = JSONSchema201909.Null;

/**
 * Represents the JSON Schema structure typing for numbers.
 *
 * @example
 * ```typescript
 * import type { JSONSchemaNumber } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_NUMBER_SCHEMA = {
 *     type: 'number',
 *
 *     minimum: 0,
 *     maximum: 42,
 * } as const satisfies JSONSchemaNumber;
 * ```
 */
export type JSONSchemaNumber = JSONSchema201909.Number;

/**
 * Represents the JSON Schema structure typing for objects.
 *
 * @example
 * ```typescript
 * import type { JSONSchemaObject } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_OBJECT_SCHEMA = {
 *     type: 'object',
 *
 *     additionalProperties: {
 *         type: 'string',
 *     },
 * } as const satisfies JSONSchemaObject;
 * ```
 */
export type JSONSchemaObject = JSONSchema201909.Object;

/**
 * Represents the JSON Schema structure typing for strings.
 *
 * @example
 * ```typescript
 * import type { JSONSchemaString } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_STRING_SCHEMA = {
 *     type: 'string',
 *
 *     minLength: 1,
 *     maxLength: 64,
 * } as const satisfies JSONSchemaString;
 * ```
 */
export type JSONSchemaString = JSONSchema201909.String;

/**
 * Represents a union of all supported JSON Schema structure typings.
 *
 * @example
 * ```typescript
 * import type { JSONSchema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_STRING_SCHEMA = {
 *     type: 'string',
 * } as const satisfies JSONSchema;
 * ```
 */
export type JSONSchema =
	| JSONSchemaArray
	| JSONSchemaBoolean
	| JSONSchemaNull
	| JSONSchemaNumber
	| JSONSchemaObject
	| JSONSchemaString;

/**
 * Represents a union of all possible type names supported by JSON Schema.
 *
 * @example
 * ```typescript
 * import type { JSONSchemaTypes } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const my_schema_type = 'integer' satisfies JSONSchemaTypes;
 * ```
 */
export type JSONSchemaTypes = `${TypeName}`;

/**
 * Converts a constant JSON Schema object into TypeScript typing at compile-time.
 *
 * > **WARNING**: Depending on the complexity of your JSON Schemas, your type checking
 * > and continous integration suites might experience slowdowns.
 *
 * > **WARNING**: It is recommended to put schema-related code into a seperate
 * > TypeScript file (ex. `*.schema.ts`) to allow your IDE to cache the resulting
 * > typings.
 * >
 * > Otherwise you might experience slowdowns with your IDE.
 *
 * @example
 * ```typescript
 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const MY_OBJECT_SCHEMA = {
 *     type: 'object',
 *
 *     additionalProperties: {
 *         type: 'string',
 *     },
 * } as const satisfies JSONSchema;
 *
 * type MyObjectType = typeofschema<typeof MY_OBJECT_SCHEMA>; // `{ [x: string]: string; }`
 * ```
 */
export type typeofschema<Schema extends JSONSchema> = FromSchema<
	// @ts-ignore - HACK: They're both draft 2019-09 based, they just have mismatched types.
	Schema
>;
