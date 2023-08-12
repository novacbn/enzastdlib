import { assertTypeOf } from '../../testing/mod.ts';

import { assertEquals } from '../../vendor/@deno-std-testing.ts';

import type { Procedure } from '../../rpc-protocol/mod.ts';
import { parametersschema, resultschema } from '../../rpc-protocol/mod.ts';

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
