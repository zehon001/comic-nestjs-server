<template>
	<v-col
		:cols="cols?cols:24"
		:md="md?md:7"
		class="px-0"
	>
		<v-row
			justify='center'
			v-if="center"
		>
			<slot></slot>
		</v-row>
		<slot v-else></slot>
	</v-col>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({})
export default class CustomPanelContent extends Vue {
	@Prop(Number) cols: number;
	@Prop(String) md: string;
	@Prop(Boolean) center: boolean;
}
</script>

<style>
</style>