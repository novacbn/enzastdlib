import type { Client, ClientOptions } from '../rpc/mod.ts';

import type {
	NotificationRecord,
	Payload,
	ProcedureRecord,
	Response,
} from '../rpc-protocol/mod.ts';
import { makeBrokerClient, VALIDATOR_PAYLOAD } from '../rpc-protocol/mod.ts';

import { MessagePortLike } from './messageport.ts';
import { EmptyObject } from '../collections/object.ts';

export interface MessagePortClientOptions extends ClientOptions {
	readonly port: MessagePortLike;
}

export type MessagePortClient<
	Notifications extends NotificationRecord<false>,
	Procedures extends ProcedureRecord<false>,
> = Client<Notifications, Procedures>;

export function makeMessagePortClient<
	Procedures extends ProcedureRecord = EmptyObject,
	Notifications extends NotificationRecord = EmptyObject,
>(
	options: MessagePortClientOptions,
): MessagePortClient<Notifications, Procedures> {
	const { port } = options;

	let is_reading = false;

	const pending_responses = new Map<
		string,
		((payload: Payload) => void) | undefined
	>();

	function getPayload<Ret extends Payload = Payload>(
		id: string,
		signal?: AbortSignal,
	): Promise<Ret> {
		return new Promise<Ret>((resolve, reject) => {
			function onAbort(_event: Event) {
				pending_responses.delete(id);
				signal!.removeEventListener('abort', onAbort);

				reject(signal!.reason);
			}

			signal?.addEventListener('abort', onAbort);

			// @ts-ignore - HACK:
			pending_responses.set(id, resolve);
			startReading();
		});
	}

	function onMessage(event: MessageEvent): void {
		const { data: payload } = event;

		if (!VALIDATOR_PAYLOAD.instanceOf(payload)) return;

		const { id } = payload;
		if (!id) return;

		const resolve = pending_responses.get(id);
		if (!resolve) return;

		resolve(payload);

		pending_responses.delete(id);
		if (pending_responses.size === 0) {
			port.removeEventListener('message', onMessage);
			is_reading = false;
		}
	}

	function startReading(): void {
		if (is_reading) return;

		port.addEventListener('message', onMessage);
		is_reading = true;
	}

	const { notifications, procedures } = makeBrokerClient<Procedures>({
		...options,

		processNotification: (notification, _options) => {
			port.postMessage(notification);
		},

		processProcedure: (procedure, options) => {
			port.postMessage(procedure);

			return getPayload<Response>(procedure.id, options.signal);
		},
	});

	return {
		notifications,
		procedures,
	};
}
