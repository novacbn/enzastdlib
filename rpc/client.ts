import type {
    CallOptions,
    DepromisifyNotificationRecord,
    IDGenerator,
    NotificationRecord,
    ProcedureRecord,
    PromisifyProcedureRecord,
} from '../rpc-protocol/mod.ts';

/**
 * Represents the base options that are passable to a function that returns a `Client`
 * instance.
 */
export interface ClientOptions<
    Options extends CallOptions = CallOptions,
> {
    /**
     * Represents the base call options that are applied to all calls to the remote RPC
     * server.
     */
    readonly calls?: Omit<Options, 'signal'>;

    /**
     * Represents a generator for creating ids used to associate calls to the remote RPC
     * server with their responses.
     */
    readonly id?: IDGenerator;
}

/**
 * Represents a RPC client connected to a remote RPC server.
 */
export interface Client<
    Notifications extends NotificationRecord<false>,
    Procedures extends ProcedureRecord<false>,
    Options extends CallOptions = CallOptions,
> {
    /**
     * Represents the notification calls that can be made to the remote RPC server.
     */
    readonly notifications: DepromisifyNotificationRecord<
        Notifications,
        Options
    >;

    /**
     * Represents the procedure calls that can be made to the remote RPC server.
     */
    readonly procedures: PromisifyProcedureRecord<Procedures, Options>;
}
