import {
	bold,
	cyan,
	green,
	italic,
	magenta,
	red,
} from '../vendor/@deno-std-fmt.ts';

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_EXAMPLE = (
	{ args, binary, command }: {
		args: string;
		binary: string;
		command?: string;
	},
) => command
	? `${green(binary)} ${cyan(command)} ${args}`
	: `${green(binary)} ${args}`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_ERROR_MALFORMED_FLAGS = () =>
	`${bold(red('error'))}: following argument(s) or option(s) were wrong`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_ERROR_MISSING_SCHEMA = (
	{ command }: { command: string },
) => `${bold(red('error'))}: subcommand '${cyan(command)}' is missing schema`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_ERROR_UNRECOGNIZED_COMMAND = (
	{ command }: { command: string },
) => `${bold(red('error'))}: unrecognized subcommand '${cyan(command)}'`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_FLAGS = (
	{ required, type = 'FLAGS' }: { required?: boolean; type?: string },
) => required ? `<${type}>` : `[${type}]`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_HEADER_ARGUMENTS = () => `${bold('Arguments')}:`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_HEADER_COMMANDS = () => `${bold('Commands')}:`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_HEADER_EXAMPLES = () => `${bold('Examples')}:`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_HEADER_OPTIONS = () => `${bold('Options')}:`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_LIST_COMMAND = ({ command }: { command: string }) =>
	`${cyan(command)}`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_LIST_OPTION = (
	{ required, option, type }: {
		required?: boolean;
		option: string;
		type?: string;
	},
) => `--${magenta(option)}${
	type ? (required ? ` <${type}>` : ` [${type}]`) : ''
}`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_USAGE_BINARY = ({ binary }: { binary: string }) =>
	`${bold('Usage')}: ${green(binary)} [${italic('OPTIONS')}] <${
		italic('COMMAND')
	}>`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_USAGE_COMMAND = (
	{
		args_available,
		args_required,
		args_type = 'ARGS',
		binary,
		command,
		options_available,
		options_required,
	}: {
		args_available?: boolean;
		args_required?: boolean;
		args_type?: string;
		binary?: string;
		command: string;
		options_available?: boolean;
		options_required?: boolean;
	},
) => `${bold('Usage')}:${binary ? ` ${green(binary)}` : ''} ${cyan(command)}${
	options_available
		? (options_required
			? ` <${italic('OPTIONS')}>`
			: ` [${italic('OPTIONS')}]`)
		: ''
}${
	args_available
		? (args_required
			? ` <${italic(args_type)}>`
			: ` [${italic(args_type)}]`)
		: ''
}`;

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_TEXT_CONTACT = () =>
	'Please contact the developer of this application to resolve the error.';

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_TEXT_INFORMATION = () =>
	'For more information, try \'--help\'.';

/**
 * Represents a localization message function used by
 * the `@enzastdlib/commands` module.
 *
 * @private
 *
 * @param param0
 * @returns
 */
export const TEMPLATE_TEXT_HELP = () => `Print help.`;
