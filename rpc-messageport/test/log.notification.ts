import { assertEquals } from '../../vendor/@deno-std-testing.ts';

import { assertTypeOf } from '../../testing/asserts.ts';

import type { Notification } from '../../rpc-protocol/mod.ts';
import { parametersschema } from '../../rpc-protocol/mod.ts';

import type { LogParametersType } from './log.schema.ts';
import { SCHEMA_LOG_PARAMETERS } from './log.schema.ts';

parametersschema(log, SCHEMA_LOG_PARAMETERS);
export function log(
    _payload: Notification,
    parameters: LogParametersType,
): void {
    assertTypeOf(parameters, 'object');

    const { message } = parameters;

    assertTypeOf(message, 'string');
    assertEquals(message, 'Hello World!');

    console.log('log', { message });
}
