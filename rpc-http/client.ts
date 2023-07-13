import type { EmptyObject } from '../collections/object.ts';

import type { Client, ClientOptions } from '../rpc/mod.ts';

import type {
	NotificationRecord,
	ProcedureRecord,
} from '../rpc-protocol/mod.ts';
import { makeBrokerClient } from '../rpc-protocol/mod.ts';

import type { HTTPCallOptions } from './procedure.ts';
import { PROTOCOL_METHOD } from './protocol.ts';

export interface HTTPClientOptions extends ClientOptions<HTTPCallOptions> {
	readonly http: {
		readonly endpoint: string;
	};
}

export type HTTPClient<
	Notifications extends NotificationRecord<false>,
	Procedures extends ProcedureRecord<false>,
> = Client<
	Notifications,
	Procedures,
	HTTPCallOptions
>;

export function makeHTTPClient<
	Procedures extends ProcedureRecord = EmptyObject,
	Notifications extends NotificationRecord = EmptyObject,
>(
	options: HTTPClientOptions,
): HTTPClient<Notifications, Procedures> {
	const { http } = options;
	const { endpoint } = http;

	// NOTE: We do not technically need to use `new URL` here
	// but is provides us with an upfront validation if the
	// provided endpoint is valid.
	const url = new URL(endpoint);

	const { notifications, procedures } = makeBrokerClient<Procedures>({
		...options,

		processNotification: async (notification, options: HTTPCallOptions) => {
			const response = await fetch(url, {
				...options.http,

				method: PROTOCOL_METHOD,
				body: JSON.stringify(notification),
			});

			// We need to cancel the body if available since it leave
			// a dangling resource otherwise. Even though we do not
			// consume it anyway.
			await response.body?.cancel();
		},

		processProcedure: async (procedure, options: HTTPCallOptions) => {
			const { signal } = options;

			const promise = fetch(url, {
				...options.http,

				method: PROTOCOL_METHOD,
				body: JSON.stringify(procedure),
				signal,
			});

			const response = await promise;
			return await response.json();
		},
	});

	return {
		notifications,
		procedures,
	};
}
