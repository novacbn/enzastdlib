/**
 * Create fully typed and validated RPC clients and servers using a pair of [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) / [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) instances as the transport.
 *
 * This module imports the following external libraries:
 *
 * - https://github.com/denoland/deno_std/tree/main/json
 * - https://github.com/denoland/deno_std/tree/main/streams
 *
 * @module
 */

export * from './client.ts';
export * from './server.ts';
