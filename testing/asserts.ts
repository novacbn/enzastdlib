import { AssertionError } from '../vendor/@deno-std-testing.ts';

// TODO: Is there a way to automatically obtain this type since `typeof`
// not a function?

/**
 * Represents all the types returnable by the `typeof` operator.
 */
type BuiltinTypes =
	| 'bigint'
	| 'boolean'
	| 'function'
	| 'number'
	| 'object'
	| 'string'
	| 'symbol'
	| 'undefined';

/**
 * Make an assertion that `actual` has the type of `expected_type`.
 * If not then throw.
 */
export function assertTypeOf(
	actual: unknown,
	expected_type: BuiltinTypes,
	message = '',
): boolean {
	const actual_type = typeof actual;
	if (actual_type === expected_type) return true;

	const message_suffix = message ? `: ${message}` : '.';

	throw new AssertionError(
		`Expected actual: ${actual} to be of type ${expected_type} not to be: ${actual_type}${message_suffix}`,
	);
}
