import { bundle } from '../vendor/@deno-emit.ts';

import { exists } from '../vendor/@deno-std-fs.ts';
import {
	dirname,
	fromFileUrl,
	posix,
	resolve,
	toFileUrl,
} from '../vendor/@deno-std-path.ts';

import { ValueOf } from '../collections/mod.ts';

import { relativePathname } from '../path/mod.ts';

const { extname } = posix;

/**
 * Represents the text found added to the beginning of every bundled payload.
 *
 * @private
 */
const BUNDLE_HEADER = '(function() {\n';

/**
 * Represents the text found added to the end of every bundled payload.
 *
 * @private
 */
const BUNDLE_FOOTER = '\n})();';

/**
 * Represents the regular expression used to detect indentation at the beginning
 * of every line.
 *
 * @private
 */
const EXPRESSION_INDENT = /^(\s\s\s\s)/gm;

/**
 * Represents the extensions supported for code files by the bundler.
 */
export const CODE_EXTENSIONS = {
	/**
	 * Represents the extension used for JavaScript files.
	 */
	javascript: '.js',

	/**
	 * Represents the extension used for TypeScript files.
	 */
	typescript: '.ts',
} as const;

/**
 * Represents a union of extensions supported for code files by the bundler.
 */
export type CodeExtensions = ValueOf<typeof CODE_EXTENSIONS>;

/**
 * Applies a few monkeypatches to a resulting bundle code.
 *
 * - Removes the function closure that the bundler generates when ran in the "IIFE"
 * format.
 * - Removes the first level of indentation from the aforementioned function enclosure.
 * - Trims any dangling whitespace and newlines from the beginning and end of the bundle.
 *
 * @param code
 * @returns
 */
function applyMonkeyPatches(code: string): string {
	// We just want the raw bundled code, since we are going to use a
	// custom IIFE when we go to execute it.

	return code
		.slice(BUNDLE_HEADER.length)
		.slice(0, BUNDLE_FOOTER.length * -1)
		.replace(EXPRESSION_INDENT, () => '')
		.trim();
}

/**
 * Bundles a given code entry point specifier and all of its dependencies.
 *
 * @private
 *
 * @param specifier
 * @param cwd
 * @returns
 */
export async function bundleEntryPoint(
	specifier: string | URL,
	cwd?: string | URL,
): Promise<string> {
	// We are basically checking if the working directory is provided. If not,
	// then we extract one from the specifier.

	if (cwd) {
		cwd = typeof cwd === 'string'
			? toFileUrl(
				resolve(cwd),
			)
			: cwd;

		specifier = typeof specifier === 'string'
			? new URL(specifier, cwd + '/')
			: specifier;
	} else {
		specifier = typeof specifier === 'string'
			? toFileUrl(
				resolve(specifier),
			)
			: specifier;

		cwd = toFileUrl(
			dirname(
				fromFileUrl(specifier),
			),
		);
	}

	const extension = extname(specifier.pathname);
	if (
		extension !== CODE_EXTENSIONS.javascript &&
		extension !== CODE_EXTENSIONS.typescript
	) {
		throw new Deno.errors.NotSupported(
			`bad argument #0 to 'bundleEntryPoint' (specifier '${
				relativePathname(cwd, specifier)
			}' has an invalid extension)`,
		);
	}

	const does_exist = await exists(specifier, {
		isFile: true,
		isReadable: true,
	});

	if (!does_exist) {
		throw new Deno.errors.NotFound(
			`bad argument #0 to 'bundleEntryPoint' (specifier '${
				relativePathname(cwd, specifier)
			}' does not exist or not readable)`,
		);
	}

	// TODO: Check for bad paths and cwd escape during bundling.

	const { code } = await bundle(specifier, {
		allowRemote: false,

		type: 'classic',

		importMap: {
			baseUrl: cwd,

			imports: {
				'/': './',
				'./': './',
			},
		},

		compilerOptions: {
			checkJs: false,
		},
	});

	return applyMonkeyPatches(code);
}
