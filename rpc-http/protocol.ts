import type { ValueOf } from '../collections/mod.ts';

import { PROTOCOL_VERSION } from '../rpc-protocol/mod.ts';

/**
 * Represents the HTTP method exclusively used by enzastdlib's RPC protocol.
 */
export const PROTOCOL_METHOD = 'POST';

/**
 * Represents the HTTP namespace pathname exclusively used by enzastdlib's RPC protocol.
 */
export const PROTOCOL_PATHNAME = `/.enzastdlib/rpc`;

/**
 * Represents the HTTP pathname for procedure calls used by enzastdlib's RPC protocol.
 */
export const PROTOCOL_PATHNAME_PROCEDURES =
    `${PROTOCOL_PATHNAME}/procedures/${PROTOCOL_VERSION}`;

/**
 * Represents a mapping of standard enzastdlib RPC protocol behavior to HTTP status codes.
 */
export const PROTOCOL_RESPONSES = {
    /**
     * Represents a successful RPC call. This is typically used by procedure calls.
     */
    successful_call: 200,

    /**
     * Represents a successful RPC call but no response body. This is typically used by
     * notification calls.
     */
    successful_no_response: 204,

    /**
     * Represents when a client makes an RPC call with an invalid method.
     */
    invalid_method: 405,

    /**
     * Represents when a client makes an RPC call with an invalid pathname.
     */
    invalid_pathname: 404,
};

/**
 * Represents a union of all possible HTTP status codes enzastdlib RPC protocol can emit.
 */
export type ProtocolResponses = ValueOf<typeof PROTOCOL_RESPONSES>;
