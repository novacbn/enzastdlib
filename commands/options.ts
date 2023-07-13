import { CommandRecord } from './command.ts';

/**
 * Represents the options that are passable to `makeApplication`.
 */
export interface ApplicationOptions {
	/**
	 * Represents the callbacks of commands being registered to
	 * the returned `Application` instance.
	 */
	commands: CommandRecord;

	/**
	 * Represents the description of the command displayed to
	 * the end-users.
	 */
	description?: string;

	/**
	 * Represents the maximum paragraph length displayed before
	 * splitting into a new line for applicable displayed text.
	 */
	maximum_length?: number;

	/**
	 * Represents the file name of the binary the end-user needs
	 * to use to call this application.
	 */
	name: string;
}
