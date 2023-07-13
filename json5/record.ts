import { parseJSON5Expression } from './expression.ts';

import type { JSONSchema, JSONSchemaObject } from '../schema/mod.ts';

export type JSON5ExpressionRecord = Record<string, string | undefined>;

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
