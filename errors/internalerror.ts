/**
 * Represents an exception regarding an error that occured within
 * the internals of a system.
 */
export class InternalError extends Error {
	readonly name = InternalError.name;
}
