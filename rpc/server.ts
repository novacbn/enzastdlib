import type {
	NotificationRecord,
	ProcedureRecord,
	ServerMiddlewareCallback,
} from '../rpc-protocol/mod.ts';

export interface ServerOptions {
	readonly middlewares?: readonly ServerMiddlewareCallback[];

	readonly notifications?: NotificationRecord<true>;

	readonly procedures?: ProcedureRecord<true>;
}

export interface Server<ServeReturn = unknown> {
	readonly closed: boolean;

	readonly close: () => Promise<void> | void;

	readonly serve: () => Promise<ServeReturn> | ServeReturn;
}
