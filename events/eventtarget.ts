// **NOTE**: The method descriptions of `TypedEventTarget` was taken from
// TypeScript's built-in descriptions of `EventTarget`.

/**
 * Represents the expected listener typing passed to `TypedEventTarget.addEventListener`
 * and `TypedEventTarget.removeEventListener`.
 *
 * @private
 */
type TypedEventListener<Event extends CustomEvent> =
	| ((
		evt: Event,
	) => void | Promise<void>)
	| {
		handleEvent(evt: Event): void | Promise<void>;
	};

/**
 * Represents a record of event names associated with their `CustomEvent`-derived
 * classes.
 *
 * @example
 * ```typescript
 * class UpdateEvent extends CustomEvent<{ original: unknown, replacement: unknown }> {}
 *
 * // **NOTE**: While you can import this type and use `interface MyEvents extends TypedEventRecord`
 * // you will lose autocomplete in IDEs.
 * //
 * // So this example is just showcasing the expected interface of `Record<string, CustomEvent>`.
 * type MyEvents = {
 *     update: UpdateEvent;
 * };
 * ```
 */
export type TypedEventRecord = Record<string, CustomEvent>;

/**
 * Represents a strongly-typed inheritable verison of the standard Web API `EventTarget`.
 *
 * @example
 * ```typescript
 * import {
 *     assertEquals,
 *     assertInstanceOf,
 * } from 'https://deno.land/std/testing/asserts.ts';
 * import { TypedEventTarget } from 'https://deno.land/x/enzastdlib/events/mod.ts';
 *
 * interface UpdateEventDetail {
 *     original: unknown;
 *
 *     replacement: unknown;
 * }
 *
 * class UpdateEvent extends CustomEvent<UpdateEventDetail> {
 *     constructor(detail: UpdateEventDetail) {
 *         // **IMPORTANT**: Make sure to set the name of your event in the
 *         // constructor to match the one located in your event record.
 *         //
 *         // Which in this case is `update`.
 *         super('update', { detail });
 *     }
 * }
 *
 * type MyEvents = {
 *     update: UpdateEvent;
 * };
 *
 * class MyEventTarget extends TypedEventTarget<MyEvents> {}
 *
 * // **NOTE**: Alternatively you can just construct the `TypedEventTarget` without
 * // using inheritence:
 * //
 * // const event_target = new TypedEventTarget<MyEvents>();
 * const event_target = new MyEventTarget();
 *
 * assertInstanceOf(event_target, EventTarget);
 *
 * event_target.addEventListener('update', (event: UpdateEvent): void => {
 *     assertInstanceOf(event, CustomEvent);
 *
 *     assertEquals(event.detail, {
 *         original: 42,
 *         replacement: 82,
 *     });
 * });
 *
 * const event = new UpdateEvent({
 *     original: 42,
 *     replacement: 84,
 * });
 *
 * event_target.dispatchEvent(event);
 * ```
 */
export class TypedEventTarget<EventRecord extends TypedEventRecord>
	extends EventTarget {
	/**
	 * Appends an event listener for events whose type attribute value is type. The
	 * callback argument sets the callback that will be invoked when the event is
	 * dispatched.
	 *
	 * The options argument sets listener-specific options. For compatibility this
	 * can be a boolean, in which case the method behaves exactly as if the value was
	 * specified as options's capture.
	 *
	 * When set to true, options's capture prevents callback from being invoked when
	 * the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present),
	 * callback will not be invoked when event's eventPhase attribute value is
	 * CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase
	 * attribute value is AT_TARGET.
	 *
	 * When set to true, options's passive indicates that the callback will not
	 * cancel the event by invoking preventDefault(). This is used to enable performance
	 * optimizations described in § 2.8 Observing event listeners.
	 *
	 * When set to true, options's once indicates that the callback will only be
	 * invoked once after which the event listener will be removed.
	 *
	 * The event listener is appended to target's event listener list and is not
	 * appended if it has the same type, callback, and capture.
	 *
	 * @param type
	 * @param listener
	 * @param options
	 *
	 * @example
	 * ```typescript
	 * import { TypedEventTarget } from 'https://deno.land/x/enzastdlib/events/mod.ts';
	 *
	 * type MyEvents = {
	 *     myEvent: CustomEvent<{ myValue: number }>;
	 * };
	 *
	 * const event_target = new TypedEventTarget<MyEvents>();
	 *
	 * event_target.addEventListener(
	 *     'myEvent',
	 *     (event) => console.log(event.detail.myValue),
	 * );
	 * ```
	 */
	addEventListener<Type extends keyof EventRecord>(
		type: Type,
		listener: TypedEventListener<EventRecord[Type]> | null,
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

	/**
	 * Dispatches a synthetic event event to target and returns true if either event's
	 * cancelable attribute value is false or its preventDefault() method was not
	 * invoked, and false otherwise.
	 *
	 * @param event
	 * @returns
	 *
	 * @example
	 * ```typescript
	 * import { TypedEventTarget } from 'https://deno.land/x/enzastdlib/events/mod.ts';
	 *
	 * const event_target = new TypedEventTarget<
	 *     { myEvent: CustomEvent<{ myValue: number }> }
	 * >();
	 *
	 * const event = new CustomEvent('myEvent', { detail: { myValue: 1 } });
	 *
	 * event_target.addEventListener('myEvent', console.log);
	 *
	 * event_target.dispatchEvent(event); // `{ myValue: 1 }`
	 * ```
	 */
	dispatchEvent<Event extends EventRecord[keyof EventRecord]>(
		event: Event,
	): boolean {
		return super.dispatchEvent(event);
	}

	/**
	 * Removes the event listener in target's event listener list with the same type,
	 * callback, and options.
	 *
	 * @param type
	 * @param listener
	 * @param options
	 *
	 * @example
	 * ```typescript
	 * import { TypedEventTarget } from 'https://deno.land/x/enzastdlib/events/mod.ts';
	 *
	 * type MyEvents = {
	 *     myEvent: CustomEvent<{ myValue: number }>;
	 * };
	 *
	 * function onMyEvent(event: MyEvents['myEvent']): void {
	 *     console.log(event.detail.myValue);
	 * }
	 *
	 * const event_target = new TypedEventTarget<MyEvents>();
	 *
	 * event_target.addEventListener('myEvent', onMyEvent);
	 * event_target.removeEventListener('myEvent', onMyEvent);
	 * ```
	 */
	removeEventListener<Type extends keyof EventRecord>(
		type: Type,
		listener: TypedEventListener<EventRecord[Type]> | null,
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
