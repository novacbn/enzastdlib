import type {
    Handler,
    ServeInit,
    ServeTlsInit,
} from '../vendor/@deno-std-http.ts';
import {
    serve as stdlibServer,
    serveTls as stdlibServeTls,
} from '../vendor/@deno-std-http.ts';

/**
 * Represents the global `serve` HTTP server API that is only available when Deno is
 * passed the `--unstable` flag.
 *
 * @private
 */
declare const serve:
    | ((options: ServeInit | ServeTlsInit, handler: Handler) => Promise<void>)
    | undefined;

/**
 * Creates a new HTTP server. It uses the new `Deno.serve` API when `--unstable` is
 * passed to the Deno CLI. Otherwise the implementation from `https://deno.land/std@0.192.0/http`
 * will be used instead.
 *
 * @private
 *
 * @param on_request
 * @param options
 * @returns
 */
export function serveHTTP(
    on_request: Handler,
    options: ServeInit | ServeTlsInit,
): void {
    // NOTE: Deno has a new `serve` API based on a new runtime included HTTP server. But
    // it is only available when `--unstable` is passed as a CLI flag. So we need to feature
    // detect it here.
    if ('serve' in globalThis) {
        // @ts-ignore - HACK: We declared it at the top of the file as a constant
        // as a hack but it will properly live as a global when `--unstable` is passed.
        serve(options, on_request);
    } else if (
        ('cert' in options || 'certFile' in options) &&
        ('key' in options || 'keyFile' in options)
    ) {
        stdlibServeTls(on_request, options);
        return;
    }

    stdlibServer(on_request, options);
}
