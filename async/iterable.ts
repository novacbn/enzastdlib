export async function arrayFromIterable<Value>(
	iterable: AsyncIterable<Value>,
): Promise<Value[]> {
	const values = [];

	for await (const value of iterable) values.push(value);

	return values;
}
