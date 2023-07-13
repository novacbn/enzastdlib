import type { JsonValue } from '../vendor/@deno-std-json.ts';

import type { JSONSchemaTypes } from './schema.ts';

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
