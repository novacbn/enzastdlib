import {
	assertEquals,
	assertInstanceOf,
} from '../../vendor/@deno-std-testing.ts';

import { makePromise } from '../../async/mod.ts';

import type { EmptyObject } from '../../collections/mod.ts';

import type {
	Error,
	Notification,
	Procedure,
	Response,
} from '../../rpc-protocol/mod.ts';
import {
	PAYLOAD_TYPES,
	PROTOCOL_VERSION,
	VALIDATOR_ERROR,
	VALIDATOR_NOTIFICATION,
	VALIDATOR_PROCEDURE,
	VALIDATOR_RESPONSE,
} from '../../rpc-protocol/mod.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import {
	makeHTTPClient,
	makeHTTPServer,
	PROTOCOL_METHOD,
	PROTOCOL_PATHNAME_PROCEDURES,
	PROTOCOL_RESPONSES,
} from '../mod.ts';

import { serveHTTP } from '../serve.ts';

import type { AddParametersType, AddReturnType } from './add.schema.ts';
import { add } from './add.procedure.ts';

import type { LogParametersType } from './log.schema.ts';
import { log } from './log.notification.ts';

const TEST_HOSTNAME = 'localhost';

const TEST_PORT = 9595;

/** TODO: signal testing */

/** EXPORTED FUNCTIONALITY */

Deno.test(function makeHTTPClientNotificationSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const controller = new AbortController();
	const { resolve, reject: _reject, promise } = makePromise();

	serveHTTP(async (request) => {
		const payload = await request.json();

		if (!VALIDATOR_NOTIFICATION.validate(payload)) return new Response();

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

		setTimeout(() => {
			// HACK: Hacky as all get out! But the test would not wait
			// properly without it.
			controller.abort();
			resolve();
		}, 0);

		return new Response(
			null,
			{ status: PROTOCOL_RESPONSES.successful_no_response },
		);
	}, { hostname: TEST_HOSTNAME, port: TEST_PORT, signal: controller.signal });

	const client = makeHTTPClient<EmptyObject, { log: typeof log }>({
		http: {
			endpoint:
				`http://${TEST_HOSTNAME}:${TEST_PORT}${PROTOCOL_PATHNAME_PROCEDURES}`,
		},
	});

	assertTypeOf(client, 'object');
	assertTypeOf(client.notifications, 'object');
	assertTypeOf(client.notifications.log, 'function');

	client.notifications.log({
		message: 'Hello World!',
	});

	return promise;
});

Deno.test(async function makeHTTPClientProcedureSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const controller = new AbortController();

	serveHTTP(async (request) => {
		const payload = await request.json();

		if (!VALIDATOR_PROCEDURE.validate(payload)) return new Response();

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

		return new Response(
			JSON.stringify(
				{
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.response,
					id,

					result,
				} satisfies Response,
			),
			{ status: PROTOCOL_RESPONSES.successful_call },
		);
	}, { hostname: TEST_HOSTNAME, port: TEST_PORT, signal: controller.signal });

	const client = makeHTTPClient<{ add: typeof add }>({
		http: {
			endpoint:
				`http://${TEST_HOSTNAME}:${TEST_PORT}${PROTOCOL_PATHNAME_PROCEDURES}`,
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

	controller.abort();
});

Deno.test(function makeHTTPClientNotificationHTTPOptionsSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const controller = new AbortController();
	const { resolve, reject: _reject, promise } = makePromise();

	serveHTTP(async (request) => {
		assertEquals(request.headers.get('X-Test'), 'meepbeep');

		const payload = await request.json();

		setTimeout(() => {
			controller.abort();
			resolve();
		}, 0);

		return new Response(
			JSON.stringify(
				{
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.response,
					id: payload.id,

					result: {
						sum: 3,
					} satisfies AddReturnType,
				} satisfies Response,
			),
			{ status: PROTOCOL_RESPONSES.successful_call },
		);
	}, { hostname: TEST_HOSTNAME, port: TEST_PORT, signal: controller.signal });

	const client = makeHTTPClient<EmptyObject, { log: typeof log }>({
		http: {
			endpoint:
				`http://${TEST_HOSTNAME}:${TEST_PORT}${PROTOCOL_PATHNAME_PROCEDURES}`,
		},
	});

	assertTypeOf(client, 'object');
	assertTypeOf(client.notifications, 'object');
	assertTypeOf(client.notifications.log, 'function');

	client.notifications.log({
		message: 'Hello World!',
	}, {
		http: {
			headers: {
				'X-Test': 'meepbeep',
			},
		},
	});

	return promise;
});

Deno.test(async function makeHTTPClientProcedureHTTPOptionsSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const controller = new AbortController();

	serveHTTP(async (request) => {
		assertEquals(request.headers.get('X-Test'), 'meepbeep');

		const payload = await request.json();

		return new Response(
			JSON.stringify(
				{
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.response,
					id: payload.id,

					result: {
						sum: 3,
					} satisfies AddReturnType,
				} satisfies Response,
			),
			{ status: PROTOCOL_RESPONSES.successful_call },
		);
	}, { hostname: TEST_HOSTNAME, port: TEST_PORT, signal: controller.signal });

	const client = makeHTTPClient<{ add: typeof add }>({
		http: {
			endpoint:
				`http://${TEST_HOSTNAME}:${TEST_PORT}${PROTOCOL_PATHNAME_PROCEDURES}`,
		},
	});

	assertTypeOf(client, 'object');
	assertTypeOf(client.procedures, 'object');
	assertTypeOf(client.procedures.add, 'function');

	await client.procedures.add({
		a: 2,
		b: 1,
	}, {
		http: {
			headers: {
				'X-Test': 'meepbeep',
			},
		},
	});

	controller.abort();
});

Deno.test(async function makeHTTPServerNotificationSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const server = makeHTTPServer({
		http: {
			hostname: TEST_HOSTNAME,
			port: TEST_PORT,
		},

		notifications: {
			log,
		},
	});

	assertTypeOf(server, 'object');
	assertEquals(server.closed, true);
	assertTypeOf(server.serve, 'function');

	const { hostname, port } = await server.serve();
	assertEquals(server.closed, false);

	const response = await fetch(
		`http://${hostname}:${port}${PROTOCOL_PATHNAME_PROCEDURES}`,
		{
			body: JSON.stringify(
				{
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.notification,

					notification: log.name,
					parameters: {
						message: 'Hello World!',
					} satisfies LogParametersType,
				} satisfies Notification,
			),

			method: PROTOCOL_METHOD,
		},
	);

	assertEquals(response.status, PROTOCOL_RESPONSES.successful_no_response);

	assertTypeOf(server.close, 'function');

	server.close();
	assertEquals(server.closed, true);
});

Deno.test(async function makeHTTPServerProcedureSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const id = `${PAYLOAD_TYPES.procedure}_${add.name}_${crypto.randomUUID()}`;

	const server = makeHTTPServer({
		http: {
			hostname: TEST_HOSTNAME,
			port: TEST_PORT,
		},

		procedures: {
			add,
		},
	});

	assertTypeOf(server, 'object');
	assertEquals(server.closed, true);
	assertTypeOf(server.serve, 'function');

	const { hostname, port } = await server.serve();
	assertEquals(server.closed, false);

	const response = await fetch(
		`http://${hostname}:${port}${PROTOCOL_PATHNAME_PROCEDURES}`,
		{
			body: JSON.stringify(
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
			),

			method: PROTOCOL_METHOD,
		},
	);

	assertEquals(response.status, PROTOCOL_RESPONSES.successful_call);

	const payload = await response.json();
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
});

Deno.test(async function makeHTTPServerMethodFailure() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const id = `${add.name}_${crypto.randomUUID()}`;

	const server = makeHTTPServer({
		http: {
			hostname: TEST_HOSTNAME,
			port: TEST_PORT,
		},
	});

	assertTypeOf(server, 'object');
	assertEquals(server.closed, true);
	assertTypeOf(server.serve, 'function');

	const { hostname, port } = await server.serve();
	assertEquals(server.closed, false);

	const response = await fetch(
		`http://${hostname}:${port}${PROTOCOL_PATHNAME_PROCEDURES}`,
		{
			body: JSON.stringify(
				{
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.procedure,
					id,

					procedure: 'add',
				} satisfies Procedure,
			),

			method: 'PUT',
		},
	);

	assertEquals(response.status, PROTOCOL_RESPONSES.invalid_method);

	const payload = await response.json();
	if (!VALIDATOR_ERROR.validate(payload)) return;

	assertEquals(
		payload,
		{
			enzastdlib: PROTOCOL_VERSION,
			type: PAYLOAD_TYPES.error,

			name: Deno.errors.BadResource.name,
			message:
				`bad request to server (invalid method 'PUT', method must be '${PROTOCOL_METHOD}')`,
		} satisfies Error,
	);

	assertTypeOf(server.close, 'function');

	server.close();
	assertEquals(server.closed, true);
});

Deno.test(async function makeHTTPServerOnRequestSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const server = makeHTTPServer({
		http: {
			hostname: TEST_HOSTNAME,
			port: TEST_PORT,

			onRequest: (request) => {
				const url = new URL(request.url);
				if (url.pathname === '/meepbeep') {
					return new Response('beepmeep');
				}
			},
		},
	});

	assertTypeOf(server, 'object');
	assertEquals(server.closed, true);
	assertTypeOf(server.serve, 'function');

	const { hostname, port } = await server.serve();
	assertEquals(server.closed, false);

	const response = await fetch(
		`http://${hostname}:${port}/meepbeep`,
	);

	const payload = await response.text();
	assertEquals(payload, 'beepmeep');

	assertTypeOf(server.close, 'function');

	server.close();
	assertEquals(server.closed, true);
});

Deno.test(async function makeHTTPServerPathnameFailure() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const id = `${add.name}_${crypto.randomUUID()}`;

	const server = makeHTTPServer({
		http: {
			hostname: TEST_HOSTNAME,
			port: TEST_PORT,
		},
	});

	assertTypeOf(server, 'object');
	assertEquals(server.closed, true);
	assertTypeOf(server.serve, 'function');

	const { hostname, port } = await server.serve();
	assertEquals(server.closed, false);

	const response = await fetch(
		`http://${hostname}:${port}/meepbeep`,
		{
			body: JSON.stringify(
				{
					enzastdlib: PROTOCOL_VERSION,
					type: PAYLOAD_TYPES.procedure,
					id,

					procedure: 'add',
				} satisfies Procedure,
			),

			method: PROTOCOL_METHOD,
		},
	);

	assertEquals(response.status, PROTOCOL_RESPONSES.invalid_pathname);

	const payload = await response.json();
	if (!VALIDATOR_ERROR.validate(payload)) return;

	assertEquals(
		payload,
		{
			enzastdlib: PROTOCOL_VERSION,
			type: PAYLOAD_TYPES.error,

			name: Deno.errors.NotFound.name,
			message: `bad request to server (invalid pathname '/meepbeep')`,
		} satisfies Error,
	);

	assertTypeOf(server.close, 'function');

	server.close();
	assertEquals(server.closed, true);
});

Deno.test(async function makeHTTPIntegrationSuccess() {
	console.log(
		'serve' in Deno
			? 'Using \'Deno.serve\'...'
			: 'Using \'@deno-std-http\'...',
	);

	const server = makeHTTPServer({
		http: {
			hostname: TEST_HOSTNAME,
			port: TEST_PORT,
		},

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

	const { hostname, port } = await server.serve();
	assertEquals(server.closed, false);

	const client = makeHTTPClient<{ add: typeof add }, { log: typeof log }>({
		http: {
			endpoint:
				`http://${hostname}:${port}${PROTOCOL_PATHNAME_PROCEDURES}`,
		},
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
