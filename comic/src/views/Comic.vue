<template>
	<v-container class="pa-1">
		<v-loading :loading="loading" />
		<!-- 漫画介绍 -->
		<v-custom-panel v-if="!loading">
			<v-custom-panel-content>
				<v-card class="">
					<v-container>
						<v-row justify='space-between'>
							<v-col
								cols="24"
								md="6"
							>
								<v-img :src="data.cover" />
							</v-col>
							<v-col
								cols="24"
								md="6"
							>
								<v-card-title class="px-0">{{data.name}}</v-card-title>
								<v-card-subtitle class="px-0 py-1">{{"类型："+data.tag}}</v-card-subtitle>
								<v-card-subtitle class="px-0 py-1">{{"作者："+data.author}}</v-card-subtitle>
								<v-card-subtitle class="px-0 py-1">{{"最后更新："+data.lastUpdateAt}}</v-card-subtitle>
								<v-card-subtitle class="px-0 py-1">{{"暂无介绍"}}</v-card-subtitle>
							</v-col>
						</v-row>
					</v-container>
				</v-card>

				<!-- 集列表 -->
				<v-seasons-list
					class="pt-3"
					title="分集列表"
					:data="data.seasons"
				></v-seasons-list>

				<!-- 番外列表 -->
				<v-seasons-list
					title="番外列表"
					:data="data.seasons_other"
				></v-seasons-list>

				<!-- 单行本 -->
				<v-seasons-list
					title="单行本"
					:data="data.seasons_book"
				></v-seasons-list>
			</v-custom-panel-content>

		</v-custom-panel>

	</v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { DBComicType } from "../tools/db.adapter.types";

@Component({})
export default class Search extends Vue {
	loading: boolean = true;
	// error: boolean = true;

	items: any[] = [];
	data: DBComicType = new DBComicType();
	get adapter() {
		return this.$tools.dbAdapter;
	}
	async fetch() {
		this.loading = true;
		this.data = await this.adapter.getComic(this.$route.query.id as string);
		this.loading = false;
	}
	created() {
		// console.log("页面创建");
	}
	mounted() {
		// console.log("渲染完毕");
		this.fetch();
		// console.log(this.$route);
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
	width: 100%;
}
.bg-blue {
	background: blue;
	width: 100%;
}
</style>