import {
    assertEquals,
    assertInstanceOf,
} from '../../vendor/@deno-std-testing.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import { makeDecorator } from '../decorator.ts';

Deno.test(function makeDecoratorSuccess() {
    const decorator = makeDecorator<number>((func, init) => {
        assertInstanceOf(func, Function);
        assertTypeOf(init, 'number');

        // HACK: We get a type error for whatever reason if we directly
        // reference `decorator.set` for a `assertInstanceOf` call.
        assertTypeOf(decorator.set, 'function');
        decorator.set(func, init);
    });

    assertInstanceOf(decorator, Function);

    decorator(testFunc, 42);
    function testFunc() {}

    assertInstanceOf(decorator.has, Function);
    const has_value = decorator.has(testFunc);

    assertTypeOf(has_value, 'boolean');
    assertEquals(has_value, true);

    assertInstanceOf(decorator.get, Function);
    const number = decorator.get(testFunc);

    assertTypeOf(number, 'number');
    assertEquals(number, 42);
});
