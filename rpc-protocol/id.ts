import type { CallOptions } from './payload.ts';
import { Procedure } from './procedure.schema.ts';

export type IDGenerator<
    Options extends CallOptions = CallOptions,
> = (payload: Omit<Procedure, 'id'>, options: Options) => string;

export const defaultIDGenerator: IDGenerator = (payload, _options) =>
    `${payload.type}_${payload.procedure}_${crypto.randomUUID()}`;
