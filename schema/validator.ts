import { Validator as CFWorkerValidator } from '../vendor/@cfworker-json-schema.ts';

import { ValidationError } from '../errors/mod.ts';

import type { Error } from './errors.ts';
import type { JSONSchema } from './schema.ts';
import { VERSION_SCHEMA } from './util.ts';

export interface Validator<Type = unknown> {
	instanceOf(value: Type | unknown): value is Type;

	test(value: Type | unknown): Error[] | undefined;

	validate(value: Type | unknown): value is Type;
}

export function makeValidator<Type>(
	schema: JSONSchema,
): Validator<Type> {
	const validator = new CFWorkerValidator(
		// @ts-ignore - HACK: It's just typing mismatching between the two JSONSchema
		// libraries, any JSONSchema draft 2019-09 will work.
		schema,
		VERSION_SCHEMA,
		false,
	);

	return {
		instanceOf(value): value is Type {
			return !this.test(value);
		},

		test(value) {
			const { errors, valid } = validator.validate(value);
			if (valid) return;

			return errors.map((unit) => ({
				message: unit.error,
				property: unit.instanceLocation,
			}));
		},

		validate(value): value is Type {
			const errors = this.test(value);
			if (!errors) return true;

			throw new ValidationError(
				`bad argument #0 to 'Validator.validate' (JSON Schema failed to validate):\n\n${
					errors
						.map((error) => `${error.property}: ${error.message}`)
						.join('\n')
				}`,
			);
		},
	};
}
