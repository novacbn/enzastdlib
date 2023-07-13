import { relative } from '../vendor/@deno-std-path.ts';

/**
 * Returns if the child path is nested within the parent path.
 *
 * @param parent
 * @param child
 * @returns
 */
export function isSubPath(parent: string, child: string): boolean {
	const relative_path = relative(parent, child);

	// Unix-like systems will have `../` at the beginning and Windows will
	// have `..\\` at the beginning of their paths when the child path tries
	// to traverse directories above the parent path.

	return !!relative_path &&
		relative_path !== '..' &&
		!relative_path.startsWith('../') &&
		!relative_path.startsWith('..\\\\');
}
