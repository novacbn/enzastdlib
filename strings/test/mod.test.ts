import {
	assertEquals,
	assertInstanceOf,
} from '../../vendor/@deno-std-testing.ts';

import { splitLength } from '../splitlength.ts';

/** EXPORTED FUNCTIONALITY */

Deno.test(function splitLength66Success() {
	// NOTE: Below was taken as a sample from `deno run --help` of `v1.33.0`.

	const SAMPLE =
		'The configuration file can be used to configure different aspects of deno including TypeScript, linting, and code formatting. Typically the configuration file will be called `deno.json` or `deno.jsonc` and automatically detected; in that case this flag is not necessary.\nSee https://deno.land/manual@v1.33.0/getting_started/configuration_file';

	const CONTROL = [
		'The configuration file can be used to configure different aspects of',
		'deno including TypeScript, linting, and code formatting. Typically',
		'the configuration file will be called `deno.json` or `deno.jsonc` and',
		'automatically detected; in that case this flag is not necessary.',
		'See https://deno.land/manual@v1.33.0/getting_started/configuration_file',
	];

	const lines = splitLength(SAMPLE, 66);

	assertInstanceOf(lines, Array);
	assertEquals(lines, CONTROL);
});
