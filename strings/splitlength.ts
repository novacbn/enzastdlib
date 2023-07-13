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
