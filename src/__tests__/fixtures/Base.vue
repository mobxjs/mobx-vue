<template>
	<section>
		<p v-text="model.age"></p>
		<button @click="model.setAge"></button>
	</section>
</template>

<script lang="ts">

	import { observable } from "mobx";

	export default {
		name: "Base",
		data() {
			const model = observable.object({
				age: 10,
				setAge() {
					model.age++;
				},
			});

			return { model };
		},
	};
</script>
