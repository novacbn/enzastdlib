import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_FLAGS = {
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
} as const satisfies JSONSchema;

export type FlagsType = typeofschema<typeof SCHEMA_FLAGS>;
