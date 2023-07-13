import { makeDecorator } from '../decorators/mod.ts';

import { InternalError, ValidationError } from '../errors/mod.ts';

import type { JSONSchemaObject, Validator } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

import type { Error } from './error.schema.ts';
import type { Notification } from './notification.schema.ts';
import type { NotificationCallback } from './notification.ts';
import { PAYLOAD_TYPES } from './payload.ts';
import type { Procedure } from './procedure.schema.ts';
import type { ProcedureCallback } from './procedure.ts';
import { PROTOCOL_VERSION } from './protocol.ts';
import { deleteUndefined } from './util.ts';

const CACHE_VALIDATORS = new Map<string, Validator | undefined>();

/**
 * Associates a `JSONSchema` value as the parameters payload with the function.
 */
export const parametersschema = makeDecorator<
	JSONSchemaObject,
	NotificationCallback | ProcedureCallback
>((func, schema) => {
	parametersschema.set(func, schema);
});

/**
 * Associates a `JSONSchema` value as the result payload with the function.
 */
export const resultschema = makeDecorator<
	JSONSchemaObject,
	NotificationCallback | ProcedureCallback
>((func, schema) => {
	resultschema.set(func, schema);
});

export function testParametersSchema(
	func: NotificationCallback | ProcedureCallback,
	payload: Notification | Procedure,
) {
	if (parametersschema.has(func)) {
		const {
			// @ts-ignore - HACK: If the ID is available, we simply
			// use it. Otherwise we can ignore it.
			id,
			parameters,
		} = payload;

		if (!parameters) {
			return deleteUndefined({
				enzastdlib: PROTOCOL_VERSION,
				type: PAYLOAD_TYPES.error,
				id,

				name: ValidationError.name,
				message:
					`bad call to ${payload.type} '${func.name}' (a parameters payload was expected)`,
			}) satisfies Error;
		}

		const schema_id = `parameters:${payload.type}:${func.name}`;
		if (!CACHE_VALIDATORS.has(schema_id)) {
			const schema = parametersschema.get(func)!;

			CACHE_VALIDATORS.set(
				schema_id,
				makeValidator(schema),
			);
		}

		const validator = CACHE_VALIDATORS.get(schema_id)!;
		const errors = validator.test(parameters);

		if (errors) {
			return deleteUndefined({
				enzastdlib: PROTOCOL_VERSION,
				type: PAYLOAD_TYPES.error,
				id,

				name: ValidationError.name,
				message:
					`bad call to ${payload.type} '${func.name}' (failed to validate parameters payload):\n\n${
						errors
							.map((error) =>
								`${error.property}: ${error.message}`
							).join('\n')
					}`,
			}) satisfies Error;
		}
	}
}

export function testResultSchema(
	func: ProcedureCallback,
	payload: Procedure,
	result: unknown,
) {
	if (resultschema.has(func)) {
		const { id } = payload;

		if (!result) {
			console.error(
				new ValidationError(
					`bad return from ${payload.type} '${func.name}' (a response payload was expected)`,
				),
			);

			return {
				enzastdlib: PROTOCOL_VERSION,
				type: PAYLOAD_TYPES.error,
				id,

				name: InternalError.name,
				message:
					`bad call to ${payload.type} '${func.name}' (server had an exception while responding)`,
			} satisfies Error;
		}

		const schema_id = `result:${payload.type}:${func.name}`;
		if (!CACHE_VALIDATORS.has(schema_id)) {
			const schema = resultschema.get(func)!;

			CACHE_VALIDATORS.set(
				schema_id,
				makeValidator(schema),
			);
		}

		const validator = CACHE_VALIDATORS.get(schema_id)!;
		const errors = validator.test(result);

		if (errors) {
			console.error(
				`bad return from ${payload.type} '${func.name}' (failed to validate response payload):\n\n${
					errors
						.map((error) => `${error.property}: ${error.message}`)
						.join('\n')
				}`,
			);

			return {
				enzastdlib: PROTOCOL_VERSION,
				type: PAYLOAD_TYPES.error,
				id,

				name: InternalError.name,
				message:
					`bad call to ${payload.type} '${func.name}' (server had an exception while responding)`,
			} satisfies Error;
		}
	}
}
