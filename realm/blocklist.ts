import type { UnknownObject } from '../collections/mod.ts';

// HACK: Hacks, ALL HACKS! Let's hope that Deno supports making new interpreter instances
// or the `ShadowRealm` API sometime soon.

/**
 * Represents a list of globals that are in available in Deno's runtime.
 *
 * > **WARNING**: This list is up to date as of Deno v1.33.0.
 *
 * @private
 */
const BLOCKLIST_DENO = [
    'Deno',

    'self',
    'window',

    'caches',
    'crypto',
    'navigator',
    'localStorage',
    'sessionStorage',

    'alert',
    'confirm',
    'prompt',

    'clearInterval',
    'clearTimeout',
    'setInterval',
    'setTimeout',
    'queueMicrotask',

    'clear',
    'close',
    'closed',

    'onbeforeunload',
    'onerror',
    'onunhandledrejection',
    'onload',
    'onunload',

    'atob',
    'btoa',
    'fetch',
    'getParent',
    'performance',
    'reportError',
    'structuredClone',
] as const;

/**
 * Generates a blocklist of globals in Deno's runtime that need to be
 * removed to ensure proper sandboxing.
 *
 * @private
 *
 * @param globals
 */
export function generateGlobalsBlockList(globals: unknown): string[] {
    const blocklist = [];

    for (const member of BLOCKLIST_DENO) {
        if (!(member in (globals as UnknownObject))) blocklist.push(member);
    }

    return blocklist;
}
