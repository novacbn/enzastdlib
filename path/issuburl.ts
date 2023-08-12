import { relativePathname } from './relativepathname.ts';

/**
 * Returns if the `child` is a sub-URL of the `parent`.
 *
 * @param parent
 * @param child
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { isSubURL } from 'https://deno.land/x/enzastdlib/path/mod.ts';
 *
 * const URL_A = new URL("https://example.domain/assets");
 * const URL_B = new URL("https://example.domain/assets/scripts/main.js");
 *
 * assertEquals(
 *     isSubURL(URL_A, URL_B),
 *     true
 * );
 * ```
 */
export function isSubURL(parent: URL, child: URL): boolean {
    if (parent.origin !== child.origin) return false;
    else if (parent.protocol !== child.protocol) return false;

    const relative_pathname = relativePathname(parent, child);

    return relative_pathname !== '..' &&
        !relative_pathname.startsWith('../');
}
