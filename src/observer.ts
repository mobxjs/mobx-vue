/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-22 16:39
 */
import { Reaction } from 'mobx';
import Vue, { ComponentOptions, PropOptions } from 'vue';
import collectData from './collectData';
import { VueClass } from './declarations';

// @formatter:off
// tslint:disable-next-line
const noop = () => {};
// @formatter:on

const observer = (Component: VueClass<Vue> | ComponentOptions<Vue>): VueClass<Vue> => {

	const name = (Component as any).name || (Component as any)._componentTag || (Component.constructor && Component.constructor.name) || '<component>';

	const setup = typeof Component === 'object' ? Component : {};
	const options = { ...setup, name, data: (vm: Vue) => collectData(vm, setup.data) };
	const Super = typeof Component === 'function' && Component.prototype instanceof Vue ? Component : Vue;
	const ExtendedComponent = Super.extend(options);

	let dispose = noop;

	const { $mount, $destroy } = ExtendedComponent.prototype;

	ExtendedComponent.prototype.$mount = function (this: any, ...args: any[]) {

		let mounted = false;

		const reactiveRender = () => {
			reaction.track(() => {
				if (!mounted) {
					$mount.apply(this, args);
					mounted = true;
				} else {
					this._watcher.getter.call(this, this);
				}
			});

			return this;
		};

		const reaction = new Reaction(`${name}.render()`, reactiveRender);

		dispose = reaction.getDisposer();

		return reactiveRender();
	};

	ExtendedComponent.prototype.$destroy = function (this: Vue, ...args: any[]) {
		dispose();
		$destroy.apply(this, args);
	};

	Object.defineProperty(ExtendedComponent, 'name', {
		writable: false,
		value: name,
		enumerable: false,
		configurable: false,
	});

	return ExtendedComponent;
};

export {
	PropOptions,
	observer,
	observer as Observer,
};
