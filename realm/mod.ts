/**
 * Create custom JavaScript and TypeScript execution environments.
 *
 * > **NOTE**: This module is based on the [`ShadowRealm`](https://github.com/tc39/proposal-shadowrealm) API
 * proposal but does not follow the specifications.
 *
 * > **WARNING**: This module is basically a bunch of hacks to get the desired
 * > functionality. So expect warts and all. ESPECIALLY regarding things like
 * > line numbering or errors.
 *
 * This module imports the following external libraries:
 *
 * - https://github.com/denoland/deno_emit
 * - https://github.com/denoland/deno_std/tree/main/fs
 * - https://github.com/denoland/deno_std/tree/main/path
 *
 * @module
 */

export * from './bundle.ts';
export * from './evaluate.ts';
export * from './realm.ts';
