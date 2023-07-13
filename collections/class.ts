import { OmitValues, PickValues } from './object.ts';

/**
 * Returns an `Object` containing all the methods of a `Class`.
 */
export type MethodsOf<Cls> = PickValues<
	Cls,
	// HACK: We need to use an "any function" to catch all functions.
	// deno-lint-ignore ban-types
	Function
>;

/**
 * Returns an `Object` containing all the properties of a `Class`.
 */
export type PropertiesOf<Cls> = OmitValues<
	Cls,
	// HACK: We need to use an "any function" to catch all functions.
	// deno-lint-ignore ban-types
	Function
>;
