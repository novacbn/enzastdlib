import type {
	CallOptions,
	DepromisifyNotificationRecord,
	IDGenerator,
	NotificationRecord,
	ProcedureRecord,
	PromisifyProcedureRecord,
} from '../rpc-protocol/mod.ts';

export interface ClientOptions<
	Options extends CallOptions = CallOptions,
> {
	readonly calls?: Omit<Options, 'signal'>;

	readonly id?: IDGenerator;
}

export interface Client<
	Notifications extends NotificationRecord<false>,
	Procedures extends ProcedureRecord<false>,
	Options extends CallOptions = CallOptions,
> {
	readonly notifications: DepromisifyNotificationRecord<
		Notifications,
		Options
	>;

	readonly procedures: PromisifyProcedureRecord<Procedures, Options>;
}
