import type { JSONSchema, typeofschema } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

import { PAYLOAD_TYPES } from './payload.ts';
import { PROTOCOL_VERSION } from './protocol.ts';

export const SCHEMA_ERROR = {
    type: 'object',
    required: ['enzastdlib', 'type', 'name', 'message'],

    additionalProperties: false,

    properties: {
        enzastdlib: {
            type: 'string',
            enum: [PROTOCOL_VERSION],
        },

        type: {
            type: 'string',
            enum: [PAYLOAD_TYPES.error],
        },

        id: {
            type: 'string',
        },

        name: {
            type: 'string',

            minLength: 1,
        },

        message: {
            type: 'string',

            minLength: 0,
        },
    },
} as const satisfies JSONSchema;

export type Error = typeofschema<typeof SCHEMA_ERROR>;

export const VALIDATOR_ERROR = makeValidator<Error>(SCHEMA_ERROR);
