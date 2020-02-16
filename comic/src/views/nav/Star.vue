<template>
	<v-container class="pa-1">
		<v-loading :loading="loading" />
		<div
			v-if="!loading"
			class="title font-weight-bold"
		>收藏</div>
		<div class="mt-2" />
		<v-row
			v-if="!loading"
			align='start'
			justify='start'
		>
			<v-col
				v-for="item in items"
				:key="item._id"
				class="px-0 py-2"
			>
				<v-card
					:to="`/comic?id=${item._id}`"
					class="card mx-auto"
				>
					<div>
						<div class="card-img-area">
							<v-img
								class="card-img"
								:src="item.cover"
							></v-img>
						</div>
					</div>
					<div class="subtitle-2 pl-0 pt-2">
						{{$tools.beautySub(item.name,10)}}
					</div>

					<v-card-subtitle class='caption pl-0 py-0'>
						{{`类型：${item.tag}`}}

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
export default class Star extends Vue {
	loading: boolean = true;
	// error: boolean = true;

	items: any[] = [];
	get adapter() {
		return this.$tools.dbAdapter;
	}

	async fetch() {
		this.loading = true;
		this.items = await this.adapter.getStars();
		console.log(this.items);
		this.loading = false;
	}
	mounted() {
		this.fetch();
	}
}
</script>

<style>
.card {
	width: 11em;
	height: 19.5em;
	max-height: 19.5em;
}
.card-img-area {
	height: 60%;
	padding-top: 2px;
}
.card-img {
}
</style>