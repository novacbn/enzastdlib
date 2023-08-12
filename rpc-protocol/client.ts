import { deepMerge } from '../vendor/@deno-std-collections.ts';

import type { EmptyObject } from '../collections/mod.ts';

import { ValidationError } from '../errors/mod.ts';

import { VALIDATOR_ERROR } from './error.schema.ts';
import { RPCError } from './error.ts';
import type { IDGenerator } from './id.ts';
import { defaultIDGenerator } from './id.ts';
import type { Notification } from './notification.schema.ts';
import type {
    DepromisifyNotificationRecord,
    NotificationRecord,
} from './notification.ts';
import type { CallOptions } from './payload.ts';
import { PAYLOAD_TYPES } from './payload.ts';
import type { Procedure } from './procedure.schema.ts';
import type { ProcedureRecord, PromisifyProcedureRecord } from './procedure.ts';
import { PROTOCOL_VERSION } from './protocol.ts';
import type { Response } from './response.schema.ts';
import { VALIDATOR_RESPONSE } from './response.schema.ts';
import { deleteUndefined } from './util.ts';

export interface BrokerClientOptions<
    Options extends CallOptions = CallOptions,
> {
    readonly calls?: Omit<Options, 'signal'>;

    readonly id?: IDGenerator;

    readonly processNotification: (
        notification: Notification,
        options: Omit<CallOptions, 'signal'>,
    ) => Promise<void> | void;

    readonly processProcedure: (
        procedure: Procedure,
        options: CallOptions,
    ) => Promise<Error | Response> | Error | Response;
}

export interface BrokerClient<
    Notifications extends NotificationRecord<false>,
    Procedures extends ProcedureRecord<false>,
    Options extends CallOptions = CallOptions,
> {
    readonly notifications: DepromisifyNotificationRecord<
        Notifications,
        Options
    >;

    readonly procedures: PromisifyProcedureRecord<Procedures, Options>;
}

export function makeBrokerClient<
    Procedures extends ProcedureRecord = EmptyObject,
    Notifications extends NotificationRecord = EmptyObject,
>(
    options: BrokerClientOptions,
): BrokerClient<Notifications, Procedures> {
    const {
        calls: client_options = {},
        id = defaultIDGenerator,
        processNotification,
        processProcedure,
    } = options;

    return {
        notifications: new Proxy<DepromisifyNotificationRecord<Notifications>>(
            // @ts-ignore - HACK: We do not need actually provide
            // contents to the `target` parameter.
            {},
            {
                get: (_target, notification: string, _receiver) => {
                    // TODO: Convert into a `BrokerClient.notification` function.

                    return async (
                        // HACK: We need to use any here to comply with strict typing.
                        // deno-lint-ignore no-explicit-any
                        parameters: any,
                        options: CallOptions = {},
                    ) => {
                        options = deepMerge(
                            client_options,
                            options,
                        );

                        // We need to deleted any undefined members otherwise
                        // the schema validators will see the assignment instead
                        // of ignoring it for optional members.
                        const payload: Notification = deleteUndefined(
                            {
                                enzastdlib: PROTOCOL_VERSION,
                                type: PAYLOAD_TYPES.notification,
                                metadata: options.metadata,

                                notification,
                                parameters,
                            },
                        );

                        await processNotification(
                            payload,
                            options,
                        );
                    };
                },
            },
        ),

        procedures: new Proxy<PromisifyProcedureRecord<Procedures>>(
            // @ts-ignore - HACK: We do not need actually provide
            // contents to the `target` parameter.
            {},
            {
                get: (_target, procedure: string, _receiver) => {
                    // TODO: Convert into a `BrokerClient.procedure` function.

                    return async (
                        // HACK: We need to use any here to comply with strict typing.
                        // deno-lint-ignore no-explicit-any
                        parameters: any,
                        options: CallOptions = {},
                    ) => {
                        options = deepMerge(
                            client_options,
                            options,
                        );

                        // We need to deleted any undefined members otherwise
                        // the schema validators will see the assignment instead
                        // of ignoring it for optional members.
                        const payload: Omit<Procedure, 'id'> = deleteUndefined(
                            {
                                enzastdlib: PROTOCOL_VERSION,
                                type: PAYLOAD_TYPES.procedure,
                                metadata: options.metadata,

                                procedure,
                                parameters,
                            },
                        );

                        // @ts-ignore - HACK: Yes the value is readonly, but we
                        // need to set it after initialization.
                        payload.id = id(payload, options);

                        const response = await processProcedure(
                            payload as Procedure,
                            options,
                        );

                        if (VALIDATOR_ERROR.instanceOf(response)) {
                            throw new RPCError(response);
                        } else if (VALIDATOR_RESPONSE.instanceOf(response)) {
                            return response.result;
                        }

                        throw new ValidationError(
                            `bad response from '${procedure}' (procedure '${procedure}' returned a malformed response)`,
                        );
                    };
                },
            },
        ),
    };
}
