import type { JSONSchema, typeofschema } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

import { PAYLOAD_TYPES } from './payload.ts';
import { PROTOCOL_VERSION } from './protocol.ts';

export const SCHEMA_RESPONSE = {
    type: 'object',
    required: ['enzastdlib', 'type', 'id'],

    additionalProperties: false,

    properties: {
        enzastdlib: {
            type: 'string',
            enum: [PROTOCOL_VERSION],
        },

        type: {
            type: 'string',
            enum: [PAYLOAD_TYPES.response],
        },

        id: {
            type: 'string',
        },

        result: {
            type: ['array', 'boolean', 'null', 'number', 'object', 'string'],
        },
    },
} as const satisfies JSONSchema;

export type Response = typeofschema<typeof SCHEMA_RESPONSE>;

export const VALIDATOR_RESPONSE = makeValidator<Response>(SCHEMA_RESPONSE);
