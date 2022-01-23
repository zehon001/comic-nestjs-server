<template>
	<v-container class="pa-0">
		<v-loading :loading="loading"></v-loading>
		<v-custom-panel
			v-if="!loading"
			class="py-0"
		>
			<v-custom-panel-content class="pa-0">
				<!-- 图片区域 -->
				<v-card
					class='px-0 py-2'
					tile
				>
					<v-col
						v-for="(item,index) in data.images"
						:key="item"
						class="py-0 px-2"
					>
						<v-img
							min-height="500"
							:src="item"
						> </v-img>
						<v-row
							class="px-0 py-2 ma-0"
							justify='center'
						>{{ `(${$tools.beautySub(data.name||"",10)}) ${index+1}/${data.pages}`}}</v-row>
					</v-col>
				</v-card>
				<!-- 按钮 -->
				<v-card class="mt-3 py-3">
					<v-row
						justify='center'
						class="ma-0 pa-0"
					>
						<v-btn
							class='primary mr-9'
							@click="openSeason(data.pre)"
							:disabled="!data.pre"
						>上一章</v-btn>
						<v-btn
							class='primary mr-9'
							:to="`/comic?id=${data.comic}`"
						>返回目录</v-btn>
						<v-btn
							class='primary'
							@click="openSeason(data.next)"
							:disabled="!data.next"
						>下一章</v-btn>
					</v-row>
				</v-card>
			</v-custom-panel-content>
		</v-custom-panel>
	</v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { DBSeasonType } from "../tools/db.adapter.types";
import {FileSaverUtil} from "../../filesaver";

@Component({})
export default class Search extends Vue {
	loading: boolean = true;
	// error: boolean = true;

	data: DBSeasonType = new DBSeasonType();
	get adapter() {
		return this.$tools.dbAdapter;
	}
	async fetch() {
		this.loading = true;
		this.data = await this.adapter.getSeason(
			this.$route.query.id as string
		);
		console.log(this.data.images);
		FileSaverUtil.filesToRar(this.data.images,"test.zip")
		this.loading = false;
	}
	mounted() {
		this.fetch();
		console.log(this.$route);
	}
	/**直接用to 按钮会变浅色 */
	openSeason(id: string) {
		this.$router.push({
			path: "/season",
			query: { id: id }
		});
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
</style>