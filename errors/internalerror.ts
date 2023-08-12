/**
 * Represents an exception regarding an error that occured within the internals
 * of a system.
 *
 * @example
 * ```typescript
 * import { InternalError } from 'https://deno.land/x/enzastdlib/errors/mod.ts';
 *
 * throw new InternalError(
 *     'an exception occured while processing the http request',
 * );
 * ```
 */
export class InternalError extends Error {
    readonly name = InternalError.name;
}
