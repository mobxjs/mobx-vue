/**
 * @author iChenLei
 * @homepage https://github.com/iChenLei/
 * @since 2021-06-17 18:49
 */
import { shallowMount } from '@vue/test-utils';
import { action, computed, makeObservable, observable } from 'mobx';
import Vue, { CreateElement } from 'vue';
import Component from 'vue-class-component';
import { Observer, observer } from '../observer';

class Model {
  age = 10;

  constructor () {
    makeObservable(this, {
      age: observable,
      computedAge: computed,
      setAge: action.bound,
    });
  }

  get computedAge() {
    return this.age + 1;
  }

  setAge () {
    this.age++;
  }
}

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

test('mobx state should not be collect by vue', () => {

  class ObservableModel {
    name = '';
    constructor () {
      makeObservable(this, {
        name: observable,
      });
    }
  }

  const prop = (value: string): any => () => {
    return {
      configurable: true,
      get() {
        return value;
      },
    };
  };

  const model1 = observable({ xx: 10 });

  class Model {
  }

  @Observer
  @Component
  class App extends Vue {

    @prop('kuitos')
    name!: string;

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

  expect(vm.name).toBe('kuitos');
  expect(vm.$data.hasOwnProperty('name')).toBeFalsy();
});
