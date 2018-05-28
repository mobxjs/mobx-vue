/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-22 16:39
 */
import { Reaction } from 'mobx';
import Vue, { ComponentOptions, PropOptions } from 'vue';
import collectProperties from './collectProperties';
import { VueClass } from './declarations';

// tslint:disable-next-line
function noop() {
}

function addBindings(model: any, vm: Vue) {

	collectProperties(model).forEach(key => {

		Object.defineProperty(vm, key, {
			configurable: true,
			get() {
				const value = model[key];
				return typeof value === 'function' ? value.bind(model) : value;
			},
		});
	});

	return {};
}

const connect = (model: any) => (Component: VueClass<Vue> | ComponentOptions<Vue>): VueClass<Vue> => {

	const name = (Component as any).name || (Component as any)._componentTag || (Component.constructor && Component.constructor.name) || '<component>';

	const options = { ...(typeof Component === 'object' ? Component : {}), name, data: (vm: Vue) => addBindings(model, vm) };
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

	ExtendedComponent.prototype.$destroy = function (this: any, ...args: any[]) {
		dispose();
		$destroy.apply(this, args);
	};

	return ExtendedComponent;
};

export {
	PropOptions,
	connect,
	connect as Connect,
};
