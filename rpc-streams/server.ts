import type { Server, ServerOptions } from '../rpc/mod.ts';

import { makeBrokerServer } from '../rpc-protocol/mod.ts';

import {
	makeEncodedJSONGenerator,
	makeEncodedJSONWriter,
} from './encodedjson.ts';

/**
 * Represents options passable to `makeStreamServer`.
 */
export interface StreamServerOptions extends ServerOptions {
	/**
	 * Represents the `ReadableStream` being used as input.
	 */
	readonly readable: ReadableStream<Uint8Array>;

	/**
	 * Represents the `WritableStream` being used as output.
	 */
	readonly writable: WritableStream<Uint8Array>;
}

/**
 * Represents a Streams API server made by `makeStreamServer`.
 */
export interface StreamServer extends Server {
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
 * Makes a Streams API server that can respond to clients in enzastdlib's RPC protocol.
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
 * import { makeStreamServer } from 'https://deno.land/x/enzastdlib/rpc-streams/mod.ts';
 *
 * import { add } from './add.procedure.ts';
 *
 * const command = new Deno.Command(..., {
 *     ...,
 *
 *     // **NOTE**: IO must be set to work as pipes or else the IPC will not be usable
 *     // as Web Streams.
 *     stdin: 'piped',
 *     stdout: 'piped',
 *     stderr: 'piped',
 * });
 *
 * const process = command.spawn();
 *
 * const server = makeStreamServer({
 *     readable: process.stdout,
 *     writable: process.stdin,
 *
 *     procedures: {
 *         add,
 *     },
 * });
 *
 * server.serve();
 * ```
 */
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
