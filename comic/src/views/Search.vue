<template>
	<v-container class="pa-0   align-self-start">
		<v-loading :loading="loading" />
		<div
			v-if="!loading"
			class="title font-weight-bold mx-1"
		>{{`搜索 "${$tools.beautySub($route.query.content,6)}" 结果共 ${items.length} 条`}}</div>

		<v-row
			v-if="!loading"
			class="pa-0 ma-0"
		>
			<v-col
				v-for="item in items"
				:key="item._id"
				class="px-0 py-2"
				cols="6"
				md="2"
			>

				<v-card
					:to="`/comic?id=${item._id}`"
					class="mx-1"
					min-height="20em"
				>
					<v-img
						:src="item.cover"
						height="15em"
					></v-img>

					<div class="subtitle-2 pl-0 pt-2">
						{{$tools.beautySub(item.name,10)}}
					</div>

					<v-card-subtitle class='caption pl-0 py-0'>
						<!-- {{`类型：${item.tag}，来源：M99770`}} -->
						{{"来源：99770漫画"}}
					</v-card-subtitle>
					<v-card-subtitle class='caption pl-0 pt-0 pb-0'>
						{{`更新：${item.lastUpdateAt}`}}
					</v-card-subtitle>

					<v-expand-transition>

					</v-expand-transition>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
@Component({})
export default class Search extends Vue {
	loading: boolean = true;
	// error: boolean = true;

	items: any[] = [];
	get adapter() {
		return this.$tools.dbAdapter;
	}

	async fetch() {
		this.loading = true;
		this.items = await this.adapter.search(this.$route.query.content);
		console.log(this.items);
		this.loading = false;
	}
	mounted() {
		this.fetch();
		console.log(this.$route);
	}
}
</script>

<style>
</style>