import { makeDecorator } from '../decorators/mod.ts';

import type { JSONSchemaObject } from '../schema/mod.ts';

import { CommandCallback } from './command.ts';

/**
 * Associates a `JSONSchema` value with the function.
 */
export const schema = makeDecorator<
	JSONSchemaObject,
	CommandCallback
>((func, _schema) => {
	schema.set(func, _schema);
});
