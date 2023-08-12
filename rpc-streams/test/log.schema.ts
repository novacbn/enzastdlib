import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_LOG_PARAMETERS = {
    type: 'object',
    required: ['message'],

    additionalProperties: false,

    properties: {
        message: {
            type: 'string',
        },
    },
} as const satisfies JSONSchema;

export type LogParametersType = typeofschema<typeof SCHEMA_LOG_PARAMETERS>;
