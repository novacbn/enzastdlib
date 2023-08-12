import type { UnknownObject } from '../collections/mod.ts';

import { generateGlobalsBlockList } from './blocklist.ts';

/**
 * Represents all the available options passable to `evaluateModule`.
 */
export interface EvaluateModuleOptions<GlobalThisType = unknown> {
	/**
	 * Represents the `globalThis` global object exposed to the execution environment.
	 *
	 * > **NOTE**: All members of this object will be exposed as globals to the evaluated
	 * code.
	 */
	readonly globalThis?: GlobalThisType;

	/**
	 * Represents if the environment should set Deno runtime globals not found in
	 * `EvaluateModuleOptions.globalThis` to `undefined` to ensure proper sandboxing.
	 */
	readonly useBlockList?: boolean;
}

/**
 * Evaluates code in a sandbox environment with the specified options.
 *
 * > **WARNING**: The sandbox environment works by setting a blocklist of default Deno
 * > globals to `undefined` when executed. It can be escaped if the blocklist is not
 * > updated when members are added in newer Deno versions.
 *
 * @private
 *
 * @param code
 * @param options
 * @returns
 */
export function evaluateModule<
	Exports = unknown,
	GlobalThisType = unknown,
>(
	code: string,
	options: EvaluateModuleOptions<GlobalThisType> = {},
): Promise<Exports> {
	const { globalThis = {}, useBlockList = true } = options;

	const keys = Object.keys(globalThis as UnknownObject);
	const values = Object.values(globalThis as UnknownObject);

	const blocklist_keys = useBlockList
		? generateGlobalsBlockList(globalThis)
		: [];
	const blocklist_values = blocklist_keys.map(() => undefined);

	console.error({ blocklist_keys });

	const func = new Function(
		...blocklist_keys,
		...keys,
		'globalThis',
		`return (async () => {
${code}
        })`,
	)(...blocklist_values, ...values, globalThis);

	return func();
}
