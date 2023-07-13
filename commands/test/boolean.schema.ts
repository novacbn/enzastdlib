import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_ARGUMENT_BOOLEAN = {
	type: 'object',

	additionalProperties: false,
	required: ['_'],

	properties: {
		_: {
			type: 'boolean',
			description: 'Is the server exposed to public connections?',
		},
	},
} as const satisfies JSONSchema;

export type BooleanArgumentType = typeofschema<typeof SCHEMA_ARGUMENT_BOOLEAN>;

export const SCHEMA_OPTIONS_BOOLEAN = {
	type: 'object',

	additionalProperties: false,
	required: ['exposed'],

	properties: {
		exposed: {
			type: 'boolean',
			description: 'Is the server exposed to public connections?',
		},
	},
} as const satisfies JSONSchema;

export type BooleanOptionsType = typeofschema<typeof SCHEMA_OPTIONS_BOOLEAN>;
