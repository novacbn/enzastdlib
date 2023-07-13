import type { Server, ServerOptions } from '../rpc/mod.ts';

import { makeBrokerServer } from '../rpc-protocol/mod.ts';

import type { MessagePortLike } from './messageport.ts';

export interface MessagePortServerOptions extends ServerOptions {
	readonly port: MessagePortLike;
}

export interface MessagePortServer extends Server {
	readonly close: () => void;

	readonly serve: () => void;
}

export function makeMessagePortServer(
	options: MessagePortServerOptions,
): MessagePortServer {
	const { port } = options;

	const { processPayload } = makeBrokerServer(options);

	async function onMessage(event: MessageEvent): Promise<void> {
		const { data: payload } = event;

		const response = await processPayload(payload);
		port.postMessage(response);
	}

	const server: MessagePortServer = {
		closed: true,

		close: () => {
			if (server.closed) {
				throw new Deno.errors.BadResource(
					'bad dispatch to \'MessagePortServer.close\' (server is already closed)',
				);
			}

			port.removeEventListener('message', onMessage);

			// @ts-ignore - HACK: `readonly` is only for the public API, not the internal.
			server.closed = true;
		},

		serve: () => {
			if (!server.closed) {
				throw new Deno.errors.BadResource(
					'bad dispatch to \'MessagePortServer.close\' (server is already serving)',
				);
			}

			port.addEventListener('message', onMessage);

			// @ts-ignore - HACK: `readonly` is only for the public API, not the internal.
			server.closed = false;
		},
	};

	return server;
}
