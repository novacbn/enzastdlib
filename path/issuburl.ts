import { relativePathname } from './relativepathname.ts';

/**
 * Returns if the `child` is a sub-URL of the `parent`.
 *
 * @param parent
 * @param child
 * @returns
 */
export function isSubURL(parent: URL, child: URL): boolean {
	if (parent.origin !== child.origin) return false;
	else if (parent.protocol !== child.protocol) return false;

	const relative_pathname = relativePathname(parent, child);

	return relative_pathname !== '..' &&
		!relative_pathname.startsWith('../');
}
