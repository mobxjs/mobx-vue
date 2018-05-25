<template>
	<section>
		<p v-text="age"></p>
		<button @click="setAge"></button>
	</section>
</template>

<script lang="ts">
	export default {
		name: 'Base'
	}
</script>
