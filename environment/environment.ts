import { ValidationError } from '../errors/mod.ts';

import { parseJSON5ExpressionRecord } from '../json5/mod.ts';

import type { Error, JSONSchemaObject } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

export function testEnvironment(
	schema: JSONSchemaObject,
): Error[] | undefined {
	const env = parseJSON5ExpressionRecord(schema, Deno.env.toObject());
	const validator = makeValidator(schema);

	return validator.test(env);
}

export function validateEnvironment<Type>(
	schema: JSONSchemaObject,
): Type {
	const env = parseJSON5ExpressionRecord<Type>(schema, Deno.env.toObject());
	const validator = makeValidator<Type>(schema);

	const errors = validator.test(env);
	if (errors) {
		throw new ValidationError(
			`bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):\n\n${
				errors
					.map((error) => `${error.property}: ${error.message}`)
					.join('\n')
			}`,
		);
	}

	return env;
}
