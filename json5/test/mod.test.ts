import { assertEquals, assertThrows } from '../../vendor/@deno-std-testing.ts';

import { JSON5_TYPE_NAMES, parseJSON5Expression } from '../mod.ts';

/** EXPORTED FUNCTIONALITY */

Deno.test(function parseJSON5ExpressionArrayValid() {
    const parsed = parseJSON5Expression(
        JSON5_TYPE_NAMES.array,
        '"compression", "static-files"',
    );

    assertEquals(parsed, [
        'compression',
        'static-files',
    ]);
});

Deno.test(function parseJSON5ExpressionArraySyntaxError() {
    assertThrows(
        () => {
            parseJSON5Expression(JSON5_TYPE_NAMES.array, '[');
        },
        SyntaxError,
        'JSON5: invalid end of input at 1:4',
    );
});

Deno.test(function parseJSON5ExpressionBooleanTrue() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.boolean, 'true');

    assertEquals(parsed, true);
});

Deno.test(function parseJSON5ExpressionBooleanFalse() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.boolean, 'false');

    assertEquals(parsed, false);
});

Deno.test(function parseJSON5ExpressionBooleanSyntaxError() {
    assertThrows(
        () => {
            parseJSON5Expression(JSON5_TYPE_NAMES.boolean, 'HELLOWORLD!!!!!');
        },
        SyntaxError,
        'JSON5: invalid expression \'HELLOWORLD!!!!!\'',
    );
});

Deno.test(function parseJSON5ExpressionNullValid() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.null, 'null');

    assertEquals(parsed, null);
});

Deno.test(function parseJSON5ExpressionNullSyntaxError() {
    assertThrows(
        () => {
            parseJSON5Expression(JSON5_TYPE_NAMES.null, 'HELLOWORLD!!!!!');
        },
        SyntaxError,
        'JSON5: invalid expression \'HELLOWORLD!!!!!\'',
    );
});

Deno.test(function parseJSON5ExpressionNumberValid() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.number, '42');

    assertEquals(parsed, 42);
});

Deno.test(function parseJSON5ExpressionNumberHexadecimal() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.number, '0xdecaf');

    assertEquals(parsed, 0xdecaf);
});

Deno.test(function parseJSON5ExpressionNumberInfinityPositive() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.number, 'Infinity');

    assertEquals(parsed, Number.POSITIVE_INFINITY);
});

Deno.test(function parseJSON5ExpressionNumberInfinityNegative() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.number, '-Infinity');

    assertEquals(parsed, Number.NEGATIVE_INFINITY);
});

Deno.test(function parseJSON5ExpressionNumberNaN() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.number, 'NaN');

    assertEquals(parsed, NaN);
});

Deno.test(function parseJSON5ExpressionNumberSyntaxError() {
    assertThrows(
        () => {
            parseJSON5Expression(JSON5_TYPE_NAMES.number, 'HELLOWORLD!!!!!');
        },
        SyntaxError,
        'JSON5: invalid expression \'HELLOWORLD!!!!!\'',
    );
});

Deno.test(function parseJSON5ExpressionObjectValid() {
    const parsed = parseJSON5Expression(
        JSON5_TYPE_NAMES.object,
        `"exposed": true, name: "RPC Server", port: 9090`,
    );

    assertEquals(parsed, {
        exposed: true,
        name: 'RPC Server',
        port: 9090,
    });
});

Deno.test(function parseJSON5ExpressionObjectSyntaxError() {
    assertThrows(
        () => {
            parseJSON5Expression(JSON5_TYPE_NAMES.object, '{');
        },
        SyntaxError,
        'JSON5: invalid character \'{\' at 1:2',
    );
});

Deno.test(function parseJSON5ExpressionStringValid() {
    const parsed = parseJSON5Expression(JSON5_TYPE_NAMES.string, 'RPC Server');

    assertEquals(parsed, 'RPC Server');
});
