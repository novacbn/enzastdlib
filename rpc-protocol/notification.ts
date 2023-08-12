import { Notification } from './notification.schema.ts';
import type { CallOptions } from './payload.ts';

/**
 * Represents the typing of a notification callback that can be registered.
 */
export type NotificationCallback<
    ParametersType extends // HACK: We cannot effectively type payloads here since the
    // JSON Schema's parsed typed will be fully defined with
    // no index signatures.
    //
    // deno-lint-ignore no-explicit-any
    any = any,
> = (
    payload: Notification,
    parameters: ParametersType,
) => Promise<void> | void;

/**
 * Represents a record containing all registered notifications.
 */
export type NotificationRecord<IsOptional extends boolean = false> =
    IsOptional extends true ? Record<string, NotificationCallback | undefined>
        : Record<string, NotificationCallback>;

/**
 * Represents a utility type that "depromisifies" a notifications
 * by converting its second argument as its only argument. And
 * converts its return type into `void`.
 */
export type DepromisifyNotification<
    Notification extends NotificationCallback,
    Options extends CallOptions = CallOptions,
    _ParametersType = Parameters<Notification>[1],
> = _ParametersType extends undefined ? ((
        parameters?: undefined,
        options?: Options,
    ) => void)
    : ((
        parameters: _ParametersType,
        options?: Options,
    ) => void);

/**
 * Represents a utility type that takes an `NotificationRecord<false>` record
 * and returns a new record with `DepromisifyNotification` ran on all notifications.
 */
export type DepromisifyNotificationRecord<
    Notifications extends NotificationRecord<false>,
    Options extends CallOptions = CallOptions,
> = {
    [Key in keyof Notifications]: DepromisifyNotification<
        Notifications[Key],
        Options
    >;
};
