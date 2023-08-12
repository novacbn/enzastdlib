/**
 * Represents the typing of a command callback that can be registered.
 *
 * @example
 * ```typescript
 * import type { CommandCallback } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
 *
 * // **WARNING**: You need to use named functions instead of arrow syntax for
 * // registering commands. This example is for demonstration purposes only.
 *
 * const mycommand = ((options) => {
 *     // `options.msg` is equivalent `deno run ./mod.ts mycommand --msg ...`.
 *     console.log(`Hello ${options.msg}!`);
 * }) satisfies CommandCallback;
 * ```
 */
export type CommandCallback<
	OptionsType extends // HACK: We cannot effectively type flags here since the
	// JSON Schema's parsed typed will be fully defined with
	// no index signatures.
	//
	// deno-lint-ignore no-explicit-any
	any = any,
> = (
	options: OptionsType,
) => void | number | Promise<void | number>;

/**
 * Represents a record containing all registered commands.
 *
 * @example
 * ```typescript
 * import type { CommandRecord } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
 *
 * const MY_COMMANDS = {
 *     mycommand(options) {
 *         // `options.msg` is equivalent `deno run ./mod.ts mycommand --msg ...`.
 *         console.log(`Hello ${options.msg}!`);
 *     }
 * } satisfies CommandRecord;
 * ```
 */
export type CommandRecord = Record<string, CommandCallback | undefined>;
