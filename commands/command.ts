/**
 * Represents the typing of a command callback that can be registered.
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
 */
export type CommandRecord = Record<string, CommandCallback | undefined>;
