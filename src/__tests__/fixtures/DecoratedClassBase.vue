<template>
	<section>
		<p role="age" v-text="age"></p>
		<p role="computed-age" v-text="computedAge"></p>
		<button @click="setAge"></button>
	</section>
</template>

<script lang="ts">

	import { action, computed, observable } from "mobx";
	import Vue from "vue";
	import Component from "vue-class-component";
	import { Connect } from "../../connect";

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

	@Connect(new Model())
	@Component()
	export default class DecoratedClassBase extends Vue {}
</script>
