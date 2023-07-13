import type { FunctionBox } from './function.ts';

/**
 * Represents an object of methods that handles metadata on functions.
 */
export interface Decorator<
	Func extends FunctionBox,
	Value,
> {
	get(func: Func): Value | undefined;

	has(func: Func): boolean;

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
 * Returns a `Decorator` instance that provides for handling namespaced
 * metadata on functions.
 *
 * @param func
 * @returns
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
