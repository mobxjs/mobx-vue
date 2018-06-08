<template>
	<section>
		<p role="age" v-text="model.age"></p>
		<button role="increase" @click="model.increase"></button>
		<button role="toggle" @click="model.toggle"></button>
		<div v-if="model.show">
			<p role="count" v-text="model.count"></p>
		</div>
	</section>
</template>

<script lang="ts">

	import { action, observable } from "mobx";
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Observer } from "../../observer";

	class Model {
		@observable
		age = 10;

		@observable
		show = false;

		@observable
		count = 0;

		@action.bound
		setAge() {
			this.age++;
		}

		@action.bound
		toggle() {
			this.show = !this.show;
		}

		@action.bound
		increase() {
			this.count++;
		}

	}

	@Observer
	@Component
	export default class Conditional extends Vue {
		model = new Model();
	}
</script>
