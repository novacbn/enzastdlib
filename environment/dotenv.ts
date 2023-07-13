import type { LoadOptions } from '../vendor/@deno-std-dotenv.ts';
import { load } from '../vendor/@deno-std-dotenv.ts';

import { ValidationError } from '../errors/mod.ts';

import { parseJSON5ExpressionRecord } from '../json5/mod.ts';

import type { Error, JSONSchemaObject } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

type Options = Omit<LoadOptions, 'restrictEnvAccessTo'>;

export async function testDotenv(
	schema: JSONSchemaObject,
	options?: Options,
): Promise<Error[] | undefined> {
	const parsed = await load(options);

	const env = parseJSON5ExpressionRecord(schema, parsed);
	const validator = makeValidator(schema);

	return validator.test(env);
}

export async function validateDotenv<Type>(
	schema: JSONSchemaObject,
	options?: Options,
): Promise<Type> {
	const parsed = await load(options);

	const env = parseJSON5ExpressionRecord<Type>(schema, parsed);
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
