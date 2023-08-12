import { join } from '../vendor/@deno-std-path.ts';

/**
 * Returns the home directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `$HOME`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserHome } from 'https://deno.land/x/enzastdlib/os/darwin.ts';
 *
 * assertEquals(
 *     getUserHome(),
 *     '/Users/novacbn'
 * );
 * ```
 */
export const getUserHome = () => Deno.env.get('HOME')!;

/**
 * Returns the cached data directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `$HOME` joined with `Library/Caches`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserCache } from 'https://deno.land/x/enzastdlib/os/darwin.ts';
 *
 * assertEquals(
 *     getUserCache(),
 *     '/Users/novacbn/Library/Caches'
 * );
 * ```
 */
export const getUserCache = () => join(getUserHome(), 'Library', 'Caches');

/**
 * Returns the config directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `$HOME` joined with `Library/Application Support`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserConfig } from 'https://deno.land/x/enzastdlib/os/darwin.ts';
 *
 * assertEquals(
 *     getUserConfig(),
 *     '/Users/novacbn/Library/Application Support'
 * );
 * ```
 */
export const getUserConfig = () =>
    join(getUserHome(), 'Library', 'Application Support');

/**
 * Returns the data directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `$HOME` joined with `Library/Application Support`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserData } from 'https://deno.land/x/enzastdlib/os/darwin.ts';
 *
 * assertEquals(
 *     getUserData(),
 *     '/Users/novacbn/Library/Application Support'
 * );
 * ```
 */
export const getUserData = () =>
    join(getUserHome(), 'Library', 'Application Support');

/**
 * Returns the state directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `$HOME` joined with `Library/Application Support`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserState } from 'https://deno.land/x/enzastdlib/os/darwin.ts';
 *
 * assertEquals(
 *     getUserState(),
 *     '/Users/novacbn/Library/Application Support'
 * );
 * ```
 */
export const getUserState = () =>
    join(getUserHome(), 'Library', 'Application Support');
