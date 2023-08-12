import {
    assertEquals,
    assertInstanceOf,
    assertRejects,
    assertThrows,
} from '../../vendor/@deno-std-testing.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import { ValidationError } from '../../errors/mod.ts';

import {
    testDotenv,
    testEnvironment,
    validateDotenv,
    validateEnvironment,
} from '../mod.ts';

import type { ArrayType } from './array.schema.ts';
import { SCHEMA_ARRAY } from './array.schema.ts';
import type { BooleanType } from './boolean.schema.ts';
import { SCHEMA_BOOLEAN } from './boolean.schema.ts';
import type { NumberType } from './number.schema.ts';
import { SCHEMA_NUMBER } from './number.schema.ts';
import type { StringType } from './string.schema.ts';
import { SCHEMA_STRING } from './string.schema.ts';
import type { ObjectType } from './object.schema.ts';
import { SCHEMA_OBJECT } from './object.schema.ts';

/** EXPORTED FUNCTIONALITY */

Deno.test(function testDotenvArraySuccess() {
    Deno.env.set('SERVER_PLUGINS', '"compression", "static-files"');

    const errors = testEnvironment(SCHEMA_ARRAY);

    assertEquals(errors, undefined);
});

Deno.test(async function testDotenvArrayFailure() {
    const promise = testDotenv(SCHEMA_ARRAY, {
        'envPath': './environment/test/.bad.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertInstanceOf(errors, Array);

    assertEquals(errors, [
        {
            message: 'Property "SERVER_PLUGINS" does not match schema.',
            property: '#',
        },

        {
            message: 'Items did not match schema.',
            property: '#/SERVER_PLUGINS',
        },

        {
            message: 'Instance type "number" is invalid. Expected "string".',
            property: '#/SERVER_PLUGINS/0',
        },

        {
            message: 'Items did not match schema.',
            property: '#/SERVER_PLUGINS',
        },

        {
            message: 'Instance type "number" is invalid. Expected "string".',
            property: '#/SERVER_PLUGINS/1',
        },

        {
            message:
                'Property "SERVER_PLUGINS" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER_PLUGINS',
        },
    ]);
});

Deno.test(async function testDotenvBooleanSuccess() {
    const promise = testDotenv(SCHEMA_BOOLEAN, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertEquals(errors, undefined);
});

Deno.test(async function testDotenvNumberSuccess() {
    const promise = testDotenv(SCHEMA_NUMBER, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertEquals(errors, undefined);
});

Deno.test(async function testDotenvNumberFailure() {
    const promise = testDotenv(SCHEMA_NUMBER, {
        'envPath': './environment/test/.bad.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertInstanceOf(errors, Array);

    assertEquals(errors, [
        {
            message: 'Property "SERVER_PORT" does not match schema.',
            property: '#',
        },

        {
            message: '42 is less than 1024.',
            property: '#/SERVER_PORT',
        },

        {
            message:
                'Property "SERVER_PORT" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER_PORT',
        },
    ]);
});

Deno.test(async function testDotenvObjectSuccess() {
    const promise = testDotenv(SCHEMA_OBJECT, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertEquals(errors, undefined);
});

Deno.test(async function testDotenvObjectFailure() {
    const promise = testDotenv(SCHEMA_OBJECT, {
        'envPath': './environment/test/.bad.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertInstanceOf(errors, Array);

    assertEquals(errors, [
        {
            message: 'Property "SERVER" does not match schema.',
            property: '#',
        },

        {
            message: 'Property "name" does not match schema.',
            property: '#/SERVER',
        },

        {
            message: 'String is too short (0 < 1).',
            property: '#/SERVER/name',
        },

        {
            message: 'Property "port" does not match schema.',
            property: '#/SERVER',
        },

        {
            message: '42 is less than 1024.',
            property: '#/SERVER/port',
        },

        {
            message:
                'Property "name" does not match additional properties schema.',
            property: '#/SERVER',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER/name',
        },

        {
            message:
                'Property "port" does not match additional properties schema.',
            property: '#/SERVER',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER/port',
        },

        {
            message:
                'Property "SERVER" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER',
        },
    ]);
});

Deno.test(async function testDotenvStringSuccess() {
    const promise = testDotenv(SCHEMA_STRING, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertEquals(errors, undefined);
});

Deno.test(async function testDotenvStringFailure() {
    const promise = testDotenv(SCHEMA_STRING, {
        'envPath': './environment/test/.bad.env',
    });

    assertInstanceOf(promise, Promise);

    const errors = await promise;

    assertEquals(errors, [
        {
            message: 'Property "SERVER_NAME" does not match schema.',
            property: '#',
        },

        {
            message: 'String is too short (0 < 1).',
            property: '#/SERVER_NAME',
        },

        {
            message:
                'Property "SERVER_NAME" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER_NAME',
        },
    ]);
});

Deno.test(function testEnvironmentUndefined() {
    Deno.env.delete('SERVER_EXPOSED');

    const errors = testEnvironment(SCHEMA_BOOLEAN);

    assertEquals(errors, undefined);
});

Deno.test(function testEnvironmentArraySuccess() {
    Deno.env.set('SERVER_PLUGINS', '"compression", "static-files"');

    const errors = testEnvironment(SCHEMA_ARRAY);

    assertEquals(errors, undefined);
});

Deno.test(function testEnvironmentArrayFailure() {
    Deno.env.set('SERVER_PLUGINS', '4, 2');

    const errors = testEnvironment(SCHEMA_ARRAY);

    assertInstanceOf(errors, Array);

    assertEquals(errors, [
        {
            message: 'Property "SERVER_PLUGINS" does not match schema.',
            property: '#',
        },

        {
            message: 'Items did not match schema.',
            property: '#/SERVER_PLUGINS',
        },

        {
            message: 'Instance type "number" is invalid. Expected "string".',
            property: '#/SERVER_PLUGINS/0',
        },

        {
            message: 'Items did not match schema.',
            property: '#/SERVER_PLUGINS',
        },

        {
            message: 'Instance type "number" is invalid. Expected "string".',
            property: '#/SERVER_PLUGINS/1',
        },

        {
            message:
                'Property "SERVER_PLUGINS" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER_PLUGINS',
        },
    ]);
});

Deno.test(function testEnvironmentBooleanSuccess() {
    Deno.env.set('SERVER_EXPOSED', 'true');

    const errors = testEnvironment(SCHEMA_BOOLEAN);

    assertEquals(errors, undefined);
});

Deno.test(function testEnvironmentNumberSuccess() {
    Deno.env.set('SERVER_PORT', '9090');

    const errors = testEnvironment(SCHEMA_NUMBER);

    assertEquals(errors, undefined);
});

Deno.test(function testEnvironmentNumberFailure() {
    Deno.env.set('SERVER_PORT', '42');

    const errors = testEnvironment(SCHEMA_NUMBER);

    assertInstanceOf(errors, Array);

    assertEquals(errors, [
        {
            message: 'Property "SERVER_PORT" does not match schema.',
            property: '#',
        },

        {
            message: '42 is less than 1024.',
            property: '#/SERVER_PORT',
        },

        {
            message:
                'Property "SERVER_PORT" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER_PORT',
        },
    ]);
});

Deno.test(function testEnvironmentObjectSuccess() {
    Deno.env.set(
        'SERVER',
        'exposed: true, name: "RPC Server", port: 9090',
    );

    const errors = testEnvironment(SCHEMA_OBJECT);

    assertEquals(errors, undefined);
});

Deno.test(function testEnvironmentObjectFailure() {
    Deno.env.set(
        'SERVER',
        'exposed: false, name: "", port: 42',
    );

    const errors = testEnvironment(SCHEMA_OBJECT);

    assertInstanceOf(errors, Array);

    assertEquals(errors, [
        {
            message: 'Property "SERVER" does not match schema.',
            property: '#',
        },

        {
            message: 'Property "name" does not match schema.',
            property: '#/SERVER',
        },

        {
            message: 'String is too short (0 < 1).',
            property: '#/SERVER/name',
        },

        {
            message: 'Property "port" does not match schema.',
            property: '#/SERVER',
        },

        {
            message: '42 is less than 1024.',
            property: '#/SERVER/port',
        },

        {
            message:
                'Property "name" does not match additional properties schema.',
            property: '#/SERVER',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER/name',
        },

        {
            message:
                'Property "port" does not match additional properties schema.',
            property: '#/SERVER',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER/port',
        },

        {
            message:
                'Property "SERVER" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER',
        },
    ]);
});

Deno.test(function testEnvironmentStringSuccess() {
    Deno.env.set('SERVER_NAME', 'RPC Server');

    const errors = testEnvironment(SCHEMA_STRING);

    assertEquals(errors, undefined);
});

Deno.test(function testEnvironmentStringFailure() {
    Deno.env.set('SERVER_NAME', '');

    const errors = testEnvironment(SCHEMA_STRING);

    assertEquals(errors, [
        {
            message: 'Property "SERVER_NAME" does not match schema.',
            property: '#',
        },

        {
            message: 'String is too short (0 < 1).',
            property: '#/SERVER_NAME',
        },

        {
            message:
                'Property "SERVER_NAME" does not match additional properties schema.',
            property: '#',
        },

        {
            message: 'False boolean schema.',
            property: '#/SERVER_NAME',
        },
    ]);
});

Deno.test(async function validateDotenvArraySuccess() {
    const promise = validateDotenv<ArrayType>(SCHEMA_ARRAY, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const env = await promise;

    assertTypeOf(env, 'object');
    assertInstanceOf(env.SERVER_PLUGINS, Array);

    assertTypeOf(env.SERVER_PLUGINS![0], 'string');
    assertTypeOf(env.SERVER_PLUGINS![1], 'string');

    assertEquals(env.SERVER_PLUGINS, ['compression', 'static-files']);
});

Deno.test(async function validateDotenvArrayFailure() {
    await assertRejects(
        async () => {
            await validateDotenv<ArrayType>(SCHEMA_ARRAY, {
                'envPath': './environment/test/.bad.env',
            });
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER_PLUGINS" does not match schema.
#/SERVER_PLUGINS: Items did not match schema.
#/SERVER_PLUGINS/0: Instance type "number" is invalid. Expected "string".
#/SERVER_PLUGINS: Items did not match schema.
#/SERVER_PLUGINS/1: Instance type "number" is invalid. Expected "string".
#: Property "SERVER_PLUGINS" does not match additional properties schema.
#/SERVER_PLUGINS: False boolean schema.`,
    );
});

Deno.test(async function validateDotenvBooleanSuccess() {
    const promise = validateDotenv<BooleanType>(SCHEMA_BOOLEAN, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const env = await promise;

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER_EXPOSED, 'boolean');

    assertEquals(env.SERVER_EXPOSED, true);
});

Deno.test(async function validateDotenvNumberSuccess() {
    const promise = validateDotenv<NumberType>(SCHEMA_NUMBER, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const env = await promise;

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER_PORT, 'number');

    assertEquals(env.SERVER_PORT, 9090);
});

Deno.test(async function validateDotenvNumberFailure() {
    await assertRejects(
        async () => {
            await validateDotenv<NumberType>(SCHEMA_NUMBER, {
                'envPath': './environment/test/.bad.env',
            });
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER_PORT" does not match schema.
#/SERVER_PORT: 42 is less than 1024.
#: Property "SERVER_PORT" does not match additional properties schema.
#/SERVER_PORT: False boolean schema.`,
    );
});

Deno.test(async function validateDotenvObjectSuccess() {
    const promise = validateDotenv<ObjectType>(SCHEMA_OBJECT, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const env = await promise;

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER, 'object');

    assertTypeOf(env.SERVER!.exposed, 'boolean');
    assertTypeOf(env.SERVER!.name, 'string');
    assertTypeOf(env.SERVER!.port, 'number');

    assertEquals(env.SERVER, {
        exposed: true,
        name: 'RPC Server',
        port: 9090,
    });
});

Deno.test(async function validateDotenvObjectFailure() {
    await assertRejects(
        async () => {
            await validateDotenv<ObjectType>(SCHEMA_OBJECT, {
                'envPath': './environment/test/.bad.env',
            });
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER" does not match schema.
#/SERVER: Property "name" does not match schema.
#/SERVER/name: String is too short (0 < 1).
#/SERVER: Property "port" does not match schema.
#/SERVER/port: 42 is less than 1024.
#/SERVER: Property "name" does not match additional properties schema.
#/SERVER/name: False boolean schema.
#/SERVER: Property "port" does not match additional properties schema.
#/SERVER/port: False boolean schema.
#: Property "SERVER" does not match additional properties schema.
#/SERVER: False boolean schema.`,
    );
});

Deno.test(async function validateDotenvStringSuccess() {
    const promise = validateDotenv<StringType>(SCHEMA_STRING, {
        'envPath': './environment/test/.good.env',
    });

    assertInstanceOf(promise, Promise);

    const env = await promise;

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER_NAME, 'string');

    assertEquals(env.SERVER_NAME, 'RPC Server');
});

Deno.test(async function validateDotenvStringFailure() {
    await assertRejects(
        async () => {
            await validateDotenv<StringType>(SCHEMA_STRING, {
                'envPath': './environment/test/.bad.env',
            });
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER_NAME" does not match schema.
#/SERVER_NAME: String is too short (0 < 1).
#: Property "SERVER_NAME" does not match additional properties schema.
#/SERVER_NAME: False boolean schema.`,
    );
});

Deno.test(function validateEnvironmentUndefined() {
    Deno.env.delete('SERVER_EXPOSED');

    const env = validateEnvironment<BooleanType>(SCHEMA_BOOLEAN);

    assertEquals(env.SERVER_EXPOSED, undefined);
});

Deno.test(function validateEnvironmentArraySuccess() {
    Deno.env.set('SERVER_PLUGINS', '"compression", "static-files"');

    const env = validateEnvironment<ArrayType>(SCHEMA_ARRAY);

    assertTypeOf(env, 'object');
    assertInstanceOf(env.SERVER_PLUGINS, Array);

    assertTypeOf(env.SERVER_PLUGINS![0], 'string');
    assertTypeOf(env.SERVER_PLUGINS![1], 'string');

    assertEquals(env.SERVER_PLUGINS, ['compression', 'static-files']);
});

Deno.test(function validateEnvironmentArrayFailure() {
    Deno.env.set('SERVER_PLUGINS', '4, 2');

    assertThrows(
        () => {
            validateEnvironment<ArrayType>(SCHEMA_ARRAY);
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER_PLUGINS" does not match schema.
#/SERVER_PLUGINS: Items did not match schema.
#/SERVER_PLUGINS/0: Instance type "number" is invalid. Expected "string".
#/SERVER_PLUGINS: Items did not match schema.
#/SERVER_PLUGINS/1: Instance type "number" is invalid. Expected "string".
#: Property "SERVER_PLUGINS" does not match additional properties schema.
#/SERVER_PLUGINS: False boolean schema.`,
    );
});

Deno.test(function validateEnvironmentBooleanSuccess() {
    Deno.env.set('SERVER_EXPOSED', 'true');

    const env = validateEnvironment<BooleanType>(SCHEMA_BOOLEAN);

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER_EXPOSED, 'boolean');

    assertEquals(env.SERVER_EXPOSED, true);
});

Deno.test(function validateEnvironmentNumberSuccess() {
    Deno.env.set('SERVER_PORT', '9090');

    const env = validateEnvironment<NumberType>(SCHEMA_NUMBER);

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER_PORT, 'number');

    assertEquals(env.SERVER_PORT, 9090);
});

Deno.test(function validateEnvironmentNumberFailure() {
    Deno.env.set('SERVER_PORT', '42');

    assertThrows(
        () => {
            validateEnvironment<NumberType>(SCHEMA_NUMBER);
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER_PORT" does not match schema.
#/SERVER_PORT: 42 is less than 1024.
#: Property "SERVER_PORT" does not match additional properties schema.
#/SERVER_PORT: False boolean schema.`,
    );
});

Deno.test(function validateEnvironmentObjectSuccess() {
    Deno.env.set(
        'SERVER',
        'exposed: true, name: "RPC Server", port: 9090',
    );

    const env = validateEnvironment<ObjectType>(SCHEMA_OBJECT);

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER, 'object');

    assertTypeOf(env.SERVER!.exposed, 'boolean');
    assertTypeOf(env.SERVER!.name, 'string');
    assertTypeOf(env.SERVER!.port, 'number');

    assertEquals(env.SERVER, {
        exposed: true,
        name: 'RPC Server',
        port: 9090,
    });
});

Deno.test(function validateEnvironmentObjectFailure() {
    Deno.env.set(
        'SERVER',
        'exposed: false, name: "", port: 42',
    );

    assertThrows(
        () => {
            validateEnvironment<ObjectType>(SCHEMA_OBJECT);
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER" does not match schema.
#/SERVER: Property "name" does not match schema.
#/SERVER/name: String is too short (0 < 1).
#/SERVER: Property "port" does not match schema.
#/SERVER/port: 42 is less than 1024.
#/SERVER: Property "name" does not match additional properties schema.
#/SERVER/name: False boolean schema.
#/SERVER: Property "port" does not match additional properties schema.
#/SERVER/port: False boolean schema.
#: Property "SERVER" does not match additional properties schema.
#/SERVER: False boolean schema.`,
    );
});

Deno.test(function validateEnvironmentStringSuccess() {
    Deno.env.set('SERVER_NAME', 'RPC Server');

    const env = validateEnvironment<StringType>(SCHEMA_STRING);

    assertTypeOf(env, 'object');
    assertTypeOf(env.SERVER_NAME, 'string');

    assertEquals(env.SERVER_NAME, 'RPC Server');
});

Deno.test(function validateEnvironmentStringFailure() {
    Deno.env.set('SERVER_NAME', '');

    assertThrows(
        () => {
            validateEnvironment<StringType>(SCHEMA_STRING);
        },
        ValidationError,
        `bad environment variables to 'validate' (environment variables failed to validate against JSON Schema):

#: Property "SERVER_NAME" does not match schema.
#/SERVER_NAME: String is too short (0 < 1).
#: Property "SERVER_NAME" does not match additional properties schema.
#/SERVER_NAME: False boolean schema.`,
    );
});
