import type { JSONSchema, typeofschema } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

import { PAYLOAD_TYPES } from './payload.ts';
import { PROTOCOL_VERSION } from './protocol.ts';

export const SCHEMA_PAYLOAD = {
    type: 'object',
    required: ['enzastdlib', 'type'],

    properties: {
        enzastdlib: {
            type: 'string',
            enum: [PROTOCOL_VERSION],
        },

        type: {
            type: 'string',
            enum: [
                PAYLOAD_TYPES.error,
                PAYLOAD_TYPES.notification,
                PAYLOAD_TYPES.procedure,
                PAYLOAD_TYPES.response,
            ],
        },

        id: {
            type: 'string',
        },

        metadata: {
            type: 'object',
        },
    },
} as const satisfies JSONSchema;

export type Payload = typeofschema<typeof SCHEMA_PAYLOAD>;

export const VALIDATOR_PAYLOAD = makeValidator<Payload>(SCHEMA_PAYLOAD);
