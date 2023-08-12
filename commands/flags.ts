/**
 * Represents the prefix used to recognize command line flag names.
 *
 * @private
 */
const PREFIX_FLAG = '--';

/**
 * Represents a record of command line flags grouped by their names.
 *
 * @private
 */
type FlagsRecord = Record<string, string | undefined>;

/**
 * Processes the value of `Deno.args` by associating any `string` value that
 * immediately comes after a `string` prefixed by `--` in a record.
 *
 * Otherwise all unassociated `string` values are collected in the `_` key
 * in the record.
 *
 * @private
 *
 * @param args
 * @returns
 */
export function collectFlags(args: string[]): FlagsRecord {
	let flag_group: string | undefined;

	return args.reduce<FlagsRecord>((flags, arg) => {
		if (arg.startsWith(PREFIX_FLAG)) {
			flag_group = arg.slice(2);
		} else if (flag_group) {
			const flag = flags[flag_group];

			flags[flag_group] = flag ? `${flag} ${arg.trim()}` : arg.trim();
			flag_group = undefined;
		} else {
			const rest = flags['_'];

			flags['_'] = rest ? `${rest} ${arg.trim()}` : arg.trim();
		}

		return flags;
	}, {});
}

/**
 * Processes the value of `Deno.args` by finding the first
 * danging `string` value not immediated preceded by a `string`
 * value prefixed `--`.
 *
 * @private
 *
 * @param args
 * @returns
 */
export function extractCommand(
	args: string[],
): { args: string[]; command?: string } {
	let command: string | undefined;

	for (const index in args) {
		const arg = args[index];
		if (!arg.startsWith(PREFIX_FLAG)) {
			command = arg;

			// NOTE: We are cloning `args` since `Array.splice` mutates its target
			// array rather than passing back a modified clone.
			args = [...args];

			args.splice(
				// @ts-ignore - HACK: `Array.splice` actually does not care
				// if we pass a string as long as it is a number. So we can safely
				// tell TypeScript to ignore this.
				index,
				1,
			);

			break;
		}
	}

	return {
		args,
		command,
	};
}
