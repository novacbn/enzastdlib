import { join } from '../vendor/@deno-std-path.ts';

/**
 * Returns the home directory of the current user.
 */
export const getUserHome = () => Deno.env.get('HOME')!;

/**
 * Returns the cached data directory of the current user.
 */
export const getUserCache = () => join(getUserHome(), 'Library', 'Caches');

/**
 * Returns the config directory of the current user.
 */
export const getUserConfig = () =>
	join(getUserHome(), 'Library', 'Application Support');

/**
 * Returns the data directory of the current user.
 */
export const getUserData = () =>
	join(getUserHome(), 'Library', 'Application Support');

/**
 * Returns the state directory of the current user.
 */
export const getUserState = () =>
	join(getUserHome(), 'Library', 'Application Support');
