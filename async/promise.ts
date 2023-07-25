/**
 * Returns type wrapped in a `Promise` if not already a `Promise`-wrapped value.
 *
 * @example
 * ```typescript
 * import type { Promisify } from 'https://deno.land/x/enzastdlib/async/mod.ts';
 *
 * function plainFunction(): number {
 *     return 1;
 * }
 *
 * type plainFunctionReturn = ReturnType<typeof plainFunction>; // `number`
 *
 * type plainFunctionReturnPromisified = Promisify<plainFunctionReturn>; // `Promise<number>`
 * ```
 */
export type Promisify<Value> = Value extends Promise<unknown> ? Value
	: Promise<Value>;

/**
 * Returns a `Promise` instance along with its resolve and reject functions.
 *
 * @returns
 *
 * @example
 * ```typescript
 * import {
 *     assertEquals,
 *     assertInstanceOf,
 * } from 'https://deno.land/std/testing/asserts.ts';
 * import { makePromise } from 'https://deno.land/x/enzastdlib/async/mod.ts';
 * import { assertTypeOf } from 'https://deno.land/x/enzastdlib/testing/mod.ts';
 *
 * const { promise, resolve, reject } = makePromise<number>();
 *
 * assertInstanceOf(promise, Promise);
 *
 * assertTypeOf(resolve, 'function');
 * assertTypeOf(reject, 'function');
 *
 * resolve(42);
 *
 * assertEquals(await promise, 42);
 * ```
 */
export function makePromise<Value = void>(): {
	promise: Promise<Value>;
	resolve: (value: Value) => void;
	reject: (reason?: unknown) => void;
} {
	let resolve: (value: Value) => void;
	let reject: (reason?: unknown) => void;

	const promise = new Promise<Value>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});

	return {
		resolve: resolve!,
		reject: reject!,
		promise,
	};
}
