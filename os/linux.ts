import { join } from '../vendor/@deno-std-path.ts';

/**
 * Returns the home directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `$HOME`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserHome } from 'https://deno.land/x/enzastdlib/os/linux.ts';
 *
 * assertEquals(
 *     getUserHome(),
 *     '/home/novacbn'
 * );
 */
export const getUserHome = () => Deno.env.get('HOME')!;

/**
 * Returns the cached data directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `XDG_CACHE_HOME` or `$HOME`
 * > joined with `.cache` as a fallback.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserCache } from 'https://deno.land/x/enzastdlib/os/linux.ts';
 *
 * assertEquals(
 *     getUserCache(),
 *     '/home/novacbn/.cache'
 * );
 */
export const getUserCache = () =>
	Deno.env.get('XDG_CACHE_HOME') ??
		join(getUserHome(), '.cache');

/**
 * Returns the config directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `XDG_CONFIG_HOME` or `$HOME`
 * > joined with `.config` as a fallback.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserConfig } from 'https://deno.land/x/enzastdlib/os/linux.ts';
 *
 * assertEquals(
 *     getUserConfig(),
 *     '/home/novacbn/.config'
 * );
 */
export const getUserConfig = () =>
	Deno.env.get('XDG_CONFIG_HOME') ??
		join(getUserHome(), '.config');

/**
 * Returns the data directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `XDG_DATA_HOME` or `$HOME`
 * > joined with `.local/share` as a fallback.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserData } from 'https://deno.land/x/enzastdlib/os/linux.ts';
 *
 * assertEquals(
 *     getUserData(),
 *     '/home/novacbn/.local/share'
 * );
 */
export const getUserData = () =>
	Deno.env.get('XDG_DATA_HOME') ??
		join(getUserHome(), '.local', 'share');

/**
 * Returns the state directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `XDG_STATE_HOME` or `$HOME`
 * > joined with `.local/state` as a fallback.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserState } from 'https://deno.land/x/enzastdlib/os/linux.ts';
 *
 * assertEquals(
 *     getUserState(),
 *     '/home/novacbn/.local/state'
 * );
 */
export const getUserState = () =>
	Deno.env.get('XDG_STATE_HOME') ??
		join(getUserHome(), '.local', 'state');
