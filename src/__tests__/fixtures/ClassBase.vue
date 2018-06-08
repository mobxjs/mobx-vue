<template>
	<section>
		<p role="age" v-text="model.age"></p>
		<button @click="model.setAge"></button>
	</section>
</template>

<script lang="ts">

	import { observable } from "mobx";
	import Vue from "vue";
	import Component from "vue-class-component";

	const model = observable.object({
		age: 10,
		setAge() {
			model.age++;
		},
	});

	@Component
	export default class ClassBase extends Vue {
		model = model;
	}
</script>
