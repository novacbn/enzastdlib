import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_ARGUMENT_ARRAY = {
	type: 'object',

	required: ['_'],
	additionalProperties: false,

	properties: {
		_: {
			type: 'array',
			description: 'Which plugins should be enabled by the server?',

			items: {
				type: 'string',
			},
		},
	},
} as const satisfies JSONSchema;

export type ArrayArgumentType = typeofschema<typeof SCHEMA_ARGUMENT_ARRAY>;

export const SCHEMA_OPTIONS_ARRAY = {
	type: 'object',

	required: ['plugins'],
	additionalProperties: false,

	properties: {
		plugins: {
			type: 'array',
			description: 'Which plugins should be enabled by the server?',

			items: {
				type: 'string',
			},
		},
	},
} as const satisfies JSONSchema;

export type ArrayOptionsType = typeofschema<typeof SCHEMA_OPTIONS_ARRAY>;
