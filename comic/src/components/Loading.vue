<template>
	<v-container v-if="loading">
		<v-col
			align='center'
			justify='center'
		>
			<v-progress-circular
				:size="50"
				:width="7"
				color="primary"
				indeterminate
			>
			</v-progress-circular>

			<div class="subtitle-1 mt-5">
				{{msg?msg:'请稍后...'}}
			</div>
		</v-col>
	</v-container>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
/**加载转圈圈 */
@Component({})
export default class Loading extends Vue {
	@Prop(Boolean) loading: boolean;

	@Prop(String) msg: string;
}
</script>

<style>
</style>