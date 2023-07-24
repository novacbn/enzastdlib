/**
 * Returns the cached data directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `%LocalAppData%`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserCache } from 'https://deno.land/x/enzastdlib/os/windows.ts';
 *
 * assertEquals(
 *     getUserCache(),
 *     'C:\\Users\\novacbn\\AppData\\Local'
 * );
 * ```
 */
export const getUserCache = () => Deno.env.get('LocalAppData')!;

/**
 * Returns the config directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `%AppData%`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserConfig } from 'https://deno.land/x/enzastdlib/os/windows.ts';
 *
 * assertEquals(
 *     getUserConfig(),
 *     'C:\\Users\\novacbn\\AppData\\Roaming'
 * );
 * ```
 */
export const getUserConfig = () => Deno.env.get('AppData')!;

/**
 * Returns the data directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `%LocalAppData%`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserData } from 'https://deno.land/x/enzastdlib/os/windows.ts';
 *
 * assertEquals(
 *     getUserData(),
 *     'C:\\Users\\novacbn\\AppData\\Local'
 * );
 * ```
 */
export const getUserData = () => Deno.env.get('LocalAppData')!;

/**
 * Returns the home directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `%USERPROFILE%`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserHome } from 'https://deno.land/x/enzastdlib/os/windows.ts';
 *
 * assertEquals(
 *     getUserHome(),
 *     'C:\\Users\\novacbn'
 * );
 * ```
 */
export const getUserHome = () => Deno.env.get('USERPROFILE')!;

/**
 * Returns the state directory of the current user.
 *
 * > **NOTE**: Returns the value of the environment variable `%LocalAppData%`.
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { getUserState } from 'https://deno.land/x/enzastdlib/os/windows.ts';
 *
 * assertEquals(
 *     getUserState(),
 *     'C:\\Users\\novacbn\\AppData\\Local'
 * );
 * ```
 */
export const getUserState = () => Deno.env.get('LocalAppData')!;
