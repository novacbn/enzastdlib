/**
 * Represents an `Object` type that has no properties.
 *
 * @example
 *
 * ```typescript
 * import type { EmptyObject } from 'https://deno.land/x/enzastdlib/collections/mod.ts';
 *
 * type X = EmptyObject; // `{ [x: string]: never; [x: number]: never; [x: symbol]: never }`
 * ```
 */
export type EmptyObject = Record<PropertyKey, never>;

/**
 * Returns an `Object` where members with the given type are picked into a new `Object` type.
 *
 * @example
 *
 * ```typescript
 * import type { PickValues } from 'https://deno.land/x/enzastdlib/collections/mod.ts';
 *
 * const MY_CONSTANT_OBJECT = {
 *     myBoolean: false,
 *
 *     myNumber: 42,
 *
 *     myString: 'Hello World',
 *
 *     otherNumber: 84,
 * } as const;
 *
 * type FilteredValues = PickValues<typeof MY_CONSTANT_OBJECT, number>; // `{ readonly myNumber: 42; readonly otherNumber: 84; }`
 */
export type PickValues<Obj, Value> = {
	[Key in keyof Obj as Obj[Key] extends Value ? Key : never]: Obj[Key];
};

/**
 * Returns an `Object` where members with the given type are omitted from a new `Object` type.
 *
 * @example
 *
 * ```typescript
 * import type { OmitValues } from 'https://deno.land/x/enzastdlib/collections/mod.ts';
 *
 * const MY_CONSTANT_OBJECT = {
 *     myBoolean: false,
 *
 *     myNumber: 42,
 *
 *     myString: 'Hello World',
 *
 *     otherNumber: 84,
 * } as const;
 *
 * type FilteredValues = OmitValues<typeof MY_CONSTANT_OBJECT, number>; // `{ readonly myBoolean: false; readonly myString: "Hello World"; }`
 */
export type OmitValues<Obj, Value> = {
	[Key in keyof Obj as Obj[Key] extends Value ? never : Key]: Obj[Key];
};

/**
 * Returns all the values of an `Object` as a type union of its values.
 *
 * @example
 *
 * ```typescript
 * import type { ValueOf } from 'https://deno.land/x/enzastdlib/collections/mod.ts';
 *
 * const MY_CONSTANT_OBJECT = {
 *     x: 1,
 * 	   y: 2,
 *     z: 3
 * } as const;
 *
 * type MyValues = ValueOf<typeof MY_CONSTANT_OBJECT>; // `1 | 2 | 3`
 * ```
 */
export type ValueOf<Obj> = Obj[keyof Obj];

/**
 * Represents an `Object` type that has unknown properties.
 *
 * @example
 *
 * ```typescript
 * import type { UnknownObject } from 'https://deno.land/x/enzastdlib/collections/mod.ts';
 *
 * type X = UnknownObject; // `{ [x: string]: unknown; [x: number]: unknown; [x: symbol]: unknown }`
 * ```
 */
export type UnknownObject = Record<PropertyKey, unknown>;
