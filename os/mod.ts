/**
 * Utilities for abstracting away operating system specifics.
 *
 * @module
 */

import * as darwin from './darwin.ts';
import * as linux from './linux.ts';
import * as windows from './windows.ts';

let exports: typeof linux;

switch (Deno.build.os) {
	case 'darwin':
		exports = darwin;
		break;

	case 'linux':
		exports = linux;
		break;

	case 'windows':
		exports = windows;
		break;

	default:
		throw new Deno.errors.NotSupported(
			`bad import to '@enzastdlib/os' (not supported platform '${Deno.build.os}')`,
		);
}

export const {
	getUserCache,
	getUserConfig,
	getUserData,
	getUserHome,
	getUserState,
} = exports;
