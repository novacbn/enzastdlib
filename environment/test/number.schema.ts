import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_NUMBER = {
    type: 'object',

    additionalProperties: false,

    properties: {
        SERVER_PORT: {
            type: 'number',
            description: 'What is the port of the server?',

            minimum: 1024,
            maximum: 65535,
        },
    },
} as const satisfies JSONSchema;

export type NumberType = typeofschema<typeof SCHEMA_NUMBER>;
