import type { ValueOf } from '../collections/mod.ts';

export type JSON5Types =
	| boolean
	| null
	| number
	| string
	| JSON5Array
	| JSON5Object;

export type JSON5Array = JSON5Types[];

export type JSON5Object = { [index: string]: JSON5Types | undefined };

export const JSON5_TYPE_NAMES = {
	array: 'array',

	boolean: 'boolean',

	null: 'null',

	number: 'number',

	string: 'string',

	object: 'object',
} as const;

export type JSON5TypeNames = ValueOf<typeof JSON5_TYPE_NAMES>;
