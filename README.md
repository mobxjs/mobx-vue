# mobx-vue

[![npm version](https://img.shields.io/npm/v/mobx-vue.svg?style=flat-square)](https://www.npmjs.com/package/mobx-vue)
[![coverage](https://img.shields.io/codecov/c/github/mmlpxjs/mobx-vue.svg?style=flat-square)](https://codecov.io/gh/mmlpxjs/mobx-vue)
[![npm downloads](https://img.shields.io/npm/dt/mobx-vue.svg?style=flat-square)](https://www.npmjs.com/package/mobx-vue)
[![Build Status](https://img.shields.io/travis/mmlpxjs/mobx-vue.svg?style=flat-square)](https://travis-ci.org/mmlpxjs/mobx-vue)

Vue bindings for MobX, inspired by [mobx-react](https://github.com/mobxjs/mobx-react)

![logo](https://github.com/mmlpxjs/mobx-vue/blob/master/logo.png?raw=true)

## Installation

```bash
npm i mobx-vue -S
```

or

```bash
yarn add mobx-uve
```

## Why mobx-vue 

MobX is an unopinionated, scalable state management, which can make our programming more intuitive.

Unlike the other vue-rx-inspired libraries which based the plugin mechanism of vue, mobx-vue is more simple that you just need to connect your state to vue component without any component definition changed like [react-redux](https://github.com/reactjs/react-redux) does,  then your component will react to your state changes automatically.

And, the most important is that you can build a view-library-free application with mobx which manages your app state, if you wanna migrate to another view library(React/Angular) someday, rewrite the template and switch to the relevant mobx connector([mobx-react](https://github.com/mobxjs/mobx-react),[mobx-angular](https://github.com/mobxjs/mobx-angular),[mobx-angularjs](https://github.com/mobxjs/mobx-angularjs)) is all you have to do.

Related reading: [Why MobX + movue, instead of Vuex?](https://github.com/nighca/movue/issues/8)

## Usage

We highly recommend using the bindings with [vue-class-component](https://github.com/vuejs/vue-class-component) decorator, and define the Store/ViewModel independently.

```ts
import { action, computed, observable } from "mobx";
export default class ViewModel {
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
```

```vue
<template>
    <section>
        <p v-text="age"></p>
        <p v-text="computedAge"></p>
        <button @click="setAge"></button>
    </section>
</template>

<script lang="ts">
    import { Connect } from "mobx-vue";
    import Vue from "vue";
    import Component from "vue-class-component";
    import ViewModel from './ViewModel';

    @Connect(new ViewModel())
    @Component()
    export default class App extends Vue {
        created() { 
            console.log(this.age);
        }
    }
</script>
```

Or used with the traditional way:

```vue
<script lang="ts">
    import { connect } from "mobx-vue";
    import Vue from "vue";
    import Component from "vue-class-component";
    import ViewModel from './ViewModel';

    export default connect(new ViewModel())({ 
        created() { console.log(this.age) 
    }})
</script>
```

What we need is just connect the Store/ViewModel with your vue component. No more reactive data definations in component.



## API

* connect(viewModel)(VueComponent | options): ExtendedVueComponent
