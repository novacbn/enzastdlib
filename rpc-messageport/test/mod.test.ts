import {
    assertEquals,
    assertInstanceOf,
} from '../../vendor/@deno-std-testing.ts';

import type { EmptyObject } from '../../collections/mod.ts';

import type {
    Notification,
    Procedure,
    Response,
} from '../../rpc-protocol/mod.ts';
import {
    PAYLOAD_TYPES,
    PROTOCOL_VERSION,
    VALIDATOR_NOTIFICATION,
    VALIDATOR_PROCEDURE,
    VALIDATOR_RESPONSE,
} from '../../rpc-protocol/mod.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import { makeMessagePortClient, makeMessagePortServer } from '../mod.ts';

import type { AddParametersType, AddReturnType } from './add.schema.ts';
import { add } from './add.procedure.ts';

import type { LogParametersType } from './log.schema.ts';
import { log } from './log.notification.ts';

/** TODO: signal testing */

/** EXPORTED FUNCTIONALITY */

Deno.test(function makeMessagePortClientNotificationSuccess() {
    const { port1, port2 } = new MessageChannel();

    port1.addEventListener('message', (event: MessageEvent<unknown>) => {
        const { data: payload } = event;

        if (!VALIDATOR_NOTIFICATION.validate(payload)) return;

        assertEquals(
            payload,
            {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.notification,

                notification: log.name,
                parameters: {
                    message: 'Hello World!',
                },
            } satisfies Notification,
        );

        log(
            payload,
            payload.parameters as LogParametersType,
        );

        port1.close();
        port2.close();
    });

    port1.start();

    const client = makeMessagePortClient<EmptyObject, { log: typeof log }>({
        port: port2,
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.notifications, 'object');
    assertTypeOf(client.notifications.log, 'function');

    client.notifications.log({
        message: 'Hello World!',
    });
});

Deno.test(async function makeMessagePortClientProcedureSuccess() {
    const { port1, port2 } = new MessageChannel();

    port1.addEventListener('message', (event: MessageEvent<unknown>) => {
        const { data: payload } = event;

        if (!VALIDATOR_PROCEDURE.validate(payload)) return;

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
                },
            } satisfies Procedure,
        );

        const result = add(
            payload,
            payload.parameters as AddParametersType,
        );

        port1.postMessage(
            {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.response,
                id,

                result,
            } satisfies Response,
        );
    });

    port1.start();
    port2.start();

    const client = makeMessagePortClient<{ add: typeof add }>({
        port: port2,
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

    port1.close();
    port2.close();
});

Deno.test(function makeMessagePortServerNotificationSuccess() {
    const { port1, port2 } = new MessageChannel();

    port1.start();
    port2.start();

    const server = makeMessagePortServer({
        port: port1,

        notifications: {
            log,
        },
    });

    assertTypeOf(server, 'object');
    assertEquals(server.closed, true);
    assertTypeOf(server.serve, 'function');

    server.serve();
    assertEquals(server.closed, false);

    port2.postMessage(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.notification,

            notification: log.name,
            parameters: {
                message: 'Hello World!',
            } satisfies LogParametersType,
        } satisfies Notification,
    );

    assertTypeOf(server.close, 'function');

    server.close();
    assertEquals(server.closed, true);

    port1.close();
    port2.close();
});

Deno.test(function makeMessagePortServerProcedureSuccess() {
    const { port1, port2 } = new MessageChannel();

    const id = `${PAYLOAD_TYPES.procedure}_${add.name}_${crypto.randomUUID()}`;

    port2.addEventListener('message', (event: MessageEvent<unknown>) => {
        const { data: payload } = event;

        if (!VALIDATOR_RESPONSE.validate(payload)) return;

        assertTypeOf(payload.result, 'object');
        assertTypeOf((payload.result as AddReturnType).sum, 'number');

        assertEquals(
            payload,
            {
                enzastdlib: PROTOCOL_VERSION,
                type: PAYLOAD_TYPES.response,
                id,

                result: {
                    sum: 3,
                } satisfies AddReturnType,
            } satisfies Response,
        );

        assertTypeOf(server.close, 'function');

        server.close();
        assertEquals(server.closed, true);

        port1.close();
        port2.close();
    });

    port1.start();
    port2.start();

    const server = makeMessagePortServer({
        port: port1,

        procedures: {
            add,
        },
    });

    assertTypeOf(server, 'object');
    assertEquals(server.closed, true);
    assertTypeOf(server.serve, 'function');

    server.serve();
    assertEquals(server.closed, false);

    port2.postMessage(
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
});

Deno.test(async function makeMessagePortIntegrationSuccess() {
    const { port1, port2 } = new MessageChannel();

    port1.start();
    port2.start();

    const server = makeMessagePortServer({
        port: port1,

        notifications: {
            log,
        },

        procedures: {
            add,
        },
    });

    assertTypeOf(server, 'object');
    assertEquals(server.closed, true);
    assertTypeOf(server.serve, 'function');

    server.serve();
    assertEquals(server.closed, false);

    const client = makeMessagePortClient<
        { add: typeof add },
        { log: typeof log }
    >({
        port: port2,
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.notifications, 'object');
    assertTypeOf(client.notifications.log, 'function');

    client.notifications.log({
        message: 'Hello World!',
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

    assertTypeOf(server.close, 'function');

    server.close();
    assertEquals(server.closed, true);

    port1.close();
    port2.close();
});
