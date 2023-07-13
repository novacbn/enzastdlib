import { assertEquals } from '../../vendor/@deno-std-testing.ts';

import { assertTypeOf } from '../../testing/asserts.ts';

import type { Notification } from '../mod.ts';
import { middlewares, parametersschema } from '../mod.ts';

import type { LogParametersType } from './log.schema.ts';
import { SCHEMA_LOG_PARAMETERS } from './log.schema.ts';

parametersschema(log, SCHEMA_LOG_PARAMETERS);
export function log(
	_payload: Notification,
	parameters: LogParametersType,
): void {
	assertTypeOf(parameters, 'object');

	const { message } = parameters;

	assertTypeOf(message, 'string');
	assertEquals(message, 'Hello World!');

	console.log('log', { message });
}

middlewares(logReversed, [
	(payload, notification) => {
		const { message } = payload.parameters as LogParametersType;

		const reversed = message.split(/(.?)/g).reverse().join('');

		(notification as typeof logReversed)(
			payload as Notification,
			{
				message: reversed,
			} satisfies LogParametersType,
		);

		return true;
	},
]);
parametersschema(logReversed, SCHEMA_LOG_PARAMETERS);
export function logReversed(
	_payload: Notification,
	parameters: LogParametersType,
): void {
	assertTypeOf(parameters, 'object');

	const { message } = parameters;

	assertTypeOf(message, 'string');
	assertEquals(message, '!dlroW olleH');

	console.log('logReversed', { message });
}
