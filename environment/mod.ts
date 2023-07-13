/**
 * Parse and validate both environment variables and dotenv files powered by [JSON Schema 2019-09](https://json-schema.org/specification-links.html#draft-2019-09-formerly-known-as-draft-8).
 *
 * This module imports the following external libraries:
 *
 * - https://github.com/CesiumLabs/json5
 * - https://github.com/cfworker/cfworker/tree/main/packages/json-schema
 * - https://github.com/denoland/deno_std/tree/main/dotenv
 * - https://github.com/jrylan/json-schema-typed
 * - https://github.com/ThomasAribart/json-schema-to-ts
 *
 * @module
 */

export * from './dotenv.ts';
export * from './environment.ts';
