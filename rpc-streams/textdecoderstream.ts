// HACK: There is a some native resource mismangement going on in Deno when using the
// built-in version of `TextDecoderStream`. So we have to make our own.
//
// See: https://github.com/denoland/deno/issues/13142

export class TextDecoderStream extends TransformStream<Uint8Array, string> {
	constructor() {
		const decoder = new TextDecoder();

		super({
			transform(
				chunk: Uint8Array,
				controller: TransformStreamDefaultController,
			) {
				controller.enqueue(decoder.decode(chunk));
			},

			flush(controller: TransformStreamDefaultController) {
				controller.enqueue(decoder.decode());
			},
		});
	}
}
