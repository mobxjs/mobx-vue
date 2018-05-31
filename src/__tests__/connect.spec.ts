/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-05-24 13:36
 */
import { shallowMount } from '@vue/test-utils';
import { action, computed, observable } from 'mobx';
import { CreateElement } from 'vue/types/vue';
import { connect } from '../connect';
import Base from './fixtures/Base.vue';
import ClassBase from './fixtures/ClassBase.vue';
import DecoratedClassBase from './fixtures/DecoratedClassBase.vue';

class Model {
	@observable
	age = 10;

	@computed
	get computedAge() {
		return this.age + 1;
	}

	@action
	setAge() {
		this.age++;
	}
}

test('connect with a object literal component', () => {

	const model = observable({
		age: 10,
		setAge() {
			this.age++;
		},
	});

	const Component = connect(model)({
		name: 'HelloWorld',
		render(this: any, h: CreateElement) {
			return h('button', {
				on: { click: this.setAge }, domProps: { textContent: this.age },
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

test('connect with a base component', () => {

	const model = observable({
		age: 10,
		setAge() {
			this.age++;
		},
	});

	const Component = connect(model)(Base);

	const wrapper = shallowMount(Component);
	expect(wrapper.name()).toBe(Base.name);
	expect(wrapper.find('p').text()).toBe('10');

	wrapper.find('button').trigger('click');
	expect(wrapper.find('p').text()).toBe('11');

	wrapper.destroy();

});

test('connect with a class component', () => {

	const model = observable({
		age: 10,
		setAge() {
			this.age++;
		},
	});

	const Component = connect(model)(ClassBase);

	const wrapper = shallowMount(Component);
	expect(wrapper.name()).toBe(ClassBase.name);
	expect(wrapper.find('[role="age"]').text()).toBe('10');

	wrapper.find('button').trigger('click');
	expect(wrapper.find('[role="age"]').text()).toBe('11');

	wrapper.destroy();
});

test('use connect function with class component and observable model constructed by class', () => {

	const model = new Model();

	// clear vue component constructor cache
	(ClassBase as any).options._Ctor = {};
	const Component = connect(model)(ClassBase);

	const wrapper = shallowMount(Component);
	expect(wrapper.name()).toBe(ClassBase.name);
	expect(wrapper.find('[role="age"]').text()).toBe('10');
	expect(wrapper.find('[role="computed-age"]').text()).toBe('11');

	wrapper.find('button').trigger('click');
	expect(wrapper.find('[role=age]').text()).toBe('11');
	expect(wrapper.find('[role="computed-age"]').text()).toBe('12');

	wrapper.destroy();

});

describe('use connect decorator with class component and observable model constructed by class', () => {

	const wrapper = shallowMount(DecoratedClassBase);
	test('component should be reactive', () => {

		expect(wrapper.name()).toBe((DecoratedClassBase as any).options.name);
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

test('compatible with traditional component definition', () => {

	const model = new Model();
	const Component = connect(model)({
		name: 'HelloWorld',
		data() {
			return { name: 'kuitos' };
		},
		methods: {
			setName(this: any) {
				this.name = 'lk';
			},
		},
		render(this: any, h: CreateElement) {
			return h('button', {
				on: { click: this.setAge, focus: this.setName }, domProps: { textContent: `${this.age} ${this.name}` },
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

	const model = new Model();
	const Component = connect(model)({
		name: 'HelloWorld',
		beforeCreate(this: any) {
			expect(this.age).toBeUndefined();
		},
		created(this: any) {
			expect(this.age).toBe(10);
		},
		beforeUpdate(this: any) {
			expect(this.age).toBe(11);
		},
		updated(this: any) {
			expect(this.age).toBe(11);
		},
		render(this: any, h: CreateElement) {
			return h('button', {
				on: { click: this.setAge }, domProps: { textContent: this.age },
			});
		},
	});

	const wrapper = shallowMount(Component);
	wrapper.trigger('click');

});
