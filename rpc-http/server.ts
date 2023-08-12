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
    PROTOCOL_PATHNAMES,
    PROTOCOL_RESPONSES,
} from './protocol.ts';

import { serveHTTP } from './serve.ts';

/**
 * Represents all the valid HTTP pathnames supported by the enzastdlib RPC protocol.
 *
 * @private
 */
const VALID_PROTOCOL_PATHNAMES = new Set<string>(
    Object.values(PROTOCOL_PATHNAMES),
);

/**
 * Represents options passable to `makeHTTPServer`.
 */
export interface HTTPServerOptions extends ServerOptions {
    /**
     * Represents HTTP-related options that is used by the RPC server.
     */
    readonly http?:
        & (
            | Omit<ServeInit, 'onListen' | 'signal'>
            | Omit<ServeTlsInit, 'onListen' | 'signal'>
        )
        & {
            /**
             * Represents an HTTP-level middleware that is invoked before the RPC
             * server processes the request. If a `Response` instance is returned
             * then the RPC Server will respond with that instead of processing
             * the request as an RPC call.
             *
             * @param request
             * @returns
             */
            readonly onRequest?: (
                request: Request,
            ) => Promise<Response | void> | Response | void;
        };
}

/**
 * Represents a HTTP server made by `makeHTTPServer`.
 */
export interface HTTPServer extends Server {
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
    readonly serve: () => Promise<
        Parameters<Exclude<ServeInit['onListen'], undefined>>[0]
    >;
}

/**
 * Makes a HTTP server that can respond to clients in enzastdlib's RPC protocol.
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
 * import { makeHTTPServer } from 'https://deno.land/x/enzastdlib/rpc-http/mod.ts';
 *
 * import { add } from './add.procedure.ts';
 *
 * const server = makeHTTPServer({
 *     http: {
 *         hostname: '127.0.0.1',
 *         port: 8080,
 *     },
 *
 *     procedures: {
 *         add,
 *     },
 * });
 *
 * server.serve();
 * ```
 */
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

        if (request.method !== PROTOCOL_METHOD) {
            return new Response(
                JSON.stringify(
                    {
                        enzastdlib: PROTOCOL_VERSION,
                        type: PAYLOAD_TYPES.error,

                        name: Deno.errors.BadResource.name,
                        message:
                            `bad request to server (invalid method '${request.method}', method must be '${PROTOCOL_METHOD}')`,
                    } satisfies Error,
                ),
                {
                    status: PROTOCOL_RESPONSES.invalid_method,
                },
            );
        }

        const url = new URL(request.url);

        if (!VALID_PROTOCOL_PATHNAMES.has(url.pathname)) {
            return new Response(
                JSON.stringify(
                    {
                        enzastdlib: PROTOCOL_VERSION,
                        type: PAYLOAD_TYPES.error,

                        name: Deno.errors.NotFound.name,
                        message:
                            `bad request to server (invalid pathname '${url.pathname}')`,
                    } satisfies Error,
                ),
                {
                    status: PROTOCOL_RESPONSES.invalid_pathname,
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
