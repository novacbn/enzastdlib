import type { ValueOf } from '../collections/mod.ts';

/**
 * Represents the process exit coded that are reserved by `@enzastdlib/commands`
 * when calling sub commands.
 *
 * > **WARNING**: Exit status codes [0, 9] are reserved by this module.
 *
 * @example
 * ```typescript
 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
 *
 * Deno.exit(EXIT_CODES.resolved);
 * ```
 */
export const EXIT_CODES = {
	/**
	 * Represents when the command was called successfully.
	 *
	 * > **NOTE**: By default this value is used if no number is returned by
	 * > the commands callback.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.resolved);
	 * ```
	 */
	resolved: 0,

	/**
	 * Represents when a sub command is called by the end-user that is not
	 * registered with `makeApplication`.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.unrecognized_command);
	 * ```
	 */
	unrecognized_command: 1,

	/**
	 * Represents when a sub command has not associated a `JSONSchema` with
	 * the `schema` decorator.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.missing_schema);
	 * ```
	 */
	missing_schema: 2,

	/**
	 * Represents when a sub command is called by the end-user, but they provided
	 * a malformed argument or option.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.malformed_flags);
	 * ```
	 */
	malformed_flags: 3,

	/**
	 * Represents a process exit code that is reserved for future use.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.reserved_4);
	 * ```
	 */
	reserved_4: 4,

	/**
	 * Represents a process exit code that is reserved for future use.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.reserved_5);
	 * ```
	 */
	reserved_5: 5,

	/**
	 * Represents a process exit code that is reserved for future use.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.reserved_6);
	 * ```
	 */
	reserved_6: 6,

	/**
	 * Represents a process exit code that is reserved for future use.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.reserved_7);
	 * ```
	 */
	reserved_7: 7,

	/**
	 * Represents a process exit code that is reserved for future use.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.reserved_8);
	 * ```
	 */
	reserved_8: 8,

	/**
	 * Represents a process exit code that is reserved for future use.
	 *
	 * @example
	 * ```typescript
	 * import { EXIT_CODES } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * Deno.exit(EXIT_CODES.reserved_9);
	 * ```
	 */
	reserved_9: 9,
} as const;

/**
 * Represents a union of all possible reserved exit codes.
 *
 * @example
 * ```typescript
 * import type { ExitCodes } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
 *
 * Deno.exit(1 satisfies ExitCodes);
 * ```
 */
export type ExitCodes = ValueOf<typeof EXIT_CODES>;
