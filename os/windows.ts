/**
 * Returns the cached data directory of the current user.
 */
export const getUserCache = () => Deno.env.get('LocalAppData')!;

/**
 * Returns the config directory of the current user.
 */
export const getUserConfig = () => Deno.env.get('AppData')!;

/**
 * Returns the data directory of the current user.
 */
export const getUserData = () => Deno.env.get('LocalAppData')!;

/**
 * Returns the home directory of the current user.
 */
export const getUserHome = () => Deno.env.get('USERPROFILE')!;

/**
 * Returns the state directory of the current user.
 */
export const getUserState = () => Deno.env.get('LocalAppData')!;
