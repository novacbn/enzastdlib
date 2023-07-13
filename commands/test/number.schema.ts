import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_ARGUMENT_NUMBER = {
	type: 'object',

	required: ['_'],
	additionalProperties: false,

	properties: {
		_: {
			type: 'number',
			description: 'What is the port of the server?',

			minimum: 1024,
			maximum: 65535,
		},
	},
} as const satisfies JSONSchema;

export type NumberArgumentType = typeofschema<typeof SCHEMA_ARGUMENT_NUMBER>;

export const SCHEMA_OPTIONS_NUMBER = {
	type: 'object',

	required: ['port'],
	additionalProperties: false,

	properties: {
		port: {
			type: 'number',
			description: 'What is the port of the server?',

			minimum: 1024,
			maximum: 65535,
		},
	},
} as const satisfies JSONSchema;

export type NumberOptionsType = typeofschema<typeof SCHEMA_OPTIONS_NUMBER>;
