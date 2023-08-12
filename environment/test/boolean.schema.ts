import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_BOOLEAN = {
    type: 'object',

    additionalProperties: false,

    properties: {
        SERVER_EXPOSED: {
            type: 'boolean',
            description: 'Is the server exposed to public connections?',
        },
    },
} as const satisfies JSONSchema;

export type BooleanType = typeofschema<typeof SCHEMA_BOOLEAN>;
