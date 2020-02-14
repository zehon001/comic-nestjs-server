<template>
	<v-row justify='center'>
		<slot></slot>
	</v-row>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
@Component({})
export default class CustomPanel extends Vue {}
</script>

<style>
</style>