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

const connect = (model: any) => (VueComponent: VueClass<Vue> | ComponentOptions<Vue>): VueClass<Vue> => {

	const componentName = (VueComponent as any).name || (VueComponent as any)._componentTag || (VueComponent.constructor && VueComponent.constructor.name) || '<component>';
	const Component = typeof VueComponent === 'function' && VueComponent.prototype instanceof Vue ? VueComponent : Vue.extend(VueComponent);

	const { $mount, $destroy } = Component.prototype;
	let dispose = noop;

	Component.prototype.$mount = function (this: any, ...args: any[]) {

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

		const reaction = new Reaction(`${componentName}.render()`, reactiveRender);

		dispose = reaction.getDisposer();

		return reactiveRender();
	};

	Component.prototype.$destroy = function (this: any, ...args: any[]) {
		dispose();
		$destroy.apply(this, args);
	};

	(Component as any).options = { ...(Component as any).options, data: (vm: Vue) => addBindings(model, vm) };

	return Component;
};

export {
	PropOptions,
	connect,
	connect as Connect,
};
