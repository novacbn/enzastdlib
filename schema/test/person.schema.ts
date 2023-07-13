import type { JSONSchema, typeofschema } from '../mod.ts';

export const SCHEMA_PERSON = {
	$id: 'https://example.com/person.schema.json',
	$schema: 'https://json-schema.org/draft/2019-09/schema',
	title: 'Person',

	type: 'object',
	additionalProperties: false,

	properties: {
		firstName: {
			type: 'string',
			description: 'The person\'s first name.',
		},

		lastName: {
			type: 'string',
			description: 'The person\'s last name.',
		},

		age: {
			description:
				'Age in years which must be equal to or greater than zero.',
			type: 'integer',
			minimum: 0,
		},
	},
} as const satisfies JSONSchema;

export type PersonType = typeofschema<typeof SCHEMA_PERSON>;
