/**
 * Represents details about a validation error that occured.
 */
export interface Error {
	/**
	 * Represents the details about what validation error occured.
	 */
	message: string;

	/**
	 * Represents the name of the property where the validation error occured.
	 */
	property: string;
}
