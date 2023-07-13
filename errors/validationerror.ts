/**
 * Represents an exception regarding validation of data or input.
 */
export class ValidationError extends Error {
	readonly name = ValidationError.name;
}
