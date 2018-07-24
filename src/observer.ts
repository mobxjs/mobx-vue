/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-22 16:39
 */
import { Reaction, runInAction } from 'mobx';
import Vue, { ComponentOptions } from 'vue';
import collectDataForVue from './collectData';

export type VueClass<V> = { new(...args: any[]): V & Vue } & typeof Vue;

// @formatter:off
// tslint:disable-next-line
const noop = () => {};
// @formatter:on
function observer<VC extends VueClass<Vue>>(Component: VC | ComponentOptions<Vue>): VC;
function observer<VC extends VueClass<Vue>>(Component: VC | ComponentOptions<Vue>) {

	const name = (Component as any).name || (Component as any)._componentTag || (Component.constructor && Component.constructor.name) || '<component>';

	const originalOptions = typeof Component === 'object' ? Component : (Component as any).options;
	const dataDefinition = originalOptions.data;
	const propNames = originalOptions.props ? Object.keys(originalOptions.props) : [];
	const options = {
		// while parameter was component options, we could use it directly
		// otherwise we only use its data definition
		// we couldn't merge the options when Component was a VueClass, that will invoke the lifecycle twice after we called Component.extend
		...typeof Component === 'object' ? Component : {},
		name,
		data: (vm: Vue & {[prop: string]: any}) => {
			// Holds any mobx models that are found by collectDataForVue
			const collectedMobxData: any[] = [];
			// Separate normal Vue data from mobx models
			const collectedVueData = collectDataForVue(vm, dataDefinition, collectedMobxData);
			// Find mobx model properties that match vue props and one-way bind them
			collectedMobxData.map(model => {
				// Filter out any props that don't exist in the model
				const watchProps = propNames.reduce((arr: string[], prop: string) => {
					if (prop in model) {
						arr.push(prop);
					}
					return arr;
				}, []);
				if (watchProps.length) {
					vm.$watch(() => {
						return watchProps.map(prop => vm[prop]);
					}, (values: any[]) => {
						runInAction(() => {
							values.map((value, i) => model[watchProps[i]] = value);
						});
					}, { immediate: true });
				}
			});
			return collectedVueData;
		},
	};
	// remove the parent data definition to avoid reduplicate invocation
	delete originalOptions.data;

	const Super = (typeof Component === 'function' && Component.prototype instanceof Vue) ? Component : Vue;
	const ExtendedComponent = Super.extend(options);

	let disposer = noop;

	const { $mount, $destroy } = ExtendedComponent.prototype;

	ExtendedComponent.prototype.$mount = function (this: any, ...args: any[]) {

		let mounted = false;

		let nativeRenderOfVue: any;
		const reactiveRender = () => {
			reaction.track(() => {
				if (!mounted) {
					$mount.apply(this, args);
					mounted = true;
					nativeRenderOfVue = this._watcher.getter;
					// rewrite the native render method of vue with our reactive tracker render
					// thus if component updated by vue watcher, we could re track and collect dependencies by mobx
					this._watcher.getter = reactiveRender;
				} else {
					nativeRenderOfVue.call(this, this);
				}
			});

			return this;
		};

		const reaction = new Reaction(`${name}.render()`, reactiveRender);

		disposer = reaction.getDisposer();

		return reactiveRender();
	};

	ExtendedComponent.prototype.$destroy = function (this: Vue) {
		disposer();
		$destroy.apply(this);
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
