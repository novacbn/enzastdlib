import type { JSONSchema, typeofschema } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

import { PAYLOAD_TYPES } from './payload.ts';
import { PROTOCOL_VERSION } from './protocol.ts';

export const SCHEMA_PROCEDURE = {
	type: 'object',
	required: ['enzastdlib', 'type', 'id', 'procedure'],

	additionalProperties: false,

	properties: {
		enzastdlib: {
			type: 'string',
			enum: [PROTOCOL_VERSION],
		},

		type: {
			type: 'string',
			enum: [PAYLOAD_TYPES.procedure],
		},

		id: {
			type: 'string',
		},

		metadata: {
			type: 'object',
		},

		procedure: {
			type: 'string',

			minLength: 1,
		},

		parameters: {
			type: 'object',

			additionalProperties: true,
		},
	},
} as const satisfies JSONSchema;

export type Procedure = typeofschema<typeof SCHEMA_PROCEDURE>;

export const VALIDATOR_PROCEDURE = makeValidator<Procedure>(SCHEMA_PROCEDURE);
