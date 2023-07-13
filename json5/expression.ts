import { parse } from '../vendor/@CesiumLabs-json5.ts';

import type {
	JSON5Array,
	JSON5Object,
	JSON5TypeNames,
	JSON5Types,
} from './types.ts';
import { JSON5_TYPE_NAMES } from './types.ts';

export function parseJSON5Expression(
	type: (typeof JSON5_TYPE_NAMES)['array'],
	expression: string,
): JSON5Array;
export function parseJSON5Expression(
	type: (typeof JSON5_TYPE_NAMES)['boolean'],
	expression: string,
): boolean;
export function parseJSON5Expression(
	type: (typeof JSON5_TYPE_NAMES)['null'],
	expression: string,
): null;
export function parseJSON5Expression(
	type: (typeof JSON5_TYPE_NAMES)['number'],
	expression: string,
): number;
export function parseJSON5Expression(
	type: (typeof JSON5_TYPE_NAMES)['object'],
	expression: string,
): JSON5Object;
export function parseJSON5Expression(
	type: (typeof JSON5_TYPE_NAMES)['string'],
	expression: string,
): string;
export function parseJSON5Expression(
	type: JSON5TypeNames,
	expression: string,
): JSON5Types {
	switch (type) {
		case JSON5_TYPE_NAMES.array:
			return parse(`[${expression}]`);

		case JSON5_TYPE_NAMES.boolean:
			if (expression === 'true') {
				return true;
			} else if (expression === 'false') {
				return false;
			}

			// HACK: We would need to implement a proper parser to provide
			// the column and line details... so let's just return the expression
			// back.

			throw SyntaxError(
				`JSON5: invalid expression '${expression}'`,
			);

		case JSON5_TYPE_NAMES.null:
			if (expression === 'null') {
				return null;
			}

			throw SyntaxError(
				`JSON5: invalid expression '${expression}'`,
			);

		case JSON5_TYPE_NAMES.number: {
			if (expression === 'NaN') {
				return NaN;
			} else if (expression === 'Infinity') {
				return Number.POSITIVE_INFINITY;
			} else if (expression === '-Infinity') {
				return Number.NEGATIVE_INFINITY;
			}

			const parsed = expression.includes('.')
				? parseFloat(expression)
				: parseInt(expression);

			if (isNaN(parsed)) {
				throw SyntaxError(
					`JSON5: invalid expression '${expression}'`,
				);
			}

			return parsed;
		}

		case JSON5_TYPE_NAMES.object:
			return parse(`{${expression}}`);

		case JSON5_TYPE_NAMES.string:
			return expression;
	}

	throw new TypeError(
		`bad argument #1 to 'parseJSON5Expression' (unsupported type '${type}')`,
	);
}
