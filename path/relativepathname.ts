import { posix } from '../vendor/@deno-std-path.ts';

const { relative } = posix;

/**
 * Returns the pathname of `to` as relative to `from`.
 *
 * @param from
 * @param to
 * @returns
 */
export function relativePathname(from: URL, to: URL): string {
	return relative(from.pathname, to.pathname);
}
