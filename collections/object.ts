/**
 * Represents an `Object` that has no properties.
 */
export type EmptyObject = Record<PropertyKey, never>;

/**
 * Returns an `Object` where properties with `Type` as the their typing are omitted.
 */
export type PickValues<Obj, Value> = {
	[Key in keyof Obj as Obj[Key] extends Value ? Key : never]: Obj[Key];
};

/**
 * Returns an `Object` where properties with `Type` as the their typing are omitted.
 */
export type OmitValues<Obj, Value> = {
	[Key in keyof Obj as Obj[Key] extends Value ? never : Key]: Obj[Key];
};

/**
 * Returns all the values of an `Object` as a type union.
 */
export type ValueOf<Obj> = Obj[keyof Obj];

/**
 * Represents an `Object` that has unknown properties.
 */
export type UnknownObject = Record<PropertyKey, unknown>;
