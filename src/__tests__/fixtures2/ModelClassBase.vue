<template>
	<section>
		<p role="age" v-text="model.age"></p>
		<p role="computed-age" v-text="model.computedAge"></p>
		<button @click="model.setAge"></button>
	</section>
</template>

<script lang="ts">

	import { action, computed, observable, makeAutoObservable } from "mobx";
	import Vue from "vue";
	import Component from "vue-class-component";

	class Model {
    constructor () {
			makeAutoObservable(this, { }, { autoBind: true });
		}

		age = 10;

		get computedAge() {
			return this.age + 1;
		}

		setAge() {
			this.age++;
		}
	}

	@Component
	export default class ModelClassBase extends Vue {
		model = new Model();
	}
</script>
