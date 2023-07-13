import { CallOptions } from '../rpc-protocol/mod.ts';

export interface HTTPCallOptions extends CallOptions {
	http?: Omit<RequestInit, 'body' | 'method' | 'signal'>;
}
