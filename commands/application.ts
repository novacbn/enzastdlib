import { ValidationError } from '../errors/mod.ts';

import { parseJSON5ExpressionRecord } from '../json5/mod.ts';

import type { JSONSchema } from '../schema/mod.ts';
import { makeValidator } from '../schema/mod.ts';

import { splitLength } from '../strings/mod.ts';

import { EXIT_CODES } from './exit_codes.ts';
import { collectFlags, extractCommand } from './flags.ts';
import { ApplicationOptions } from './options.ts';
import { schema as schema_decorator } from './schema.ts';
import {
	TEMPLATE_ERROR_MALFORMED_FLAGS,
	TEMPLATE_ERROR_MISSING_SCHEMA,
	TEMPLATE_ERROR_UNRECOGNIZED_COMMAND,
	TEMPLATE_EXAMPLE,
	TEMPLATE_FLAGS,
	TEMPLATE_HEADER_ARGUMENTS,
	TEMPLATE_HEADER_COMMANDS,
	TEMPLATE_HEADER_EXAMPLES,
	TEMPLATE_HEADER_OPTIONS,
	TEMPLATE_LIST_COMMAND,
	TEMPLATE_LIST_OPTION,
	TEMPLATE_TEXT_CONTACT,
	TEMPLATE_TEXT_HELP,
	TEMPLATE_TEXT_INFORMATION,
	TEMPLATE_USAGE_BINARY,
	TEMPLATE_USAGE_COMMAND,
} from './templates.ts';

/**
 * Represents a command line application made by `makeApplication`.
 */
export interface Application {
	/**
	 * Executes a subcommand based on the arguments passed. Then an exit code
	 * is returned by the subcommand or safeguards which can be used when exiting
	 * the application.
	 *
	 * @param argv
	 * @returns
	 *
	 * @example
	 * ```typescript
	 * import { makeApplication } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
	 *
	 * const application = makeApplication(...);
	 *
	 * const exit_code = await application.handleArgs(Deno.arg);
	 * Deno.exit(exit_code);
	 * ```
	 */
	readonly handleArgs: (argv?: string[]) => Promise<number>;
}

/**
 * Makes a new `Application` for handling command line parsing and validation
 * via JSON Schema.
 *
 * @param options
 * @returns
 *
 * @example
 * **schema.ts**
 * ```typescript
 * import type { JSONSchema, typeofschema } from 'https://deno.land/x/enzastdlib/schema/mod.ts';
 *
 * export const MY_STRING_SCHEMA = {
 *     type: 'object',
 *
 *     properties: {
 *         mystring: {
 *             type: 'string',
 *
 *             minLength: 1,
 *         },
 *     },
 * } as const satisfies JSONSchema;
 *
 * export type MyStringOptions = typeofschema<typeof MY_STRING_SCHEMA>;
 * ```
 *
 * **mycommand.ts**
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { schema } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
 *
 * import type { MyStringOptions } from './schema.ts';
 * import { MY_STRING_SCHEMA } from './schema.ts';
 *
 * schema(mycommand, MY_STRING_SCHEMA);
 * export function mycommand(options: MyStringOptions): void {
 *     assertEquals(
 *         options,
 *         { mystring: 'Hello World!' },
 *     );
 * }
 * ```
 *
 * **mod.ts**
 * ```typescript
 * import { makeApplication } from 'https://deno.land/x/enzastdlib/commands/mod.ts';
 *
 * import { mycommand } from './mycommand.ts';
 *
 * const application = makeApplication({
 *     // NOTE: If we compiled your application via `deno compile` then you should
 *     // use your binary's name here.
 *     name: 'deno run ./mod.ts',
 *     description: 'I run cool subcommands!',
 *
 *     commands: {
 *         mycommand,
 *     },
 * });
 *
 * const exit_code = await application.handleArgs(Deno.arg);
 * Deno.exit(exit_code);
 * ```
 *
 * **terminal**
 * ```bash
 * deno run ./mod.ts --mystring "Hello World!"
 * ```
 */
export function makeApplication(
	options: ApplicationOptions,
): Application {
	const {
		commands,
		description: binary_description,
		maximum_length = 64,
		name: binary_name,
	} = options;

	function printHelp(): void {
		console.log(TEMPLATE_USAGE_BINARY({ binary: binary_name }) + '\n');

		if (binary_description) {
			const lines = splitLength(
				binary_description,
				maximum_length,
			);
			console.log(lines.join('\n') + '\n');
		}

		if (Object.keys(commands).length > 0) {
			console.log(TEMPLATE_HEADER_COMMANDS());

			for (const name in commands) {
				const callback = commands[name];
				if (!callback) continue;

				const schema = schema_decorator.get(callback);
				if (!schema) {
					// TODO: Print user friendly message that overrides all previous
					// console messages.
					throw new ValidationError(
						`bad command to 'printHelp' (command '${name}' is missing an assigned schema)`,
					);
				}

				console.log(
					'\n\t' + TEMPLATE_LIST_COMMAND({
						command: name,
					}),
				);

				const { description } = schema;
				if (description) {
					const lines = splitLength(
						description,
						maximum_length,
					);

					for (const line of lines) console.log('\t\t' + line);
				} else console.log();
			}

			console.log();
		}

		console.log(TEMPLATE_HEADER_OPTIONS() + '\n');
		console.log('\t' + TEMPLATE_LIST_OPTION({ option: 'help' }));
		console.log('\t\t' + TEMPLATE_TEXT_HELP());
	}

	function printCommandHelp(command: string): void {
		// HACK: This function is only called when there IS a valid
		// command so the callback should ALWAYS exist.
		const callback = commands[command]!;

		// HACK: Similar to the above comment.
		const schema = schema_decorator.get(callback)!;

		const required = new Set(schema.required);

		const { description, examples, properties } = schema;
		const { _, ...options } = properties ?? {};

		console.log(
			TEMPLATE_USAGE_COMMAND({
				args_available: !!_,
				args_required: required.has('_'),
				args_type: _ ? (_ as JSONSchema).type : undefined,
				binary: binary_name,
				command,
				options_available: !!options,
				options_required: required.size > (required.has('_') ? 1 : 0),
			}) + '\n',
		);

		if (description) {
			const lines = splitLength(description, maximum_length);
			console.log(lines.join('\n') + '\n');
		}

		if (examples) {
			console.log(TEMPLATE_HEADER_EXAMPLES() + '\n');
			for (const example of examples) {
				console.log(
					'\t' + TEMPLATE_EXAMPLE({
						binary: binary_name,
						command: command,
						args: example,
					}) + '\n',
				);
			}
		}

		if (typeof _ === 'object') {
			console.log(TEMPLATE_HEADER_ARGUMENTS() + '\n');
			console.log(
				'\t' +
					TEMPLATE_FLAGS({
						required: required.has('_'),
						type: (_ as JSONSchema).type,
					}),
			);

			if (_.description) {
				const lines = splitLength(
					_.description,
					maximum_length,
				);

				for (const line of lines) console.log('\t\t' + line);
			}

			console.log();
		}

		console.log(TEMPLATE_HEADER_OPTIONS() + '\n');
		console.log('\t' + TEMPLATE_LIST_OPTION({ option: 'help' }));
		console.log('\t\t' + TEMPLATE_TEXT_HELP());

		if (options) {
			for (const name in options) {
				const { description, type } = options[name] as JSONSchema;

				console.log(
					'\n\t' + TEMPLATE_LIST_OPTION({
						required: required.has(name),
						option: name,
						type: type!,
					}),
				);

				if (description) {
					const lines = splitLength(
						description,
						maximum_length,
					);

					for (const line of lines) console.log('\t\t' + line);
				} else console.log();
			}
		}
	}

	function printCommandMissingSchema(command: string): void {
		console.error(TEMPLATE_ERROR_MISSING_SCHEMA({ command }) + '\n');
		console.error(TEMPLATE_TEXT_CONTACT());
	}

	function printCommandUnknown(command: string): void {
		console.error(TEMPLATE_ERROR_UNRECOGNIZED_COMMAND({ command }) + '\n');
		console.error(TEMPLATE_USAGE_BINARY({ binary: binary_name }) + '\n');
		console.error(TEMPLATE_TEXT_INFORMATION());
	}

	return {
		async handleArgs(args = []) {
			let command: string | undefined;
			({ args, command } = extractCommand(args));

			if (!command) {
				printHelp();
				return EXIT_CODES.resolved;
			}

			const callback = commands[command];
			if (!callback) {
				printCommandUnknown(command);
				return EXIT_CODES.unrecognized_command;
			}

			const schema = schema_decorator.get(callback);
			if (!schema) {
				printCommandMissingSchema(command);
				return EXIT_CODES.missing_schema;
			}

			if (args.includes('--help')) {
				printCommandHelp(command);
				return EXIT_CODES.resolved;
			}

			const flags = collectFlags(args);
			const options = parseJSON5ExpressionRecord(schema, flags);

			const validator = makeValidator(schema);
			const errors = validator.test(options);

			if (errors) {
				console.error(
					TEMPLATE_ERROR_MALFORMED_FLAGS() + '\n',
				);

				for (const error of errors) {
					console.error(`${error.property}: ${error.message}`);
				}

				return EXIT_CODES.malformed_flags;
			}

			return (await callback(options)) ?? EXIT_CODES.resolved;
		},
	};
}
