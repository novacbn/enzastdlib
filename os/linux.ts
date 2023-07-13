import { join } from '../vendor/@deno-std-path.ts';

/**
 * Returns the home directory of the current user.
 */
export const getUserHome = () => Deno.env.get('HOME')!;

/**
 * Returns the cached data directory of the current user.
 */
export const getUserCache = () =>
	Deno.env.get('XDG_CACHE_HOME') ??
		join(getUserHome(), '.cache');

/**
 * Returns the config directory of the current user.
 */
export const getUserConfig = () =>
	Deno.env.get('XDG_CONFIG_HOME') ??
		join(getUserHome(), '.config');

/**
 * Returns the data directory of the current user.
 */
export const getUserData = () =>
	Deno.env.get('XDG_DATA_HOME') ??
		join(getUserHome(), '.local', 'share');

/**
 * Returns the state directory of the current user.
 */
export const getUserState = () =>
	Deno.env.get('XDG_STATE_HOME') ??
		join(getUserHome(), '.local', 'state');
