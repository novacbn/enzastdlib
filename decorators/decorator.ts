import type { FunctionBox } from './function.ts';

/**
 * Represents a decorator for accessing scoped metadata on functions made
 * by `makeDecorator`.
 */
export interface Decorator<
    Func extends FunctionBox,
    Value,
> {
    /**
     * Returns the metadata associated with the specified `func`, if any.
     *
     * @param func
     * @returns
     */
    get(func: Func): Value | undefined;

    /**
     * Returns if the specified `func` has any metadata associated with it.
     *
     * @param func
     * @returns
     */
    has(func: Func): boolean;

    /**
     * Sets the metadata associated with the specified `func` to the supplied `value`.
     *
     * @param func
     * @param value
     */
    set(func: Func, value: Value): void;
}

/**
 * Represents a callback that is used to initialize a decorator
 * on a function.
 */
export type DecoratorCallback<Func extends FunctionBox, Value> = (
    func: Func,
    init: Value,
) => void;

/**
 * Returns a `Decorator` instance that provides for handling scoped metadata
 * on functions.
 *
 * @param func
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { makeDecorator } from 'https://deno.land/x/enzastdlib/decorators/mod.ts';
 *
 * type MyDecoratorValue = number;
 *
 * const mydecorator = makeValidator<MyDecoratorValue>((func, value) => {
 *     // Our `Decorator` object provides simplified access to scoped metadata. So
 *     // we can use it to assign the initialization metadata to the function.
 *     mydecorator.set(func, value);
 * });
 *
 * // We are initializing the decorator onto our desired function with some metadata.
 * mydecorator(my_func, 42);
 * function my_func() {
 *     console.log('Hello World!');
 * }
 *
 * assertEquals(
 *     mydecorator.has(my_func),
 *     true,
 * );
 *
 * assertEquals(
 *     mydecorator.get(my_func),
 *     42,
 * );
 * ```
 */
export function makeDecorator<
    InputValue,
    Func extends FunctionBox = FunctionBox,
    CacheValue = InputValue,
>(
    func: DecoratorCallback<Func, InputValue>,
): DecoratorCallback<Func, InputValue> & Decorator<Func, CacheValue> {
    // NOTE: Since we are using a `Symbol` for metadata access then
    // we have less to worry about unintended access.
    //
    // Also by using the callback's source code (`.toString`) we have
    // an easily addressable lookup of the metadata.
    //
    // It was previously considered to just use the function's name,
    // but that could lead to unintended namespacing collision.
    const symbol = Symbol.for(
        `enzastdlib/decorators:makeDecorator/${func.toString()}`,
    );

    const decorator = {
        get: (func) =>
            // @ts-ignore - HACK: We are fetching untyped metadata anyway.
            func[symbol],

        has: (func) =>
            // @ts-ignore - HACK: We are accessing untyped metadata anyway.
            !!func[symbol],

        set: (func, value) =>
            // @ts-ignore - HACK: We are assigning untyped metadata anyway.
            func[symbol] = value,
    } satisfies Decorator<Func, InputValue>;

    Object.assign(func, decorator);
    // @ts-ignore - HACK: We are updating an existing function so of course this would not typecheck.
    return func;
}
