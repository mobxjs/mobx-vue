/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-24 13:36
 */
import { shallowMount } from '@vue/test-utils';
import { action, computed, observable } from 'mobx';
import Vue, { CreateElement } from 'vue';
import Component from 'vue-class-component';
import { Observer, observer } from '../observer';
import Base from './fixtures/Base.vue';
import ClassBase from './fixtures/ClassBase.vue';
import Conditional from './fixtures/Conditional.vue';
import DecoratedClassBase from './fixtures/DecoratedClassBase.vue';
import ModelClassBase from './fixtures/ModelClassBase.vue';

class Model {
	@observable
	age = 10;

	@computed
	get computedAge() {
		return this.age + 1;
	}

	@action.bound
	setAge() {
		this.age++;
	}
}

test('observer with a object literal component', () => {

	const model = observable({
		age: 10,
		setAge() {
			model.age++;
		},
	});

	const Component = observer({
		data() {
			return {
				model,
			};
		},
		name: 'HelloWorld',
		render(this: any, h: CreateElement) {
			return h('button', {
				on: { click: this.model.setAge }, domProps: { textContent: this.model.age },
			});
		},
	});

	const wrapper = shallowMount(Component);
	expect(wrapper.name()).toBe('HelloWorld');
	expect(wrapper.find('button').text()).toBe('10');

	wrapper.find('button').trigger('click');
	expect(wrapper.find('button').text()).toBe('11');

	wrapper.destroy();
});

test('observer with a base component', () => {

	const Component = observer(Base);

	const wrapper = shallowMount(Component);
	expect(wrapper.name()).toBe(Base.name);
	expect(wrapper.find('p').text()).toBe('10');

	wrapper.find('button').trigger('click');
	expect(wrapper.find('p').text()).toBe('11');

	wrapper.destroy();

});

test('observer with a class component', () => {

	const Component = observer(ClassBase);

	const wrapper = shallowMount(Component);
	expect(wrapper.name()).toBe(ClassBase.name);
	expect(wrapper.find('[role="age"]').text()).toBe('10');

	wrapper.find('button').trigger('click');
	expect(wrapper.find('[role="age"]').text()).toBe('11');

	wrapper.destroy();
});
//
test('use observer function with class component and observable model constructed by class', () => {

	const Component = observer(ModelClassBase);

	const wrapper = shallowMount(Component);
	expect(wrapper.name()).toBe(ModelClassBase.name);
	expect(wrapper.find('[role="age"]').text()).toBe('10');
	expect(wrapper.find('[role="computed-age"]').text()).toBe('11');

	wrapper.find('button').trigger('click');
	expect(wrapper.find('[role=age]').text()).toBe('11');
	expect(wrapper.find('[role="computed-age"]').text()).toBe('12');

	wrapper.destroy();
});
//
describe('use observer decorator with class component and observable model constructed by class', () => {

	const wrapper = shallowMount(DecoratedClassBase);
	test('component should be reactive', () => {

		expect(wrapper.name()).toBe((DecoratedClassBase as any).name);
		expect(wrapper.find('[role="age"]').text()).toBe('10');
		expect(wrapper.find('[role="computed-age"]').text()).toBe('11');

		wrapper.find('button').trigger('click');
		wrapper.find('button').trigger('click');
		expect(wrapper.find('[role=age]').text()).toBe('12');
		expect(wrapper.find('[role="computed-age"]').text()).toBe('13');

		wrapper.destroy();

	});

	test('mobx reaction should be disposed while component destroyed', () => {

		const spy = jest.fn();
		const $destroy = DecoratedClassBase.prototype.$destroy;
		DecoratedClassBase.prototype.$destroy = function (this: any, ...args: any[]) {
			$destroy.apply(this, args);
			spy();
		};

		wrapper.destroy();
		expect(spy.mock.calls.length).toBe(1);
	});

});
//
test('compatible with traditional component definition', () => {

	const Component = observer({
		name: 'HelloWorld',
		data() {
			return { name: 'kuitos', model: new Model() };
		},
		methods: {
			setName(this: any) {
				this.name = 'lk';
			},
		},
		render(this: any, h: CreateElement) {
			return h('button', {
				on: { click: this.model.setAge, focus: this.setName }, domProps: { textContent: `${this.model.age} ${this.name}` },
			});
		},
	});
	const wrapper = shallowMount(Component);
	wrapper.trigger('click');
	expect(wrapper.find('button').text()).toBe('11 kuitos');
	wrapper.trigger('focus');
	expect(wrapper.find('button').text()).toBe('11 lk');
});

test('component lifecycle should worked well', () => {

	const Component = observer({
		name: 'HelloWorld',
		data() {
			return { model: new Model() };
		},
		beforeCreate(this: any) {
			expect(this.model).toBeUndefined();
		},
		created(this: any) {
			expect(this.model.age).toBe(10);
		},
		beforeUpdate(this: any) {
			expect(this.model.age).toBe(11);
		},
		updated(this: any) {
			expect(this.model.age).toBe(11);
		},
		render(this: any, h: CreateElement) {
			return h('button', {
				on: { click: this.model.setAge }, domProps: { textContent: this.model.age },
			});
		},
	});

	const wrapper = shallowMount(Component);
	wrapper.trigger('click');

});

test('conditional render should be re tracked', () => {

	const wrapper = shallowMount(Conditional);
	expect(wrapper.find('[role=age]').text()).toBe('10');
	wrapper.find('[role=toggle]').trigger('click');
	expect(wrapper.find('[role=count]').text()).toBe('0');
	wrapper.find('[role=increase]').trigger('click');
	expect(wrapper.find('[role=count]').text()).toBe('1');
});

test('mobx state should not be collect by vue', () => {

	class ObservableModel {
		@observable name = '';
	}

	const model1 = observable({ xx: 10 });

	class Model {
	}

	@Observer
	@Component
	class App extends Vue {

		model = new Model();
		om = new ObservableModel();
		om1 = model1;
		age = 10;

		render(h: CreateElement) {
			return h('div');
		}
	}

	const vm = shallowMount(App).vm;

	expect(vm.$data.hasOwnProperty('om')).toBeFalsy();
	expect(vm.$data.hasOwnProperty('om1')).toBeFalsy();
	expect(vm.$data.hasOwnProperty('age')).toBeTruthy();
	expect(vm.$data.hasOwnProperty('model')).toBeTruthy();
});
