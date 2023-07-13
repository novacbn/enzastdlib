/**
 * Represents a simplified interface of the JavaScript runtime's `MessagePort` class.
 *
 * Only the APIs required by this module are specified. Since some runtime APIs have
 * similar APIs for listening and posting messages but do not have a complete one-to-one
 * API for extraneous things like a `.close` method. ex. `BroadcastChannel` vs `MessagePort`
 * vs `Worker`.
 */
export interface MessagePortLike {
	readonly addEventListener: (
		event: 'message',
		listener: (event: MessageEvent) => void,
		options?: AddEventListenerOptions,
	) => void;

	readonly postMessage:
		| ((
			// HACK: `MessagePort.postMessage` accepts any type for its messages, so
			// this `any` fits here.
			//
			// deno-lint-ignore no-explicit-any
			message: any,
			transfer?: Transferable,
		) => void)
		| ((
			// deno-lint-ignore no-explicit-any
			message: any,
			options?: StructuredSerializeOptions,
		) => void);

	readonly removeEventListener: (
		event: 'message',
		listener: (event: MessageEvent) => void,
		options?: EventListenerOptions,
	) => void;
}
