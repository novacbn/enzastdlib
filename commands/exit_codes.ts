import type { ValueOf } from '../collections/mod.ts';

/**
 * Represents the process exit coded that are reserved
 * by `@enzastd/commands` when calling sub commands.
 */
export const EXIT_CODES = {
	// NOTE: Exit status codes 0...9 are reserved by this module.

	/**
	 * Represents when the command was called successfully.
	 *
	 * > **NOTE**: By default this value is used if no number
	 * > is returned by the commands callback.
	 */
	resolved: 0,

	/**
	 * Represents when a sub command is called by the end-user
	 * that is not registered with `makeApplication`.
	 */
	unrecognized_command: 1,

	/**
	 * Represents when a sub command has not associated a
	 * `JSONSchema` with the `schema` decorator.
	 */
	missing_schema: 2,

	/**
	 * Represents when a sub command is called by the end-user,
	 * but they provided a malformed argument or option.
	 */
	malformed_flags: 3,

	/**
	 * Represents a process exit code that is reserved for future
	 * use.
	 */
	reserved_4: 4,

	/**
	 * Represents a process exit code that is reserved for future
	 * use.
	 */
	reserved_5: 5,

	/**
	 * Represents a process exit code that is reserved for future
	 * use.
	 */
	reserved_6: 6,

	/**
	 * Represents a process exit code that is reserved for future
	 * use.
	 */
	reserved_7: 7,

	/**
	 * Represents a process exit code that is reserved for future
	 * use.
	 */
	reserved_8: 8,

	/**
	 * Represents a process exit code that is reserved for future
	 * use.
	 */
	reserved_9: 9,
} as const;

export type ExitCodes = ValueOf<typeof EXIT_CODES>;
