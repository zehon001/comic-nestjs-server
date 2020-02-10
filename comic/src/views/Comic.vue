<template>
	<v-container class="pa-1">
		<v-loading :loading="loading" />
		<!-- 漫画介绍 -->
		<v-row
			v-if="!loading"
			justify='center'
		>
			<v-col
				cols="24"
				md="7"
				class="px-0"
			>
				<v-card class="">
					<v-container>
						<v-row justify='space-between'>
							<v-col
								cols="24"
								md="6"
							>
								<v-img :src="data.comic.cover" />
							</v-col>
							<v-col
								cols="24"
								md="6"
							>
								<v-card-title class="px-0">{{data.comic.name+data.comic.name}}</v-card-title>
								<v-card-subtitle class="px-0 py-1">{{"类型："+data.comic.tag}}</v-card-subtitle>
								<v-card-subtitle class="px-0 py-1">{{"作者："+data.comic.author}}</v-card-subtitle>
								<v-card-subtitle class="px-0 py-1">{{"最后更新："+data.comic.lastUpdateAt}}</v-card-subtitle>
								<v-card-subtitle class="px-0 py-1">{{"暂无介绍"}}</v-card-subtitle>
							</v-col>
						</v-row>
					</v-container>
				</v-card>
			</v-col>
			<!-- 集列表 -->
			<v-seasons-list
				title="分集列表"
				:data="data.comic.seasons"
			></v-seasons-list>

			<!-- 番外列表 -->
			<v-seasons-list
				title="番外列表"
				:data="data.comic.seasons_other"
			></v-seasons-list>

			<!-- 单行本 -->
			<v-seasons-list
				title="单行本"
				:data="data.comic.seasons_book"
			></v-seasons-list>
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
	data: any = {
		comic: {
			seasons: [],
			seasons_other: [],
			seasons_book: []
		}
	};

	async fetch() {
		this.loading = true;
		const res = await this.$http.get(
			"/parsecomic?id=" + this.$route.query.id
		);
		this.data = res.data.data || {
			comic: {
				seasons: [],
				seasons_other: [],
				seasons_book: []
			}
		};
		const seasons = this.data.comic.seasons || [];
		seasons.sort(function(a, b) {
			return b.sidx - a.sidx;
		});
		this.data.comic.seasons = [];
		this.data.comic.seasons_other = [];
		this.data.comic.seasons_book = [];
		seasons.map(s => {
			switch (s.type) {
				case "normal":
					this.data.comic.seasons.push(s);
					break;
				case "other":
					this.data.comic.seasons_other.push(s);
					break;
				case "book":
					this.data.comic.seasons_book.push(s);
					break;
			}
		});
		// console.log(res.data);
		console.log(this.data);
		this.loading = false;
	}
	mounted() {
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