import type {
    NotificationRecord,
    ProcedureRecord,
    ServerMiddlewareCallback,
} from '../rpc-protocol/mod.ts';

/**
 * Represents the base options that are passable to a function that returns a `Server`
 * instance.
 */
export interface ServerOptions {
    /**
     * Represents middleware that handles every call from remote RPC clients.
     */
    readonly middlewares?: readonly ServerMiddlewareCallback[];

    /**
     * Represents the registered notifications that remote RPC clients are allowed to call.
     */
    readonly notifications?: NotificationRecord<true>;

    /**
     * Represents the registered procedures that remote RPC clients are allowed to call.
     */
    readonly procedures?: ProcedureRecord<true>;
}

/**
 * Represents a RPC server that can respond to remote RPC clients.
 */
export interface Server<ServeReturn = unknown> {
    /**
     * Represents if the RPC server is currently closed.
     */
    readonly closed: boolean;

    /**
     * Closes the RPC server.
     *
     * @returns
     */
    readonly close: () => Promise<void> | void;

    /**
     * Starts the RPC server.
     *
     * @returns
     */
    readonly serve: () => Promise<ServeReturn> | ServeReturn;
}
