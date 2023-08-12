import { resolve, toFileUrl } from '../vendor/@deno-std-path.ts';

import { bundleEntryPoint } from './bundle.ts';

import type { EvaluateModuleOptions } from './evaluate.ts';
import { evaluateModule } from './evaluate.ts';

// TODO: Add these lines back to `Realm.importModule` once the `load` situation
// is figured out for preventing working directory escapes.

// Imported modules cannot
// * > however escape from `RealmOptions.cwd`.

/**
 * Represents a custom JavaScript / TypeScript execution environment that can run code
 * within a sandbox.
 */
export interface Realm {
    /**
     * Imports a module from the file system to be evaluated in the `Realm`'s
     * execution environment.
     *
     * > **NOTE**: Imported modules can import modules relative to themselves or
     * > to `RealmOptions.cwd` via absolute imports.
     *
     * > **WARNING**: Code is transpiled into JavaScript before being ran. This
     * > means type checking is never performed. That must happen through CLI / CI
     * > steps. Also means stacktraces will be mangled.
     *
     * > **WARNING**: While you can control the environment through `RealmOptions`,
     * > you cannot control compute and resource usage of evaluated code. For instance
     * > evaluated code can have `while (true) {}` to lock up the current process.
     *
     * > **WARNING**: While you can control the environment through `RealmOptions`,
     * > this does not guarantee the sandbox cannot be escaped through APIs you expose
     * > or exploits in the V8 JavaScript engine.
     *
     * > **RECOMMENDATION**: If you require a greater degree of security for sandboxing
     * > untrusted code then run the `Realm` in a `Worker` with limited permissions that
     * > communicates via IPC with the main process for functionality. And / or use tools
     * > provided in your operating system's ecosystem to further lock down attack surface.
     *
     * @param specifier
     * @returns
     */
    readonly importModule: <Exports = unknown>(
        specifier: string | URL,
    ) => Promise<Exports>;
}

/**
 * Represents all the available options passable to `makeRealm`.
 */
export interface RealmOptions<GlobalThisType = unknown> {
    /**
     * Represents the current working directory to execute code in. Any import statements
     * or calls to `import` / `require` resolve to this directory and cannot be escaped.
     *
     * **NOTE**: This value defaults to the current working directory if not provided.
     */
    readonly cwd?: string;

    /**
     * Represents the options to configure the execution environment of this `Realm`.
     */
    readonly environment?: EvaluateModuleOptions<GlobalThisType>;
}

/**
 * Creates a new custom JavaScript / TypeScript execution environment.
 *
 * @example
 * **myscript.js**
 * ```javascript
 * export const message = `Hello ${name}!`;
 * ```
 *
 * **mod.ts**
 * ```typescript
 * import { makeRealm } from 'https://deno.land/x/enzastdlib/realm/mod.ts';
 *
 * const realm = makeRealm({
 *     environment: {
 *         globalThis: {
 *             name: 'World',
 *         },
 *     },
 * });
 *
 * const {message} = realm.importModule('./myscript.js');
 * ```
 *
 * @param options
 * @returns
 */
export function makeRealm<GlobalThisType = unknown>(
    options: RealmOptions<GlobalThisType> = {},
): Realm {
    const { environment } = options;

    const cwd = options.cwd
        ? toFileUrl(resolve(options.cwd))
        : toFileUrl(Deno.cwd());

    const realm: Realm = {
        importModule: async (specifier) => {
            const code = await bundleEntryPoint(specifier, cwd);

            return evaluateModule(code, environment);
        },
    };

    return realm;
}
