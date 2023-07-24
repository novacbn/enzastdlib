import { posix } from '../vendor/@deno-std-path.ts';

const { relative } = posix;

/**
 * Returns the pathname of `to` as relative to `from`.
 *
 * @param from
 * @param to
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { relativePathname } from 'https://deno.land/x/enzastdlib/path/mod.ts';
 *
 * const URL_A = new URL("https://example.domain/assets");
 * const URL_B = new URL("https://example.domain/assets/scripts/main.js");
 *
 * assertEquals(
 *     relativePathname(URL_A, URL_B),
 *     'scripts/main.js'
 * );
 * ```
 */
export function relativePathname(from: URL, to: URL): string {
	return relative(from.pathname, to.pathname);
}
