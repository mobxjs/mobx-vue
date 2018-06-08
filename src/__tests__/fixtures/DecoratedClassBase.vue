<template>
	<section>
		<p role="age" v-text="model.age"></p>
		<p role="computed-age" v-text="model.computedAge"></p>
		<button @click="model.setAge"></button>
	</section>
</template>

<script lang="ts">

	import { action, computed, observable } from "mobx";
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Observer } from "../../observer";

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

	@Observer
	@Component
	export default class DecoratedClassBase extends Vue {
		model = new Model();
	}
</script>
