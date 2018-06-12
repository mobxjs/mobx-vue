/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-22 16:39
 */
import { Reaction } from 'mobx';
import Vue, { ComponentOptions } from 'vue';
import { VueClass } from 'vue-class-component/lib/declarations';
import collectData from './collectData';

// @formatter:off
// tslint:disable-next-line
const noop = () => {};
// @formatter:on
function observer<VC extends VueClass<Vue>>(Component: VC | ComponentOptions<Vue>): VC;
function observer<VC extends VueClass<Vue>>(Component: VC | ComponentOptions<Vue>) {

	const name = (Component as any).name || (Component as any)._componentTag || (Component.constructor && Component.constructor.name) || '<component>';

	const originalOptions = typeof Component === 'object' ? Component : (Component as any).options;
	// while parameter was component options, we could use it directly
	// otherwise we only use its data definition
	// we couldn't merge the options when Component was a VueClass, that will merge the lifecycle twice after we called Component.extend
	const dataDefinition = originalOptions.data;
	const options = {
		...typeof Component === 'object' ? Component : {},
		name,
		data: (vm: Vue) => collectData(vm, dataDefinition),
	};
	// remove the parent data definition to avoid reduplicate invocation
	originalOptions.data = {};

	const Super = (typeof Component === 'function' && Component.prototype instanceof Vue) ? Component : Vue;
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
}

export {
	observer,
	observer as Observer,
};
