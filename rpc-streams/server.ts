import type { Server, ServerOptions } from '../rpc/mod.ts';

import { makeBrokerServer } from '../rpc-protocol/mod.ts';

import {
	makeEncodedJSONGenerator,
	makeEncodedJSONWriter,
} from './encodedjson.ts';

export interface StreamServerOptions extends ServerOptions {
	readonly readable: ReadableStream<Uint8Array>;

	readonly writable: WritableStream<Uint8Array>;
}

export interface StreamServer extends Server {
	readonly close: () => void;

	readonly serve: () => void;
}

export function makeStreamServer(
	options: StreamServerOptions,
): StreamServer {
	const { readable, writable } = options;

	const { processPayload } = makeBrokerServer(options);

	function startReading(): void {
		if (readable.locked) {
			throw new Deno.errors.BadResource(
				'bad dispatch to \'startReading\' (stream \'StreamServerOptions.readable\' is locked)',
			);
		}

		if (writable.locked) {
			throw new Deno.errors.BadResource(
				'bad dispatch to \'startReading\' (stream \'StreamServerOptions.writable\' is locked)',
			);
		}

		const generator = makeEncodedJSONGenerator(readable);
		const writer = makeEncodedJSONWriter(writable);

		async function pump() {
			const { value: payload } = await generator.next();

			// Sometimes we will get junk data when starting to read from IPC so
			// we need to skip them.
			if (payload === undefined) return await tryCleanup();

			const response = await processPayload(payload);
			if (response === undefined) return await tryCleanup();

			await writer.write(response);
			await tryCleanup();
		}

		async function tryCleanup() {
			if (server.closed) {
				writer.releaseLock();
				await generator.return();
			} else setTimeout(pump);
		}

		// HACK: Using an inner loop function so we can pump the event loop without
		// hammering the CPU.
		pump();
	}

	const server: StreamServer = {
		closed: true,

		close: () => {
			if (server.closed) {
				throw new Deno.errors.BadResource(
					'bad dispatch to \'StreamServer.close\' (server is already closed)',
				);
			}

			// @ts-ignore - HACK: `readonly` is only for the public API, not the internal.
			server.closed = true;
		},

		serve: () => {
			if (!server.closed) {
				throw new Deno.errors.BadResource(
					'bad dispatch to \'StreamServer.close\' (server is already serving)',
				);
			}

			startReading();

			// @ts-ignore - HACK: `readonly` is only for the public API, not the internal.
			server.closed = false;
		},
	};

	return server;
}
