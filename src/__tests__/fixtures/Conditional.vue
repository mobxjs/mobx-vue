<template>
	<section>
		<p role="age" v-text="age"></p>
		<button role="increase" @click="increase"></button>
		<button role="toggle" @click="toggle"></button>
		<div v-if="show">
			<p role="count" v-text="count"></p>
		</div>
	</section>
</template>

<script lang="ts">

	import { action, observable } from "mobx";
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Connect } from "../../connect";

	class Model {
		@observable
		age = 10;

		@observable
		show = false;

		@observable
		count = 0;

		@action
		setAge() {
			this.age++;
		}

		@action
		toggle() {
			this.show = !this.show;
		}

		@action
		increase() {
			this.count++;
		}

	}

	@Connect(new Model())
	@Component()
	export default class Conditional extends Vue {
	}
</script>
