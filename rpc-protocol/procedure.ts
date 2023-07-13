import type { Promisify } from '../async/mod.ts';

import type { CallOptions } from './payload.ts';
import { Procedure } from './procedure.schema.ts';

/**
 * Represents the typing of a procedure callback that can be registered.
 */
export type ProcedureCallback<
	ParametersType extends // HACK: We cannot effectively type payloads here since the
	// JSON Schema's parsed typed will be fully defined with
	// no index signatures.
	//
	// deno-lint-ignore no-explicit-any
	any = any,
	ReturnType extends // deno-lint-ignore no-explicit-any
	any = any,
> = (
	payload: Procedure,
	parameters: ParametersType,
) => Promise<ReturnType> | ReturnType;

/**
 * Represents a record containing all registered procedures.
 */
export type ProcedureRecord<IsOptional extends boolean = false> =
	IsOptional extends true ? Record<string, ProcedureCallback | undefined>
		: Record<string, ProcedureCallback>;

/**
 * Represents a utility type that "promisifies" a procedures
 * by converting its second argument as its only argument. And
 * converts its return type into a `Promise` if not already.
 */
export type PromisifyProcedure<
	Procedure extends ProcedureCallback,
	Options extends CallOptions = CallOptions,
	_ParametersType = Parameters<Procedure>[1],
	_ReturnType = Promisify<ReturnType<Procedure>>,
> = _ParametersType extends undefined ? ((
		parameters?: undefined,
		options?: Options,
	) => _ReturnType)
	: ((
		parameters: _ParametersType,
		options?: Options,
	) => _ReturnType);

/**
 * Represents a utility type that takes an `ProcedureRecord<false>` record
 * and returns a new record with `PromisifyProcedure` ran on all procedures.
 */
export type PromisifyProcedureRecord<
	Procedures extends ProcedureRecord<false>,
	Options extends CallOptions = CallOptions,
> = {
	[Key in keyof Procedures]: PromisifyProcedure<
		Procedures[Key],
		Options
	>;
};
