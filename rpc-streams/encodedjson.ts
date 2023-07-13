import { JsonValue } from '../vendor/@deno-std-json.ts';

// NOTE: If we use a normal `ReadableStream` with `TextLineStream`,
// `TextDecoderStream`, and `JSONParseStream` via `ReadableStream.pipeline`
// then our source `ReadableStream` will remained locked after the first
// operation. And I could not for the life of me figure out how to cancel
// those pipelined streams without affecting the original stream.
//
// So, since we needed to not junk the original stream the following
// custom implementation was made that directly uses a reader.

export type EncodedJSONGenerator = AsyncGenerator<JsonValue, void, unknown>;

export interface EncodedJSONWriter {
	readonly releaseLock: () => void;

	readonly write: (data: unknown) => Promise<void>;
}

export async function* makeEncodedJSONGenerator(
	readable: ReadableStream<Uint8Array>,
): EncodedJSONGenerator {
	const decoder = new TextDecoder();
	const reader = readable.getReader();

	let buffer = '';

	try {
		while (true) {
			const { done, value: chunk } = await reader.read();
			let text = decoder.decode(chunk);

			while (text.length > 0) {
				const newline_index = text.indexOf('\n');
				if (newline_index === -1) {
					buffer += text;
					text = '';

					break;
				}

				yield Promise.resolve(JSON.parse(
					buffer + text.slice(0, newline_index),
				));

				text = text.slice(newline_index + 1);
				buffer = '';
			}

			if (done) break;
		}
	} finally {
		reader.releaseLock();
		if (buffer.length > 0) yield Promise.resolve(JSON.parse(buffer));
	}
}

export function makeEncodedJSONWriter(
	writable: WritableStream<Uint8Array>,
): EncodedJSONWriter {
	const encoder = new TextEncoder();
	const writer = writable.getWriter();

	return {
		releaseLock: () => {
			writer.releaseLock();
		},

		write: async (data) => {
			await writer.ready;

			return writer.write(
				encoder.encode(
					JSON.stringify(data) + '\n',
				),
			);
		},
	};
}
