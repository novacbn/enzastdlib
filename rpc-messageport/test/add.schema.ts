import type { JSONSchema, typeofschema } from '../../schema/mod.ts';

export const SCHEMA_ADD_PARAMETERS = {
    type: 'object',
    required: ['a', 'b'],

    additionalProperties: false,

    properties: {
        a: {
            type: 'number',
        },

        b: {
            type: 'number',
        },
    },
} as const satisfies JSONSchema;

export type AddParametersType = typeofschema<typeof SCHEMA_ADD_PARAMETERS>;

export const SCHEMA_ADD_RETURN = {
    type: 'object',
    required: ['sum'],

    additionalProperties: false,

    properties: {
        sum: {
            type: 'number',
        },
    },
} as const satisfies JSONSchema;

export type AddReturnType = typeofschema<typeof SCHEMA_ADD_RETURN>;
