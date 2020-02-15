<template>
	<v-container class="pa-0">
		<v-loading :loading="loading"></v-loading>
		<v-custom-panel
			v-if="!loading"
			class="py-0"
		>

			<v-custom-panel-content>
				<v-card class="mx-10">
					<v-card-title>漫画在线</v-card-title>
					<v-card-subtitle class="pt-4 pb-2">作者：Azusako</v-card-subtitle>
					<v-card-subtitle class="py-2">版本：v1.0.0</v-card-subtitle>
				</v-card>
			</v-custom-panel-content>
		</v-custom-panel>
	</v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Help extends Vue {
	loading: boolean = false;
}
</script>

<style>
</style>