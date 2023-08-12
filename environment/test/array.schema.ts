import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_ARRAY = {
    type: 'object',

    additionalProperties: false,

    properties: {
        SERVER_PLUGINS: {
            type: 'array',
            description: 'Which plugins should be enabled by the server?',

            items: {
                type: 'string',
            },
        },
    },
} as const satisfies JSONSchema;

export type ArrayType = typeofschema<typeof SCHEMA_ARRAY>;
