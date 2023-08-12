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

import { makeStreamClient, makeStreamServer } from '../mod.ts';

import {
    makeEncodedJSONGenerator,
    makeEncodedJSONWriter,
} from '../encodedjson.ts';

import type { AddParametersType, AddReturnType } from './add.schema.ts';
import { add } from './add.procedure.ts';

import type { LogParametersType } from './log.schema.ts';
import { log } from './log.notification.ts';

/** TODO: signal testing */

/** EXPORTED FUNCTIONALITY */

function makeLinkedChannels() {
    const transform_a = new TransformStream<Uint8Array, Uint8Array>();
    const transform_b = new TransformStream<Uint8Array, Uint8Array>();

    return {
        channel_a: {
            readable: transform_a.readable,
            writable: transform_b.writable,
        },

        channel_b: {
            readable: transform_b.readable,
            writable: transform_a.writable,
        },
    };
}

Deno.test(async function makeStreamClientNotificationSuccess() {
    const { channel_a, channel_b } = makeLinkedChannels();

    const client = makeStreamClient<EmptyObject, { log: typeof log }>({
        readable: channel_a.readable,
        writable: channel_a.writable,
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.notifications, 'object');
    assertTypeOf(client.notifications.log, 'function');

    const promise = client.notifications.log({
        message: 'Hello World!',
    });

    assertInstanceOf(promise, Promise);

    const generator = makeEncodedJSONGenerator(channel_b.readable);

    const { value: payload } = await generator.next();
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

    await generator.return();
});

Deno.test(async function makeStreamClientProcedureSuccess() {
    const { channel_a, channel_b } = makeLinkedChannels();

    const client = makeStreamClient<{ add: typeof add }>({
        readable: channel_a.readable,
        writable: channel_a.writable,
    });

    assertTypeOf(client, 'object');
    assertTypeOf(client.procedures, 'object');
    assertTypeOf(client.procedures.add, 'function');

    const promise = client.procedures.add({
        a: 2,
        b: 1,
    });

    assertInstanceOf(promise, Promise);

    const generator = makeEncodedJSONGenerator(channel_b.readable);

    const { value: payload } = await generator.next();
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

    const direct_result = add(
        payload,
        payload.parameters as AddParametersType,
    );

    const writer = makeEncodedJSONWriter(channel_b.writable);

    await writer.write(
        {
            enzastdlib: PROTOCOL_VERSION,
            type: PAYLOAD_TYPES.response,
            id,

            result: direct_result,
        } satisfies Response,
    );

    const remote_result = await promise;

    assertTypeOf(remote_result, 'object');
    assertTypeOf(remote_result.sum, 'number');

    assertEquals(
        remote_result,
        {
            sum: 3,
        } satisfies AddReturnType,
    );

    await generator.return();
    writer.releaseLock();
});

Deno.test(async function makeStreamServerNotificationSuccess() {
    const { channel_a, channel_b } = makeLinkedChannels();

    const server = makeStreamServer({
        readable: channel_a.readable,
        writable: channel_a.writable,

        notifications: {
            log,
        },
    });

    assertTypeOf(server, 'object');
    assertEquals(server.closed, true);
    assertTypeOf(server.serve, 'function');

    server.serve();
    assertEquals(server.closed, false);

    const writer = makeEncodedJSONWriter(channel_b.writable);

    await writer.write(
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

    writer.releaseLock();
});

Deno.test(async function makeStreamServerProcedureSuccess() {
    const { channel_a, channel_b } = makeLinkedChannels();

    const id = `${add.name}_${crypto.randomUUID()}`;

    const server = makeStreamServer({
        readable: channel_a.readable,
        writable: channel_a.writable,

        procedures: {
            add,
        },
    });

    assertTypeOf(server, 'object');
    assertEquals(server.closed, true);
    assertTypeOf(server.serve, 'function');

    server.serve();
    assertEquals(server.closed, false);

    const writer = makeEncodedJSONWriter(channel_b.writable);

    await writer.write(
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

    const generator = makeEncodedJSONGenerator(channel_b.readable);
    const { value: payload } = await generator.next();

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

    await generator.return();
    writer.releaseLock();
});

Deno.test(async function makeStreamIntegrationSuccess() {
    const { channel_a, channel_b } = makeLinkedChannels();

    const server = makeStreamServer({
        readable: channel_a.readable,
        writable: channel_a.writable,

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

    const client = makeStreamClient<
        { add: typeof add },
        { log: typeof log }
    >({
        readable: channel_b.readable,
        writable: channel_b.writable,
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
});
