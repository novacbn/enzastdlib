import type { EmptyObject } from '../collections/object.ts';

import type { Client, ClientOptions } from '../rpc/mod.ts';

import type {
	NotificationRecord,
	Payload,
	ProcedureRecord,
	Response,
} from '../rpc-protocol/mod.ts';
import { makeBrokerClient, VALIDATOR_PAYLOAD } from '../rpc-protocol/mod.ts';

import {
	makeEncodedJSONGenerator,
	makeEncodedJSONWriter,
} from './encodedjson.ts';

export interface StreamClientOptions extends ClientOptions {
	readonly readable: ReadableStream<Uint8Array>;

	readonly writable: WritableStream<Uint8Array>;
}

export type StreamClient<
	Notifications extends NotificationRecord<false>,
	Procedures extends ProcedureRecord<false>,
> = Client<
	Notifications,
	Procedures
>;

export function makeStreamClient<
	Procedures extends ProcedureRecord = EmptyObject,
	Notifications extends NotificationRecord = EmptyObject,
>(
	options: StreamClientOptions,
): StreamClient<Notifications, Procedures> {
	// NOTE: Since writes can happen without waiting for others to finish we
	// need to create a queue for the streams so they are not always
	// locked.

	const { readable, writable } = options;

	let is_reading = false;
	let is_writing = false;

	const pending_responses = new Map<
		string,
		((payload: Payload) => void) | undefined
	>();

	const write_queue: { data: unknown; signal?: AbortSignal }[] = [];

	function enqueue(data: unknown, signal?: AbortSignal): void {
		write_queue.push({ data, signal });

		if (signal) {
			signal.addEventListener('abort', (_event: Event) => {
				const index = write_queue.findIndex(({ signal: _signal }) =>
					_signal === signal
				);

				if (index < 0) return;
				write_queue.splice(index, 1);
			});
		}

		startWriting();
	}

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

	function startReading(): void {
		if (is_reading) return;

		if (readable.locked) {
			throw new Deno.errors.BadResource(
				'bad dispatch to \'startReading\' (stream \'StreamClientOptions.readable\' is locked)',
			);
		}

		is_reading = true;

		const generator = makeEncodedJSONGenerator(readable);

		async function pump() {
			// Sometimes we will get junk data when starting to read from
			// IPC so we need to skip them.
			const { value: payload } = await generator.next();
			if (payload === undefined) return setTimeout(pump);

			if (!VALIDATOR_PAYLOAD.instanceOf(payload)) {
				return setTimeout(pump);
			}

			const id = payload.id;
			if (!id) return setTimeout(pump);

			const resolve = pending_responses.get(id);
			if (!resolve) return setTimeout(pump);

			resolve(payload);
			pending_responses.delete(id);

			if (pending_responses.size > 0) setTimeout(pump);
			else {
				await generator.return();
				is_reading = false;

				// In the time it took for the generator to clean up there
				// might have been a new call enqueued. And `startReading`
				// would have returned nothing so we should manually
				// start the loop again.
				if (pending_responses.size > 0) {
					is_reading = true;
					setTimeout(pump);
				}
			}
		}

		pump();
	}

	async function startWriting() {
		if (is_writing) return;

		is_writing = true;

		if (writable.locked) {
			throw new Deno.errors.BadResource(
				'bad dispatch to \'startWriting\' (stream \'StreamClientOptions.writable\' is locked)',
			);
		}

		const writer = makeEncodedJSONWriter(writable);

		do {
			const queued = write_queue.shift();
			if (!queued) {
				throw new Deno.errors.NotFound(
					'bad dispatch to \'startWriting\' (there is no queued writes)',
				);
			}

			// TODO: Should we throw here instead? If we did
			// then that would break the loop.
			if (queued.signal?.aborted) continue;

			await writer.write(queued.data);
		} while (write_queue.length > 0);

		writer.releaseLock();
		is_writing = false;
	}

	const { notifications, procedures } = makeBrokerClient<Procedures>({
		...options,

		processNotification: (notification, _options) => {
			enqueue(notification);
		},

		processProcedure: (procedure, options) => {
			const { signal } = options;

			enqueue(procedure, signal);
			return getPayload<Response>(procedure.id, signal);
		},
	});

	return {
		notifications,
		procedures,
	};
}
