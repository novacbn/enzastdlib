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

const BUNDLE_HEADER = '(function() {\n';

const BUNDLE_FOOTER = '\n})();';

const EXPRESSION_INDENT = /^(\s\s\s\s)/gm;

export const CODE_EXTENSIONS = {
	javascript: '.js',

	typescript: '.ts',
} as const;

export type CodeExtensions = ValueOf<typeof CODE_EXTENSIONS>;

function applyMonkeyPatches(code: string): string {
	// We just want the raw bundled code, since we are going to use a
	// custom IIFE when we go to execute it.

	return code
		.slice(BUNDLE_HEADER.length)
		.slice(0, BUNDLE_FOOTER.length * -1)
		.replace(EXPRESSION_INDENT, () => '')
		.trim();
}

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
