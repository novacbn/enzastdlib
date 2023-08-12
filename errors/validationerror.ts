/**
 * Represents an exception regarding user-facing validation of data or input.
 *
 * @example
 * ```typescript
 * import { ValidationError } from 'https://deno.land/x/enzastdlib/errors/mod.ts';
 *
 * throw new ValidationError(
 *     'property \'MyInterface.myProperty\' was a \'string\', expected \'number\'',
 * );
 * ```
 */
export class ValidationError extends Error {
    readonly name = ValidationError.name;
}
