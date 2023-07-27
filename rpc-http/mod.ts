/**
 * Create fully typed and validated RPC clients and servers using HTTP as the transport.
 *
 * > **NOTE**: If `--unstable` is passed to the Deno CLI then the
 * > `Deno.serve` API will be used instead of the Deno stdlib HTTP
 * > server implementation.
 *
 * This module imports the following external libraries:
 *
 * - https://github.com/denoland/deno_std/tree/main/http
 *
 * @module
 */

export * from './client.ts';
export * from './protocol.ts';
export * from './server.ts';
