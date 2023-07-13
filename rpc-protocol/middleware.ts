import { makeDecorator } from '../decorators/mod.ts';

import type { Error } from './error.schema.ts';
import type { Notification } from './notification.schema.ts';
import type { NotificationCallback } from './notification.ts';
import type { Payload } from './payload.schema.ts';
import type { PayloadCallback } from './payload.ts';
import type { Procedure } from './procedure.schema.ts';
import type { ProcedureCallback } from './procedure.ts';
import type { Response } from './response.schema.ts';

export type PerCallMiddlewareCallback = (
	payload: Payload | Notification | Procedure,
	callback: PayloadCallback | NotificationCallback | ProcedureCallback,
) => Promise<Error | Response | true | void> | Error | Response | true | void;

export type ServerMiddlewareCallback = (
	payload: Payload,
) => Promise<Error | Response | true | void> | Error | Response | true | void;

export const middlewares = makeDecorator<
	readonly (PerCallMiddlewareCallback)[],
	NotificationCallback | ProcedureCallback
>((func, _middlewares) => {
	middlewares.set(func, _middlewares);
});

export async function applyMiddlewareCallbacks(
	func: NotificationCallback | ProcedureCallback,
	payload: Payload,
) {
	if (middlewares.has(func)) {
		const callbacks = middlewares.get(func)!;

		for (const index in callbacks) {
			const callback = callbacks[index];

			const response = await callback(
				payload,
				func as PayloadCallback,
			);

			if (response) return response;
		}
	}
}
