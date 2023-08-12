import {
    assertEquals,
    assertInstanceOf,
} from '../../vendor/@deno-std-testing.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import type { add } from './testdata/add.ts';

import { bundleEntryPoint, evaluateModule, makeRealm } from '../mod.ts';

/** TODO: cwd escape */

/** EXPORTED FUNCTIONALITY */

type AddExports = { add: typeof add };

Deno.test(async function bundleEntryPointJavaScriptSuccess() {
    const promise = bundleEntryPoint('./realm/test/testdata/add.js');
    assertInstanceOf(promise, Promise);

    const code = await promise;
    assertTypeOf(code, 'string');

    assertEquals(
        code,
        `function add(a, b) {
    return a + b;
}
return {
    add: add
};`,
    );
});

Deno.test(async function bundleEntryPointTypeScriptSuccess() {
    const promise = bundleEntryPoint('./realm/test/testdata/add.ts');
    assertInstanceOf(promise, Promise);

    const code = await promise;
    assertTypeOf(code, 'string');

    assertEquals(
        code,
        `function add(a, b) {
    return a + b;
}
return {
    add: add
};`,
    );
});

Deno.test(async function bundleEntryPointAbsoluteImportSuccess() {
    const promise = bundleEntryPoint(
        './absolute_import.js',
        './realm/test/testdata',
    );
    assertInstanceOf(promise, Promise);

    const code = await promise;
    assertTypeOf(code, 'string');

    assertEquals(
        code,
        `function add(a, b) {
    return a + b;
}
return {
    add: add
};`,
    );
});

Deno.test(async function bundleEntryPointUpImportSuccess() {
    const promise = bundleEntryPoint(
        './subdirectory/up_import.js',
        './realm/test/testdata',
    );
    assertInstanceOf(promise, Promise);

    const code = await promise;
    assertTypeOf(code, 'string');

    assertEquals(
        code,
        `function add(a, b) {
    return a + b;
}
return {
    add: add
};`,
    );
});

Deno.test(async function bundleEntryPointSubImportSuccess() {
    const promise = bundleEntryPoint('./realm/test/testdata/sub_import.js');
    assertInstanceOf(promise, Promise);

    const code = await promise;
    assertTypeOf(code, 'string');

    assertEquals(
        code,
        `function add(a, b) {
    return a + b;
}
return {
    add: add
};`,
    );
});

Deno.test(async function bundleEntryPointExtensionFailure() {
    try {
        await bundleEntryPoint('./realm/test/testdata/invalid_extension.tsx');
    } catch (err) {
        // HACK: `assertThrows` does not support asynchronous exceptions,
        // so we need to manually write a try-catch.

        assertInstanceOf(err, Deno.errors.NotSupported);

        assertEquals(
            err.message,
            'bad argument #0 to \'bundleEntryPoint\' (specifier \'invalid_extension.tsx\' has an invalid extension)',
        );
    }
});

Deno.test(async function bundleEntryPointNotFoundFailure() {
    try {
        await bundleEntryPoint('./realm/test/testdata/not_found.js');
    } catch (err) {
        // HACK: `assertThrows` does not support asynchronous exceptions,
        // so we need to manually write a try-catch.

        assertInstanceOf(err, Deno.errors.NotFound);

        assertEquals(
            err.message,
            'bad argument #0 to \'bundleEntryPoint\' (specifier \'not_found.js\' does not exist or not readable)',
        );
    }
});

/*
TODO: The `emit` package fails during this test with a non-sensical error. So we have to
follow up on it with a custom `load` function... which is currently undocumented usage-wise?

Deno.test(async function bundleEntryPointImportCWDEscapeFailure() {
	try {
		await bundleEntryPoint('./realm/test/testdata/cwd_escape_import.js');
	} catch (err) {
		// HACK: `assertThrows` does not support asynchronous exceptions,
		// so we need to manually write a try-catch.

		console.error(err);

		assertInstanceOf(err, Deno.errors.NotFound);

		assertEquals(
			err.message,
			'bad argument #0 to \'bundleEntryPoint\' (specifier \'testdata/not_found.js\' does not exist or not readable)',
		);
	}
});
*/

Deno.test(async function evaluateModuleSuccess() {
    const promise = evaluateModule<{ myVar: string }>(
        'return { myVar: hello };',
        {
            globalThis: {
                hello: 'world',
            },
        },
    );

    assertInstanceOf(promise, Promise);

    const exports = await promise;

    assertTypeOf(exports, 'object');
    assertTypeOf(exports.myVar, 'string');

    assertEquals(exports.myVar, 'world');
});

Deno.test(async function makeRealmImportModuleSuccess() {
    const realm = makeRealm({
        cwd: './realm/test/testdata',
    });

    assertTypeOf(realm, 'object');
    assertTypeOf(realm.importModule, 'function');

    const promise = realm.importModule<AddExports>(
        './add.js',
    );

    assertInstanceOf(promise, Promise);

    const exports = await promise;

    assertTypeOf(exports, 'object');
    assertTypeOf(exports.add, 'function');

    assertEquals(
        exports.add(1, 2),
        3,
    );
});
