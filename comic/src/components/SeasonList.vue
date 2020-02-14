<template>
	<div v-if="data&&data.length>0">
		<v-col class="px-0">
			<div class="title font-weight-bold">{{title}}</div>
		</v-col>
		<v-col class="px-0">
			<v-expansion-panels
				v-model="panels"
				accordion
				multiple
			>
				<v-expansion-panel>
					<v-expansion-panel-header></v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-btn
							v-for="item in data"
							:key="item._id"
							:to="`/season?id=${item._id}`"
							block
							justify="start"
							class="mb-3 backgroud3"
						>
							<div>{{$tools.beautySub(item.name,contentLen || 18)}}</div>
						</v-btn>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-col>

	</div>

</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
/**分集列表 */
@Component({})
export default class SeasonList extends Vue {
	@Prop(String) title: string;
	@Prop(Array) data: Array<any>;
	@Prop(Number) contentLen: number;
	@Prop(Boolean) close: boolean;

	panels: Array<number> = [0];

	created() {
		this.panels = this.close ? [] : [0];
	}
}
</script>

<style>
</style>