import { unicodeWidth } from '../vendor/@deno-std-console.ts';
import { stripColor } from '../vendor/@deno-std-fmt.ts';

const EXPRESSION_NEWLINE = /\n/g;

const EXPRESSION_WORDS = /\s*[^\s]+/g;

/**
 * Splits a string into lines delimited by a max character length.
 *
 * @param text
 * @param max_length
 * @returns
 *
 * @example
 * ```typescript
 * import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
 * import { splitLength } from 'https://deno.land/x/enzastdlib/strings/mod.ts';
 *
 * // **NOTE**: Taken from `deno lint --help`.
 * const text =
 *     'The configuration file can be used to configure different aspects of deno including TypeScript, linting, and code formatting. Typically the configuration file will be called `deno.json` or `deno.jsonc` and automatically detected; in that case this flag is not necessary.\nSee https://deno.land/manual@v1.33.0/getting_started/configuration_file';
 *
 * assertEquals(
 *     splitLength(text, 66),
 *     [
 *         'The configuration file can be used to configure different aspects of',
 *         'deno including TypeScript, linting, and code formatting. Typically',
 *         'the configuration file will be called `deno.json` or `deno.jsonc` and',
 *         'automatically detected; in that case this flag is not necessary.',
 *         'See https://deno.land/manual@v1.33.0/getting_started/configuration_file',
 *     ];
 * );
 * ```
 */
export function splitLength(text: string, max_length: number): string[] {
    const lines = text.split(EXPRESSION_NEWLINE);

    return lines.map((line) => {
        const matches = line.match(EXPRESSION_WORDS);
        if (!matches) return [line];

        const sublines: string[] = [];
        let subline = '';
        for (let match of matches) {
            if (subline === '') match = match.trimStart();

            const display_width = unicodeWidth(stripColor(subline));
            if (display_width < max_length) {
                subline += match;
                continue;
            }

            sublines.push(subline);
            subline = match.trimStart();
        }

        if (subline.length > 0) sublines.push(subline);
        return sublines;
    }).flat();
}
