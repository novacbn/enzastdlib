import type { JSONSchema, typeofschema } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

import { PAYLOAD_TYPES } from './payload.ts';
import { PROTOCOL_VERSION } from './protocol.ts';

export const SCHEMA_NOTIFICATION = {
	type: 'object',
	required: ['enzastdlib', 'type', 'notification'],

	additionalProperties: false,

	properties: {
		enzastdlib: {
			type: 'string',
			enum: [PROTOCOL_VERSION],
		},

		type: {
			type: 'string',
			enum: [PAYLOAD_TYPES.notification],
		},

		metadata: {
			type: 'object',
		},

		notification: {
			type: 'string',

			minLength: 1,
		},

		parameters: {
			type: 'object',

			additionalProperties: true,
		},
	},
} as const satisfies JSONSchema;

export type Notification = typeofschema<typeof SCHEMA_NOTIFICATION>;

export const VALIDATOR_NOTIFICATION = makeValidator<Notification>(
	SCHEMA_NOTIFICATION,
);
