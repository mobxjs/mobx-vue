<template>
	<section>
		<p role="age" v-text="model.age"></p>
		<p role="computed-age" v-text="model.computedAge"></p>
		<div ref="not-there" v-if="model.notInModel">I should never exist</div>
		<button @click="model.setAge"></button>
	</section>
</template>

<script lang="ts">

	import { action, computed, observable } from "mobx";
	import Vue from "vue";
	import { Component, Prop } from "vue-property-decorator";
	import { Observer } from "../../observer";

	class Model {
		@observable
		age = 10;

		@observable
		ageIncrement = 1;

		@computed
		get computedAge() {
			return this.age + this.ageIncrement;
		}

		@action.bound
		setAge() {
			this.age++;
		}
	}

	@Observer
	@Component
	export default class DecoratedClassBase extends Vue {
		@Prop() age!: number;
		@Prop() ageIncrement!: number;
		@Prop() notInModel!: any;
		model = new Model();
	}
</script>
