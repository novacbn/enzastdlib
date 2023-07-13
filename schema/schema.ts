import type { FromSchema } from '../vendor/@ThomasAribart-json-schema-to-ts.ts';

import type {
	JSONSchema as JSONSchema201909,
	TypeName,
} from '../vendor/@jrylan-json-schema-typed.ts';

export type JSONSchemaArray = JSONSchema201909.Array;

export type JSONSchemaBoolean = JSONSchema201909.Boolean;

export type JSONSchemaNull = JSONSchema201909.Null;

export type JSONSchemaNumber = JSONSchema201909.Number;

export type JSONSchemaObject = JSONSchema201909.Object;

export type JSONSchemaString = JSONSchema201909.String;

export type JSONSchema =
	| JSONSchemaArray
	| JSONSchemaBoolean
	| JSONSchemaNull
	| JSONSchemaNumber
	| JSONSchemaObject
	| JSONSchemaString;

export type JSONSchemaTypes = `${TypeName}`;

export type typeofschema<Schema extends JSONSchema> = FromSchema<
	// @ts-ignore - HACK: They're both draft 2019-09 based, they just have mismatched types.
	Schema
>;
