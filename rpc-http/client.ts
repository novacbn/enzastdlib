import type { EmptyObject } from '../collections/object.ts';

import type { Client, ClientOptions } from '../rpc/mod.ts';

import type {
    CallOptions,
    NotificationRecord,
    ProcedureRecord,
} from '../rpc-protocol/mod.ts';
import { makeBrokerClient } from '../rpc-protocol/mod.ts';

import { PROTOCOL_METHOD } from './protocol.ts';

/**
 * Represents HTTP-related call options that can be passed when invoking.
 */
export interface HTTPCallOptions extends CallOptions {
    /**
     * Represents custom `fetch` options that can be passed to RPC calls.
     */
    http?: Omit<RequestInit, 'body' | 'method' | 'signal'>;
}

/**
 * Represents options passable to `makeHTTPClient`.
 */
export interface HTTPClientOptions extends ClientOptions<HTTPCallOptions> {
    /**
     * Represents options pertaining to configuring HTTP-related client options.
     */
    readonly http: {
        /**
         * Represents the HTTP endpoint to request for RPC calls.
         */
        readonly endpoint: string;
    };
}

/**
 * Represents a HTTP client made by `makeHTTPClient`.
 */
export type HTTPClient<
    Notifications extends NotificationRecord<false>,
    Procedures extends ProcedureRecord<false>,
> = Client<
    Notifications,
    Procedures,
    HTTPCallOptions
>;

/**
 * Makes a HTTP client that can communicate to a server in enzastdlib's RPC protocol.
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
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import {
 *     PROTOCOL_PATHNAME_PROCEDURES,
 *     makeHTTPClient,
 * } from 'https://deno.land/x/enzastdlib/rpc-http/mod.ts';
 *
 * import type { add } from './add.procedure.ts';
 *
 * type MyRPCProcedures = { add: typeof add };
 *
 * const client = makeHTTPClient<MyRPCProcedures>({
 *     http: {
 *         endpoint: `http://example.domain${PROTOCOL_PATHNAME_PROCEDURES}`,
 *     },
 * });
 *
 * const result = await client.procedures.add({ a: 1, b: 2 });
 *
 * assertEquals(result, { sum: 3 });
 * ```
 */
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
