/**
 * Returns a typed that by default has `any[]` parameters and `void` return.
 *
 * @private
 */
export type FunctionBox<
    ParametersType extends // deno-lint-ignore no-explicit-any
    any[] = any[],
    ReturnType extends unknown = void,
> = (...args: ParametersType) => ReturnType;

// HACK: This is here just to not have to litter `deno-lint-ignore` statements
// everywhere with regards to using `any[]`.
