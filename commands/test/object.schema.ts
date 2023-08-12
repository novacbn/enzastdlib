import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_ARGUMENT_OBJECT = {
    type: 'object',

    required: ['_'],
    additionalProperties: false,

    properties: {
        _: {
            type: 'object',

            required: ['exposed', 'name', 'port'],
            additionalProperties: false,

            properties: {
                exposed: {
                    type: 'boolean',
                    description: 'Is the server exposed to public connections?',
                },

                name: {
                    type: 'string',
                    description: 'What is the name of the server?',

                    minLength: 1,
                },

                port: {
                    type: 'number',
                    description: 'What is the port of the server?',

                    minimum: 1024,
                    maximum: 65535,
                },
            },
        },
    },
} as const satisfies JSONSchema;

export type ObjectArgumentType = typeofschema<typeof SCHEMA_ARGUMENT_OBJECT>;

export const SCHEMA_OPTIONS_OBJECT = {
    type: 'object',

    required: ['server'],
    additionalProperties: false,

    properties: {
        server: {
            type: 'object',

            required: ['exposed', 'name', 'port'],
            additionalProperties: false,

            properties: {
                exposed: {
                    type: 'boolean',
                    description: 'Is the server exposed to public connections?',
                },

                name: {
                    type: 'string',
                    description: 'What is the name of the server?',

                    minLength: 1,
                },

                port: {
                    type: 'number',
                    description: 'What is the port of the server?',

                    minimum: 1024,
                    maximum: 65535,
                },
            },
        },
    },
} as const satisfies JSONSchema;

export type ObjectOptionsType = typeofschema<typeof SCHEMA_OPTIONS_OBJECT>;
