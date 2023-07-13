import type { ServeInit, ServeTlsInit } from '../vendor/@deno-std-http.ts';

import type { Server, ServerOptions } from '../rpc/mod.ts';

import type { Error } from '../rpc-protocol/mod.ts';
import {
	makeBrokerServer,
	PAYLOAD_TYPES,
	PROTOCOL_VERSION,
} from '../rpc-protocol/mod.ts';

import {
	PROTOCOL_METHOD,
	PROTOCOL_PATHNAME_PROCEDURES,
	PROTOCOL_RESPONSES,
} from './protocol.ts';

import { serveHTTP } from './serve.ts';

export interface HTTPServerOptions extends ServerOptions {
	readonly http?:
		& (
			| Omit<ServeInit, 'onListen' | 'signal'>
			| Omit<ServeTlsInit, 'onListen' | 'signal'>
		)
		& {
			readonly onRequest?: (
				request: Request,
			) => Promise<Response | void> | Response | void;
		};
}

export interface HTTPServer extends Server {
	readonly close: () => void;

	readonly serve: () => Promise<
		Parameters<Exclude<ServeInit['onListen'], undefined>>[0]
	>;
}

export function makeHTTPServer(
	options: HTTPServerOptions,
): HTTPServer {
	const { http } = options;

	const { processPayload } = makeBrokerServer(options);

	let controller: AbortController | null;

	async function onRequest(request: Request): Promise<Response> {
		if (http && http.onRequest) {
			const response = await http.onRequest(request);
			if (response) return response;
		}

		const url = new URL(request.url);
		if (url.pathname !== PROTOCOL_PATHNAME_PROCEDURES) {
			return new Response(
				JSON.stringify(
					{
						enzastdlib: PROTOCOL_VERSION,
						type: PAYLOAD_TYPES.error,

						name: 'NotFound',
						message:
							`bad request to server (invalid pathname '${url.pathname}')`,
					} satisfies Error,
				),
				{
					status: PROTOCOL_RESPONSES.invalid_pathname,
				},
			);
		}

		if (request.method !== PROTOCOL_METHOD) {
			return new Response(
				JSON.stringify(
					{
						enzastdlib: PROTOCOL_VERSION,
						type: PAYLOAD_TYPES.error,

						name: 'BadResource',
						message:
							`bad request to server (invalid method '${request.method}', method must be '${PROTOCOL_METHOD}')`,
					} satisfies Error,
				),
				{
					status: PROTOCOL_RESPONSES.invalid_method,
				},
			);
		}

		const payload = await request.json();

		const response = await processPayload(payload);
		if (response === undefined) {
			// NOTE: Clients should ignore any form of body associated with no response payloads.
			return new Response(null, {
				status: PROTOCOL_RESPONSES.successful_no_response,
			});
		}

		return new Response(JSON.stringify(response), {
			status: PROTOCOL_RESPONSES.successful_call,
		});
	}

	const server: HTTPServer = {
		closed: true,

		close: () => {
			if (!controller) {
				throw new Deno.errors.BadResource(
					'bad dispatch to \'HTTPServer.close\' (server is already closed)',
				);
			}

			controller.abort();

			controller = null;
			// @ts-ignore - HACK: `readonly` is only for the public API, not the internal.
			server.closed = true;
		},

		serve: () => {
			if (controller) {
				throw new Deno.errors.BadResource(
					'bad dispatch to \'HTTPServer.close\' (server is already serving)',
				);
			}

			return new Promise((resolve, _reject) => {
				controller = new AbortController();

				serveHTTP(onRequest, {
					...http,
					signal: controller.signal,

					onListen: (params) => {
						resolve(params);

						// @ts-ignore - HACK: `readonly` is only for the public API, not the internal.
						server.closed = false;
					},
				});
			});
		},
	};

	return server;
}
