/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-24 10:34
 */

export default function collectProperties<T>(model: T) {

	const ownKeys = Object.getOwnPropertyNames(model);
	const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(model)).filter(prop => ownKeys.indexOf(prop) === -1);

	// filter private properties
	const internalMethods = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', 'toLocaleString'];
	const internalPropertyPrefix = '__';
	return [...ownKeys, ...protoKeys].filter(prop => internalMethods.indexOf(prop) === -1 && prop.indexOf(internalPropertyPrefix) !== 0);
}
