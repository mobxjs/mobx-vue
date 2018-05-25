/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-24 10:34
 */

export default function collectProperties<T>(model: T) {

	const ownKeys = Object.keys(model);
	const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(model));

	return [...ownKeys, ...protoKeys];
}
