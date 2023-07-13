import { assertEquals } from '../../vendor/@deno-std-testing.ts';

import { assertTypeOf } from '../../testing/mod.ts';

import type { Procedure, Response } from '../mod.ts';
import {
	middlewares,
	parametersschema,
	PAYLOAD_TYPES,
	PROTOCOL_VERSION,
	resultschema,
} from '../mod.ts';

import type { AddParametersType, AddReturnType } from './add.schema.ts';
import { SCHEMA_ADD_PARAMETERS, SCHEMA_ADD_RETURN } from './add.schema.ts';

parametersschema(add, SCHEMA_ADD_PARAMETERS);
resultschema(add, SCHEMA_ADD_RETURN);
export function add(
	_payload: Procedure,
	parameters: AddParametersType,
): AddReturnType {
	assertTypeOf(parameters, 'object');

	const { a, b } = parameters;

	assertTypeOf(a, 'number');
	assertEquals(a, 2);

	assertTypeOf(b, 'number');
	assertEquals(b, 1);

	return {
		sum: a + b,
	};
}

middlewares(addMultiplied, [
	(payload, procedure) => {
		const { sum } = (procedure as typeof addMultiplied)(
			payload as Procedure,
			payload.parameters as AddParametersType,
		);

		return {
			enzastdlib: PROTOCOL_VERSION,
			type: PAYLOAD_TYPES.response,
			id: (payload as Procedure).id,

			result: {
				sum: sum * 2,
			},
		} satisfies Response;
	},
]);
parametersschema(addMultiplied, SCHEMA_ADD_PARAMETERS);
resultschema(addMultiplied, SCHEMA_ADD_RETURN);
export function addMultiplied(
	_payload: Procedure,
	parameters: AddParametersType,
): AddReturnType {
	assertTypeOf(parameters, 'object');

	const { a, b } = parameters;

	assertTypeOf(a, 'number');
	assertEquals(a, 2);

	assertTypeOf(b, 'number');
	assertEquals(b, 1);

	return {
		sum: a + b,
	};
}
