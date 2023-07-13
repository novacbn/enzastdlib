import { makeDecorator } from '../decorators/mod.ts';

import type { Error } from './error.schema.ts';
import { ProcedureCallback } from './procedure.ts';

export class RPCError extends Error {
	readonly name = RPCError.name;

	constructor(error: Error) {
		super(error.message);

		this.name = error.name;
	}
}

export const errors = makeDecorator<
	readonly Error[],
	ProcedureCallback,
	ReadonlySet<Error>
>((func, _errors) => {
	errors.set(func, new Set(_errors));
});
