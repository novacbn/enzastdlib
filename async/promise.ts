/**
 * Returns type wrapped in a `Promise` if not already a `Promise`-wrapped value.
 */
export type Promisify<Value> = Value extends Promise<unknown> ? Value
	: Promise<Value>;

/**
 * Returns a `Promise` instance along with its resolve and reject functions.
 *
 * @returns
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
