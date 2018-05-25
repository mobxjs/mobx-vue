<template>
	<section>
		<p role="age" v-text="age"></p>
		<p role="computed-age" v-text="computedAge"></p>
		<button @click="setAge"></button>
	</section>
</template>

<script lang="ts">

	import Vue from 'vue';
	import Component from 'vue-class-component';

	@Component()
    export default class ClassBase extends Vue {}
</script>
