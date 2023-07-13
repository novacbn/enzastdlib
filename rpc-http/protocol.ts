import type { ValueOf } from '../collections/mod.ts';

import { PROTOCOL_VERSION } from '../rpc-protocol/mod.ts';

export const PROTOCOL_METHOD = 'POST';

export const PROTOCOL_PATHNAME = `/.enzastdlib/rpc`;

export const PROTOCOL_PATHNAME_PROCEDURES =
	`${PROTOCOL_PATHNAME}/procedures/${PROTOCOL_VERSION}`;

export const PROTOCOL_RESPONSES = {
	successful_call: 200,

	successful_no_response: 204,

	invalid_method: 405,

	invalid_pathname: 404,
};

export type ProtocolResponses = ValueOf<typeof PROTOCOL_RESPONSES>;
