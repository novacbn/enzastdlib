import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_ARGUMENT_STRING = {
    type: 'object',

    required: ['_'],
    additionalProperties: false,

    properties: {
        _: {
            type: 'string',
            description: 'What is the name of the server?',

            minLength: 1,
        },
    },
} as const satisfies JSONSchema;

export type StringArgumentType = typeofschema<typeof SCHEMA_ARGUMENT_STRING>;

export const SCHEMA_OPTIONS_STRING = {
    type: 'object',

    required: ['name'],
    additionalProperties: false,

    properties: {
        name: {
            type: 'string',
            description: 'What is the name of the server?',

            minLength: 1,
        },
    },
} as const satisfies JSONSchema;

export type StringOptionsType = typeofschema<typeof SCHEMA_OPTIONS_STRING>;
