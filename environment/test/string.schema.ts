import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_STRING = {
	type: 'object',

	additionalProperties: false,

	properties: {
		SERVER_NAME: {
			type: 'string',
			description: 'What is the name of the server?',

			minLength: 1,
		},
	},
} as const satisfies JSONSchema;

export type StringType = typeofschema<typeof SCHEMA_STRING>;
