import { InternalError, ValidationError } from '../errors/mod.ts';

import type { Error } from './error.schema.ts';
import { errors as errors_decorator } from './error.ts';
import type { ServerMiddlewareCallback } from './middleware.ts';
import { applyMiddlewareCallbacks } from './middleware.ts';
import type { Notification } from './notification.schema.ts';
import { VALIDATOR_NOTIFICATION } from './notification.schema.ts';
import type { NotificationRecord } from './notification.ts';
import type { Payload } from './payload.schema.ts';
import { VALIDATOR_PAYLOAD } from './payload.schema.ts';
import { PAYLOAD_TYPES } from './payload.ts';
import type { Procedure } from './procedure.schema.ts';
import { VALIDATOR_PROCEDURE } from './procedure.schema.ts';
import type { ProcedureRecord } from './procedure.ts';
import { PROTOCOL_VERSION } from './protocol.ts';
import type { Response } from './response.schema.ts';
import { testParametersSchema, testResultSchema } from './schema.ts';

export interface BrokerServerOptions {
	readonly middlewares?: readonly ServerMiddlewareCallback[];

	readonly notifications?: NotificationRecord<true>;

	readonly procedures?: ProcedureRecord<true>;
}

export interface BrokerServer {
	readonly processNotification: (
		payload: Notification | unknown,
	) => Promise<void> | void;

	readonly processProcedure: (
		payload: Procedure | unknown,
	) => Promise<Error | Response> | Error | Response;

	readonly processPayload: (
		payload: Payload | unknown,
	) => Promise<Error | Response | void> | Error | Response | void;
}

export function makeBrokerServer(options: BrokerServerOptions): BrokerServer {
	const {
		middlewares,
		notifications = {},
		procedures = {},
	} = options;

	const server: BrokerServer = {
		async processPayload(payload) {
			const payload_errors = VALIDATOR_PAYLOAD.test(payload);
			if (payload_errors) {
				return {
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.error,

					name: ValidationError.name,
					message: `bad call (failed to validate payload):\n\n${
						payload_errors
							.map((error) =>
								`${error.property}: ${error.message}`
							).join('\n')
					}`,
				} satisfies Error;
			}

			if (middlewares) {
				for (const callback of middlewares) {
					// HACK: We already called the `Payload` validator, so
					// this value is not unknown.
					const middleware_response = await callback(
						payload as Payload,
					);
					if (middleware_response) {
						if (middleware_response === true) {
							return {
								enzastdlib: PROTOCOL_VERSION,
								type: PAYLOAD_TYPES.error,
								id: (payload as Payload).id,

								name: Deno.errors.BadResource.name,
								message:
									`bad call (server blocked you from accessing this resource)`,
							} satisfies Error;
						}

						return middleware_response;
					}
				}
			}

			switch ((payload as Payload).type) {
				case PAYLOAD_TYPES.notification:
					return server.processNotification(payload);

				case PAYLOAD_TYPES.procedure:
					return server.processProcedure(payload);
			}

			return {
				enzastdlib: PROTOCOL_VERSION,
				type: PAYLOAD_TYPES.error,
				id: (payload as Payload).id,

				name: ValidationError.name,
				message: `bad call (got payload type '${
					(payload as Payload).type
				}', expected '${PAYLOAD_TYPES.notification}', '${PAYLOAD_TYPES.procedure}')`,
			} satisfies Error;
		},

		async processNotification(payload) {
			const notification_errors = VALIDATOR_NOTIFICATION.test(payload);
			if (notification_errors) return;

			const { notification, parameters } = payload as Notification;

			const callback = notifications[notification];
			if (!callback) return;

			const parameters_errors = testParametersSchema(
				callback,
				payload as Notification,
			);
			if (parameters_errors) return;

			const response = await applyMiddlewareCallbacks(
				callback,
				payload as Notification,
			);
			if (response) return;

			await callback(payload as Notification, parameters);
		},

		async processProcedure(payload) {
			const errors = VALIDATOR_PROCEDURE.test(payload);
			if (errors) {
				return {
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.error,

					name: ValidationError.name,
					message:
						`bad call (failed to validate procedure payload):\n\n${
							errors
								.map((error) =>
									`${error.property}: ${error.message}`
								).join('\n')
						}`,
				} satisfies Error;
			}

			const { id, procedure, parameters } = payload as Procedure;
			const callback = procedures[procedure];

			if (!callback) {
				return {
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.error,
					id,

					name: ReferenceError.name,
					message:
						`bad procedure (procedure '${procedure}' not found)`,
				} satisfies Error;
			}

			const parameters_error = testParametersSchema(
				callback,
				payload as Procedure,
			);
			if (parameters_error) return parameters_error;

			const middleware_response = await applyMiddlewareCallbacks(
				callback,
				payload as Procedure,
			);
			if (middleware_response) {
				if (middleware_response === true) {
					return {
						enzastdlib: PROTOCOL_VERSION,
						type: PAYLOAD_TYPES.error,
						id,

						name: Deno.errors.BadResource.name,
						message:
							`bad call to procedure '${callback.name}' (server blocked you from accessing this resource)`,
					} satisfies Error;
				}

				return middleware_response;
			}

			let result: unknown;
			try {
				result = await callback(payload as Procedure, parameters);
			} catch (err) {
				const errors = errors_decorator.get(callback);
				if (errors && errors.has(err.constructor)) {
					console.error(err);

					return {
						enzastdlib: PROTOCOL_VERSION,
						type: PAYLOAD_TYPES.error,
						id,

						name: InternalError.name,
						message:
							`bad return from procedure '${callback.name}' (server had an exception while responding)`,
					} satisfies Error;
				}

				return {
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.error,
					id,

					name: err.name,
					message: err.message,
				} satisfies Error;
			}

			const result_error = testResultSchema(
				callback,
				payload as Procedure,
				result,
			);
			if (result_error) return result_error;

			return {
				enzastdlib: PROTOCOL_VERSION,
				type: PAYLOAD_TYPES.response,
				id,

				result: result as Response['result'],
			} satisfies Response;
		},
	};

	return server;
}
