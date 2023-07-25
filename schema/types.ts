import type { JsonValue } from '../vendor/@deno-std-json.ts';

import type { JSONSchemaTypes } from './schema.ts';

/**
 * Returns the JSON Schema type of a specified JavaScript type.
 *
 * @example
 * ```typescript
 * import type { SchemaTypeOf } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * const my_string = 'Hello World!';
 *
 * type MyStringSchemaType = SchemaTypeOf<typeof my_string>; // "string"
 * ```
 */
export type SchemaTypeOf<Type extends JsonValue> = Type extends boolean
	? 'boolean'
	: (Type extends null ? 'null' : (
		Type extends number ? 'number' : (
			Type extends string ? 'string' : (
				Type extends unknown[] ? 'array' : (
					Type extends Record<string, unknown> ? 'object'
						: never
				)
			)
		)
	));

/**
 * Returns the JavaScript type of the specified JSON Schema type.
 *
 * @example
 * ```typescript
 * import type { TypeOfSchemaType } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * type MySchemaType = 'integer';
 *
 * type MyType = TypeOfSchemaType<MySchemaType>; // `number`
 * ```
 */
export type TypeOfSchemaType<SchemaType extends JSONSchemaTypes> =
	SchemaType extends 'boolean' ? boolean
		: (SchemaType extends 'null' ? null : (
			SchemaType extends ('integer' | 'number') ? number : (
				SchemaType extends 'string' ? string : (
					SchemaType extends 'array' ? unknown[] : (
						SchemaType extends 'object' ? Record<string, unknown>
							: never
					)
				)
			)
		));
