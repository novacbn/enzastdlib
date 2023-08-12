import {
    assertEquals,
    assertInstanceOf,
} from '../../vendor/@deno-std-testing.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import { EXIT_CODES, makeApplication, schema } from '../mod.ts';

import { collectFlags, extractCommand } from '../flags.ts';

import type { ArrayArgumentType, ArrayOptionsType } from './array.schema.ts';
import { SCHEMA_ARGUMENT_ARRAY, SCHEMA_OPTIONS_ARRAY } from './array.schema.ts';
import type {
    BooleanArgumentType,
    BooleanOptionsType,
} from './boolean.schema.ts';
import {
    SCHEMA_ARGUMENT_BOOLEAN,
    SCHEMA_OPTIONS_BOOLEAN,
} from './boolean.schema.ts';
import type { NumberArgumentType, NumberOptionsType } from './number.schema.ts';
import {
    SCHEMA_ARGUMENT_NUMBER,
    SCHEMA_OPTIONS_NUMBER,
} from './number.schema.ts';
import type { ObjectArgumentType, ObjectOptionsType } from './object.schema.ts';
import {
    SCHEMA_ARGUMENT_OBJECT,
    SCHEMA_OPTIONS_OBJECT,
} from './object.schema.ts';
import type { StringArgumentType, StringOptionsType } from './string.schema.ts';
import {
    SCHEMA_ARGUMENT_STRING,
    SCHEMA_OPTIONS_STRING,
} from './string.schema.ts';

/** INTERNAL FUNCTIONALITY */

Deno.test(function collectFlagsNormal() {
    const argv = ['--width', '512', '--height', '256', './output.png'];

    assertEquals(
        collectFlags(argv),
        {
            width: '512',
            height: '256',
            _: './output.png',
        },
    );
});

Deno.test(function collectFlagsFlagJoin() {
    const argv = ['--files', './a.png', '--files', './b.png'];

    assertEquals(
        collectFlags(argv),
        {
            files: './a.png ./b.png',
        },
    );
});

Deno.test(function collectFlagsFlagSkip() {
    const argv = ['--width', '--height', '256'];

    assertEquals(
        collectFlags(argv),
        {
            height: '256',
        },
    );
});

Deno.test(function collectFlagsRestJoin() {
    const argv = ['./a.png', '--height', '256', './b.png'];

    assertEquals(
        collectFlags(argv),
        {
            height: '256',
            _: './a.png ./b.png',
        },
    );
});

Deno.test(function extractCommandNormal() {
    const argv = ['compress', '--input', './a.png', '--output', './a.zip'];

    assertEquals(
        extractCommand(argv),
        {
            args: ['--input', './a.png', '--output', './a.zip'],
            command: 'compress',
        },
    );
});

Deno.test(function extractCommandDelayed() {
    const argv = ['--input', 'compress', './a.png', '--output', './a.zip'];

    assertEquals(
        extractCommand(argv),
        {
            args: ['--input', './a.png', '--output', './a.zip'],
            command: 'compress',
        },
    );
});

/** EXPORTED FUNCTIONALITY */

Deno.test(async function handleArgsArgumentFailureUndefined() {
    schema(booleanCommand, SCHEMA_ARGUMENT_BOOLEAN);
    function booleanCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { booleanCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'booleanCommand',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsOptionsFailureUndefined() {
    schema(booleanCommand, SCHEMA_OPTIONS_BOOLEAN);
    function booleanCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { booleanCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'booleanCommand',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsArrayArgumentSuccess() {
    schema(arrayCommand, SCHEMA_ARGUMENT_ARRAY);
    function arrayCommand(options: ArrayArgumentType): void {
        assertTypeOf(options, 'object');
        assertInstanceOf(options._, Array);

        assertTypeOf(options._[0], 'string');
        assertTypeOf(options._[1], 'string');

        assertEquals(options, {
            _: ['compression', 'static-files'],
        });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { arrayCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'arrayCommand',
        '"compression", "static-files"',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsArrayArgumentFailure() {
    schema(arrayCommand, SCHEMA_ARGUMENT_ARRAY);
    function arrayCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { arrayCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'arrayCommand',
        '4, 2',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsArrayOptionsSuccess() {
    schema(arrayCommand, SCHEMA_OPTIONS_ARRAY);
    function arrayCommand(options: ArrayOptionsType): void {
        assertTypeOf(options, 'object');
        assertInstanceOf(options.plugins, Array);

        assertTypeOf(options.plugins[0], 'string');
        assertTypeOf(options.plugins[1], 'string');

        assertEquals(options, {
            plugins: ['compression', 'static-files'],
        });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { arrayCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'arrayCommand',
        '--plugins',
        '"compression", "static-files"',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsArrayOptionsFailure() {
    schema(arrayCommand, SCHEMA_OPTIONS_ARRAY);
    function arrayCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { arrayCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'arrayCommand',
        '--plugins',
        '4, 2',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsBooleanArgumentSuccess() {
    schema(booleanCommand, SCHEMA_ARGUMENT_BOOLEAN);
    function booleanCommand(options: BooleanArgumentType): void {
        assertTypeOf(options, 'object');
        assertTypeOf(options._, 'boolean');

        assertEquals(options, { _: true });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { booleanCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'booleanCommand',
        'true',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsBooleanOptionsSuccess() {
    schema(booleanCommand, SCHEMA_OPTIONS_BOOLEAN);
    function booleanCommand(options: BooleanOptionsType): void {
        assertTypeOf(options, 'object');
        assertTypeOf(options.exposed, 'boolean');

        assertEquals(options, { exposed: true });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { booleanCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'booleanCommand',
        '--exposed',
        'true',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsNumberArgumentSuccess() {
    schema(numberCommand, SCHEMA_ARGUMENT_NUMBER);
    function numberCommand(options: NumberArgumentType): void {
        assertTypeOf(options, 'object');
        assertTypeOf(options._, 'number');

        assertEquals(options, { _: 9090 });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { numberCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'numberCommand',
        '9090',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsNumberArgumentFailure() {
    schema(numberCommand, SCHEMA_ARGUMENT_NUMBER);
    function numberCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { numberCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'numberCommand',
        '42',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsNumberOptionsSuccess() {
    schema(numberCommand, SCHEMA_OPTIONS_NUMBER);
    function numberCommand(options: NumberOptionsType): void {
        assertTypeOf(options, 'object');
        assertTypeOf(options.port, 'number');

        assertEquals(options, { port: 9090 });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { numberCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'numberCommand',
        '--port',
        '9090',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsNumberOptionsFailure() {
    schema(numberCommand, SCHEMA_OPTIONS_NUMBER);
    function numberCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { numberCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'numberCommand',
        '--port',
        '42',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsObjectArgumentSuccess() {
    schema(objectCommand, SCHEMA_ARGUMENT_OBJECT);
    function objectCommand(options: ObjectArgumentType): void {
        assertTypeOf(options._.exposed, 'boolean');
        assertTypeOf(options._.name, 'string');
        assertTypeOf(options._.port, 'number');

        assertEquals(options, {
            _: {
                exposed: true,
                name: 'RPC Server',
                port: 9090,
            },
        });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { objectCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'objectCommand',
        'exposed: true, name: "RPC Server", port: 9090',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsObjectArgumentFailure() {
    schema(objectCommand, SCHEMA_ARGUMENT_OBJECT);
    function objectCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { objectCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'objectCommand',
        'exposed: false, name: "", port: 42',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsObjectOptionsSuccess() {
    schema(objectCommand, SCHEMA_OPTIONS_OBJECT);
    function objectCommand(options: ObjectOptionsType): void {
        assertTypeOf(options, 'object');
        assertTypeOf(options.server, 'object');

        assertTypeOf(options.server.exposed, 'boolean');
        assertTypeOf(options.server.name, 'string');
        assertTypeOf(options.server.port, 'number');

        assertEquals(options, {
            server: {
                exposed: true,
                name: 'RPC Server',
                port: 9090,
            },
        });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { objectCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'objectCommand',
        '--server',
        'exposed: true, name: "RPC Server", port: 9090',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsObjectOptionsFailure() {
    schema(objectCommand, SCHEMA_OPTIONS_OBJECT);
    function objectCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { objectCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'objectCommand',
        '--name',
        'exposed: false, name: "", port: 42',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsStringArgumentSuccess() {
    schema(stringCommand, SCHEMA_ARGUMENT_STRING);
    function stringCommand(options: StringArgumentType): void {
        assertTypeOf(options, 'object');
        assertTypeOf(options._, 'string');

        assertEquals(options, { _: 'RPC Server' });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { stringCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'stringCommand',
        'RPC Server',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsStringArgumentFailure() {
    schema(stringCommand, SCHEMA_ARGUMENT_STRING);
    function stringCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { stringCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'stringCommand',
        '',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});

Deno.test(async function handleArgsStringOptionsSuccess() {
    schema(stringCommand, SCHEMA_OPTIONS_STRING);
    function stringCommand(options: StringOptionsType): void {
        assertTypeOf(options, 'object');
        assertTypeOf(options.name, 'string');

        assertEquals(options, { name: 'RPC Server' });
    }

    const commands = makeApplication({
        name: 'rpcd',
        commands: { stringCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'stringCommand',
        '--name',
        'RPC Server',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.resolved);
});

Deno.test(async function handleArgsStringOptionsFailure() {
    schema(stringCommand, SCHEMA_OPTIONS_STRING);
    function stringCommand(): void {}

    const commands = makeApplication({
        name: 'rpcd',
        commands: { stringCommand },
    });

    assertTypeOf(commands, 'object');
    assertTypeOf(commands.handleArgs, 'function');

    const exit_code = await commands.handleArgs([
        'stringCommand',
        '--name',
        '',
    ]);

    assertTypeOf(exit_code, 'number');
    assertEquals(exit_code, EXIT_CODES.malformed_flags);
});
