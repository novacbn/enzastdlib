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

/**
 * Represents options passable to `makeMessagePortClient`.
 */
export interface MessagePortClientOptions extends ClientOptions {
    readonly port: MessagePortLike;
}

/**
 * Represents a `MessagePort` client made by `makeMessagePortClient`.
 */
export type MessagePortClient<
    Notifications extends NotificationRecord<false>,
    Procedures extends ProcedureRecord<false>,
> = Client<Notifications, Procedures>;

/**
 * Makes a `MessagePort` client that can communicate to a server in enzastdlib's RPC protocol.
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
 * import { makeMessagePortClient } from 'https://deno.land/x/enzastdlib/rpc-messageport/mod.ts';
 *
 * import type { add } from './add.procedure.ts';
 *
 * type MyRPCProcedures = { add: typeof add };
 *
 * const client = makeMessagePortClient<MyRPCProcedures>({
 *     // NOTE: We are assuming this client is being made in the scope of a
 *     // running WebWorker.
 *     port: self
 * });
 *
 * const result = await client.procedures.add({ a: 1, b: 2 });
 *
 * assertEquals(result, { sum: 3 });
 * ```
 */
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
