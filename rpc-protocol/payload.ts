import { ValueOf } from '../collections/mod.ts';

import type { Payload } from './payload.schema.ts';

/**
 * Represents an enumeration of all the possible types of Payloads.
 */
export const PAYLOAD_TYPES = {
    error: 'error',

    procedure: 'procedure',

    notification: 'notification',

    response: 'response',
} as const;

/**
 * Represents the typing of a payload callback that can be registered.
 */
export type PayloadCallback = (
    payload: Payload,
) => Promise<Payload | void> | Payload | void;

/**
 * Represents a string union of `PAYLOAD_TYPES`.
 */
export type PayloadTypes = ValueOf<typeof PAYLOAD_TYPES>;

/**
 * Represents an optional object that can be set when making a call
 * to a server.
 */
export interface CallOptions {
    /**
     * Represents data that should be associated with the server call
     * but not apart of its normal body. ex. authentication tokens
     */
    readonly metadata?: Payload['metadata'];

    /**
     * Represents a signal that allows you to abort an ongoing call to the
     * server.
     *
     * > **NOTE**: The client transport layer has to implement support for
     * > this feature. ex. whatever implements `ClientOptions.processProcedure`.
     */
    readonly signal?: AbortSignal;
}
