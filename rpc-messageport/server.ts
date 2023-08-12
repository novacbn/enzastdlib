import type { Server, ServerOptions } from '../rpc/mod.ts';

import { makeBrokerServer } from '../rpc-protocol/mod.ts';

import type { MessagePortLike } from './messageport.ts';

/**
 * Represents options passable to `makeMessagePortServer`.
 */
export interface MessagePortServerOptions extends ServerOptions {
	readonly port: MessagePortLike;
}

/**
 * Represents a `MessagePort` server made by `makeMessagePortServer`.
 */
export interface MessagePortServer extends Server {
	/**
	 * Closes the RPC server.
	 *
	 * @returns
	 */
	readonly close: () => void;

	/**
	 * Starts the RPC server.
	 *
	 * @returns
	 */
	readonly serve: () => void;
}

/**
 * Makes a `MessagePort` server that can respond to clients in enzastdlib's RPC protocol.
 *
 * @param options
 * @returns
 *
 * @example
 * **add.schema.ts**
 * ```typescript
 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * export const SCHEMA_ADD_PARAMETERS = {
 *     type: 'object',
 *     required: ['a', 'b'],
 *
 *     additionalProperties: false,
 *
 *     properties: {
 *         a: {
 *             type: 'number',
 *         },
 *
 *         b: {
 *             type: 'number',
 *         },
 *     },
 * } as const satisfies JSONSchema;
 *
 * export type AddParametersType = typeofschema<typeof SCHEMA_ADD_PARAMETERS>;
 *
 * export const SCHEMA_ADD_RETURN = {
 *     type: 'object',
 *     required: ['sum'],
 *
 *     additionalProperties: false,
 *
 *     properties: {
 *         sum: {
 *             type: 'number',
 *         },
 *     },
 * } as const satisfies JSONSchema;
 *
 * export type AddReturnType = typeofschema<typeof SCHEMA_ADD_RETURN>;
 * ```
 *
 * **add.procedure.ts**
 * ```typescript
 * import type { Procedure } from 'https://deno.land/x/enzastdlib/rpc-protocol/mod.ts';
 * import { parametersschema, resultschema } from 'https://deno.land/x/enzastdlib/rpc-protocol/mod.ts';
 *
 * import type { AddParametersType, AddReturnType } from './add.schema.ts';
 * import { SCHEMA_ADD_PARAMETERS, SCHEMA_ADD_RETURN } from './add.schema.ts';
 *
 * parametersschema(add, SCHEMA_ADD_PARAMETERS);
 * resultschema(add, SCHEMA_ADD_RETURN);
 * export function add(
 *     _payload: Procedure,
 *     parameters: AddParametersType,
 * ): AddReturnType {
 *     const { a, b } = parameters;
 *
 *     return {
 *         sum: a + b,
 *     };
 * }
 * ```
 *
 * **mod.ts**
 * ```typescript
 * import { makeMessagePortServer } from 'https://deno.land/x/enzastdlib/rpc-messageport/mod.ts';
 *
 * import { add } from './add.procedure.ts';
 *
 * const worker = new Worker(...);
 *
 * const server = makeMessagePortServer({
 *     port: worker,
 *
 *     procedures: {
 *         add,
 *     },
 * });
 *
 * server.serve();
 * ```
 */
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
