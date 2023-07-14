import { OmitValues, PickValues } from './object.ts';

/**
 * Returns an `Object` containing all the methods of a `Class`.
 *
 * @example
 *
 * ```typescript
 * import type { MethodsOf } from 'https://deno.land/x/enzastdlib/collections/mod.ts';
 *
 * class MyClass {
 *     myProperty = false;
 *
 *     methodOne(): number {
 * 	       return 42;
 *     }
 *
 *     methodTwo(): string {
 *         return "Hello World";
 *     }
 * }
 *
 * type MyMethods = MethodsOf<MyClass>; // `{ methodOne: () => number; methodTwo: () => string; }`
 * ```
 */
export type MethodsOf<Cls> = PickValues<
	Cls,
	// HACK: We need to use an "any function" to catch all functions.
	// deno-lint-ignore ban-types
	Function
>;

/**
 * Returns an `Object` containing all the properties of a `Class`.
 *
 * @example
 *
 * ```typescript
 * import type { PropertiesOf } from 'https://deno.land/x/enzastdlib/collections/mod.ts';
 *
 * class MyClass {
 *     myProperty = false;
 *
 *     methodOne(): number {
 * 	       return 42;
 *     }
 *
 *     methodTwo(): string {
 *         return "Hello World";
 *     }
 * }
 *
 * type MyProperties = PropertiesOf<MyClass>; // `{ myProperty: boolean; }`
 * ```
 */
export type PropertiesOf<Cls> = OmitValues<
	Cls,
	// HACK: We need to use an "any function" to catch all functions.
	// deno-lint-ignore ban-types
	Function
>;
