import {
    assertEquals,
    assertInstanceOf,
} from '../../vendor/@deno-std-testing.ts';

import { v4 } from '../../vendor/@deno-std-uuid.ts';

import type { EmptyObject } from '../../collections/mod.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import type { Notification, Procedure, Response } from '../mod.ts';
import {
    defaultIDGenerator,
    makeBrokerClient,
    makeBrokerServer,
    PAYLOAD_TYPES,
    PROTOCOL_VERSION,
    VALIDATOR_NOTIFICATION,
    VALIDATOR_PAYLOAD,
    VALIDATOR_PROCEDURE,
    VALIDATOR_RESPONSE,
} from '../mod.ts';

import type { AddParametersType, AddReturnType } from './add.schema.ts';
import { add, addMultiplied } from './add.procedure.ts';

import type { LogParametersType } from './log.schema.ts';
import { log, logReversed } from './log.notification.ts';

/** to test: validation */

/** EXPORTED FUNCTIONALITY */

Deno.test(function defaultIDGeneratorSuccess() {
    const id = defaultIDGenerator({
        enzastdlib: PROTOCOL_VERSION,
        type: PAYLOAD_TYPES.procedure,

        procedure: add.name,
        parameters: {
            a: 2,
            b: 1,
        } satisfies AddParametersType,
    }, {});

    assertTypeOf(id, 'string');
    assertEquals(
        id.startsWith(`${PAYLOAD_TYPES.procedure}_${add.name}_`),
        true,
    );

    // NOTE: The `+ 2` comes from the two `_` delimiters.
    const uuid = id.slice(PAYLOAD_TYPES.procedure.length + add.name.length + 2);
    assertEquals(v4.validate(uuid), true);
});

Deno.test(async function makeBrokerClientProcedureSuccess() {
    const client = makeBrokerClient<{ add: typeof add }>({
        processNotification: () => {
            throw Error('noop');
        },

        processProcedure: (payload, _options) => {
            VALIDATOR_PROCEDURE.validate(payload);

            // HACK: We cannot control the ID at this API level.
            const { id } = payload;

            assertEquals(
                payload,
                {
                    enzastdlib: PROTOCOL_VERSION,
                    type: PAYLOAD_TYPES.procedure,
                    id,

                    procedure: add.name,
                    parameters: {
                        a: 2,
                        b: 1,
                    } satisfies AddParametersType,
                } satisfies Procedure,
            );

            const result = add(
                payload,
                payload.parameters as AddParametersType,
            );

            return {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.response,
                id,

                result,
            } satisfies Response;
        },
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.procedures, 'object');
    assertTypeOf(client.procedures.add, 'function');

    const promise = client.procedures.add({
        a: 2,
        b: 1,
    });

    assertInstanceOf(promise, Promise);

    const result = await promise;

    assertTypeOf(result, 'object');
    assertTypeOf(result.sum, 'number');

    assertEquals(
        result,
        {
            sum: 3,
        } satisfies AddReturnType,
    );
});

Deno.test(function makeBrokerClientNotificationSuccess() {
    const client = makeBrokerClient<EmptyObject, { log: typeof log }>({
        processNotification: (payload, _options) => {
            VALIDATOR_NOTIFICATION.validate(payload);

            assertEquals(
                payload,
                {
                    enzastdlib: PROTOCOL_VERSION,
                    type: PAYLOAD_TYPES.notification,

                    notification: log.name,
                    parameters: {
                        message: 'Hello World!',
                    } satisfies LogParametersType,
                } satisfies Notification,
            );

            log(
                payload,
                payload.parameters as LogParametersType,
            );
        },

        processProcedure: () => {
            throw Error('noop');
        },
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.notifications, 'object');
    assertTypeOf(client.notifications.log, 'function');

    client.notifications.log({
        message: 'Hello World!',
    });
});

Deno.test(async function makeBrokerClientProcedureIDCustomSuccess() {
    const client = makeBrokerClient<{ add: typeof add }>({
        id: (payload, options) => {
            // NOTE: We cannot use a schema validator here since
            // the payload does not have its `id` set yet.

            assertTypeOf(payload, 'object');

            const { procedure, type } = payload;

            assertTypeOf(procedure, 'string');
            assertTypeOf(type, 'string');

            assertTypeOf(options, 'object');
            return `meepbeep_${type}_${procedure}`;
        },

        processNotification: () => {
            throw Error('noop');
        },

        processProcedure: (payload, _options) => {
            VALIDATOR_PROCEDURE.validate(payload);

            const { id } = payload;

            assertEquals(id, `meepbeep_${PAYLOAD_TYPES.procedure}_${add.name}`);

            return {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.response,
                id,

                result: {
                    sum: 3,
                } satisfies AddReturnType,
            } satisfies Response;
        },
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.procedures, 'object');
    assertTypeOf(client.procedures.add, 'function');

    await client.procedures.add({
        a: 2,
        b: 1,
    });
});

Deno.test(async function makeBrokerClientMetadataSuccess() {
    const client = makeBrokerClient<{ add: typeof add }, { log: typeof log }>({
        calls: {
            metadata: {
                authorization: '51e45c70-bf30-4eae-b2aa-174a3454d728',
            },
        },

        processNotification: (payload, options) => {
            VALIDATOR_NOTIFICATION.validate(payload);

            assertTypeOf(options, 'object');

            const { metadata } = options;

            assertTypeOf(metadata, 'object');
            assertEquals(metadata, {
                authorization: '51e45c70-bf30-4eae-b2aa-174a3454d728',
            });
        },

        processProcedure: (payload, options) => {
            VALIDATOR_PROCEDURE.validate(payload);

            // HACK: We cannot control the ID at this API level.
            const { id } = payload;

            assertTypeOf(options, 'object');

            const { metadata } = options;

            assertTypeOf(metadata, 'object');
            assertEquals(metadata, {
                authorization: '51e45c70-bf30-4eae-b2aa-174a3454d728',
            });

            return {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.response,
                id,

                result: {
                    sum: 3,
                } satisfies AddReturnType,
            } satisfies Response;
        },
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.procedures, 'object');
    assertTypeOf(client.procedures.add, 'function');

    await client.procedures.add({
        a: 2,
        b: 1,
    });

    assertTypeOf(client.notifications, 'object');
    assertTypeOf(client.notifications.log, 'function');

    client.notifications.log({
        message: 'Hello World!',
    });
});

Deno.test(async function makeBrokerClientCallMetadataSuccess() {
    const client = makeBrokerClient<{ add: typeof add }, { log: typeof log }>({
        processNotification: (payload, options) => {
            VALIDATOR_NOTIFICATION.validate(payload);

            assertTypeOf(options, 'object');

            const { metadata } = options;

            assertTypeOf(metadata, 'object');
            assertEquals(metadata, {
                authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
            });
        },

        processProcedure: (payload, options) => {
            VALIDATOR_PROCEDURE.validate(payload);

            // HACK: We cannot control the ID at this API level.
            const { id } = payload;

            assertTypeOf(options, 'object');

            const { metadata } = options;

            assertTypeOf(metadata, 'object');
            assertEquals(metadata, {
                authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
            });

            return {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.response,
                id,

                result: {
                    sum: 3,
                } satisfies AddReturnType,
            } satisfies Response;
        },
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.procedures, 'object');
    assertTypeOf(client.procedures.add, 'function');

    await client.procedures.add({
        a: 2,
        b: 1,
    }, {
        metadata: {
            authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
        },
    });

    assertTypeOf(client.notifications, 'object');
    assertTypeOf(client.notifications.log, 'function');

    client.notifications.log({
        message: 'Hello World!',
    }, {
        metadata: {
            authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
        },
    });
});

Deno.test(async function makeBrokerClientCallMetadataOverrideSuccess() {
    const client = makeBrokerClient<{ add: typeof add }, { log: typeof log }>({
        calls: {
            metadata: {
                authorization: '51e45c70-bf30-4eae-b2aa-174a3454d728',
            },
        },

        processNotification: (payload, options) => {
            VALIDATOR_NOTIFICATION.validate(payload);

            assertTypeOf(options, 'object');

            const { metadata } = options;

            assertTypeOf(metadata, 'object');
            assertEquals(metadata, {
                authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
            });
        },

        processProcedure: (payload, options) => {
            VALIDATOR_PROCEDURE.validate(payload);

            // HACK: We cannot control the ID at this API level.
            const { id } = payload;

            assertTypeOf(options, 'object');

            const { metadata } = options;

            assertTypeOf(metadata, 'object');
            assertEquals(metadata, {
                authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
            });

            return {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.response,
                id,

                result: {
                    sum: 3,
                } satisfies AddReturnType,
            } satisfies Response;
        },
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.procedures, 'object');
    assertTypeOf(client.procedures.add, 'function');

    await client.procedures.add({
        a: 2,
        b: 1,
    }, {
        metadata: {
            authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
        },
    });

    assertTypeOf(client.notifications, 'object');
    assertTypeOf(client.notifications.log, 'function');

    client.notifications.log({
        message: 'Hello World!',
    }, {
        metadata: {
            authorization: 'de79ff9e-c073-4bdd-a543-6f3b3b85ef64',
        },
    });
});

Deno.test(async function makeBrokerServerProcedureSuccess() {
    const id = `${add.name}_${crypto.randomUUID()}`;

    const server = makeBrokerServer({
        procedures: { add },
    });

    assertTypeOf(server, 'object');
    assertTypeOf(server.processPayload, 'function');

    const promise = server.processPayload(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.procedure,
            id,

            procedure: add.name,
            parameters: {
                a: 2,
                b: 1,
            } satisfies AddParametersType,
        } satisfies Procedure,
    );

    assertInstanceOf(promise, Promise);

    const response = await promise;
    if (!VALIDATOR_RESPONSE.validate(response)) return;

    assertTypeOf(response.result, 'object');
    assertTypeOf((response.result as AddReturnType).sum, 'number');

    assertEquals(
        response,
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.response,
            id,

            result: {
                sum: 3,
            } satisfies AddReturnType,
        } satisfies Response,
    );
});

Deno.test(async function makeBrokerServerNotificationSuccess() {
    const server = makeBrokerServer({
        notifications: { log },
    });

    assertTypeOf(server, 'object');
    assertTypeOf(server.processPayload, 'function');

    const promise = server.processPayload(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.notification,

            notification: log.name,
            parameters: {
                message: 'Hello World!',
            } satisfies LogParametersType,
        } satisfies Notification,
    );

    assertInstanceOf(promise, Promise);
    await promise;
});

Deno.test(async function makeBrokerServerMiddlewareSuccess() {
    const id = `${add.name}_${crypto.randomUUID()}`;

    const server = makeBrokerServer({
        procedures: {},

        middlewares: [
            (payload) => {
                VALIDATOR_PAYLOAD.validate(payload);

                const { type } = payload;

                if (type === PAYLOAD_TYPES.notification) {
                    VALIDATOR_NOTIFICATION.validate(payload);

                    assertEquals(
                        payload,
                        {
                            enzastdlib: PROTOCOL_VERSION,
                            type: PAYLOAD_TYPES.notification,

                            notification: log.name,
                            parameters: {
                                message: 'Hello World!',
                            } satisfies LogParametersType,
                        } satisfies Notification,
                    );
                } else if (type == PAYLOAD_TYPES.procedure) {
                    VALIDATOR_PROCEDURE.validate(payload);

                    assertEquals(
                        payload,
                        {
                            enzastdlib: PROTOCOL_VERSION,
                            type: PAYLOAD_TYPES.procedure,
                            id,

                            procedure: add.name,
                            parameters: {
                                a: 2,
                                b: 1,
                            } satisfies AddParametersType,
                        } satisfies Procedure,
                    );

                    return {
                        enzastdlib: PROTOCOL_VERSION,
                        type: PAYLOAD_TYPES.response,
                        id,

                        result: {
                            sum: 3,
                        } satisfies AddReturnType,
                    } satisfies Response;
                }
            },
        ],
    });

    assertTypeOf(server.processPayload, 'function');

    const promise_response = server.processPayload(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.procedure,
            id,

            procedure: add.name,
            parameters: {
                a: 2,
                b: 1,
            } satisfies AddParametersType,
        } satisfies Procedure,
    );

    assertInstanceOf(promise_response, Promise);

    const response = await promise_response;
    if (!VALIDATOR_RESPONSE.validate(response)) return;

    assertTypeOf(response.result, 'object');
    assertTypeOf((response.result as AddReturnType).sum, 'number');

    assertEquals(
        response,
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.response,
            id,

            result: {
                sum: 3,
            } satisfies AddReturnType,
        } satisfies Response,
    );

    const promise_notification = server.processPayload(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.notification,

            notification: log.name,
            parameters: {
                message: 'Hello World!',
            } satisfies LogParametersType,
        } satisfies Notification,
    );

    assertInstanceOf(promise_notification, Promise);
    await promise_notification;
});

Deno.test(async function makeBrokerServerCallMiddlewareSuccess() {
    const id = `${add.name}_${crypto.randomUUID()}`;

    const server = makeBrokerServer({
        notifications: { logReversed },
        procedures: { addMultiplied },
    });

    assertTypeOf(server.processProcedure, 'function');

    const promise_response = server.processProcedure(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.procedure,
            id,

            procedure: addMultiplied.name,
            parameters: {
                a: 2,
                b: 1,
            } satisfies AddParametersType,
        },
    );

    assertInstanceOf(promise_response, Promise);

    const response = await promise_response;
    if (!VALIDATOR_RESPONSE.validate(response)) return;

    assertTypeOf(response.result, 'object');
    assertTypeOf((response.result as AddReturnType).sum, 'number');

    assertEquals(
        response,
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.response,
            id,

            result: {
                sum: 6,
            } satisfies AddReturnType,
        } satisfies Response,
    );

    assertTypeOf(server.processNotification, 'function');

    const promise_notification = server.processNotification(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.notification,

            notification: logReversed.name,
            parameters: {
                message: 'Hello World!',
            } satisfies LogParametersType,
        },
    );

    assertInstanceOf(promise_notification, Promise);
    await promise_notification;
});
