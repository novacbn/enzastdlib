/**
 * Returns all values collected from the `iterable` in an array.
 *
 * > **NOTE**: This function is the equivilent of [`Array.fromAsync`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fromAsync)
 * > if it available in your runtime use that instead.
 *
 * @param iterable
 * @returns
 *
 * @example
 *
 * ```typescript
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 * import { arrayFromIterable } from "https://deno.land/x/enzastdlib/async/mod.ts";
 *
 * async function* myGenerator(): AsyncGenerator<number> {
 *     yield Promise.resolve(1);
 *     yield Promise.resolve(2);
 *     yield Promise.resolve(3);
 * }
 *
 * const generator = myGenerator();
 *
 * const numbers = await arrayFromIterable(generator);
 *
 * assertEquals(numbers, [1, 2, 3]);
 * ```
 */
export async function arrayFromIterable<Value>(
	iterable: AsyncIterable<Value>,
): Promise<Value[]> {
	const values = [];

	for await (const value of iterable) values.push(value);

	return values;
}
