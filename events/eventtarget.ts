export type TypedEventMap = Record<string, CustomEvent>;

export type TypedEventListener<Event extends CustomEvent> =
	| ((
		evt: Event,
	) => void | Promise<void>)
	| {
		handleEvent(evt: Event): void | Promise<void>;
	};

export class TypedEventTarget<EventMap extends TypedEventMap>
	extends EventTarget {
	addEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: TypedEventListener<EventMap[Type]> | null,
		options?: boolean | AddEventListenerOptions | undefined,
	): void {
		super.addEventListener(
			type as string,
			// @ts-ignore - HACK: Unclear why TypeScript is complaining
			// `EventObject` be able to to be initialized with something other
			// than an `Event` decendent. We have it extending `Event`...
			listener,
			options,
		);
	}

	dispatchEvent<Event extends EventMap[keyof EventMap]>(
		event: Event,
	): boolean {
		return super.dispatchEvent(event);
	}

	removeEventListener<Type extends keyof EventMap>(
		type: Type,
		listener: TypedEventListener<EventMap[Type]> | null,
		options?: boolean | EventListenerOptions | undefined,
	): void {
		super.removeEventListener(
			type as string,
			// @ts-ignore - HACK: Ditto as above.
			listener,
			options,
		);
	}
}
