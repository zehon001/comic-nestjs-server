<template>
	<v-container class="pa-0">
		<v-loading :loading="loading"></v-loading>
		<v-row
			v-if="!loading"
			justify='center'
			class="py-0"
		>
			<v-col
				cols="24"
				md="7"
				class="pa-0"
			>
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
						>{{ `(${beautySub(data.name||"",10)}) ${index+1}/${data.pages}`}}</v-row>
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

	data: any = {
		images: [],
		pages: 0, //总页数
		pre: null, //上一话
		next: null //下一话
	};
	ret: any = {};

	async fetch() {
		this.loading = true;
		const res = await this.$http.get(
			"/parseseason?id=" + this.$route.query.id
		);
		if (res.data.data) {
			this.data = res.data.data.season;
			this.data.pages = this.data.images.length;
			this.data.pre = res.data.data.pre;
			this.data.next = res.data.data.next;

			this.ret = res.data;
			console.log(this.data);
			this.loading = false;
		}
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

	beautySub(str, len) {
		var reg = /[\u4e00-\u9fa5]/g;
		//汉字数量
		var chineseCharNum = ~~(str.match(reg) && str.match(reg).length);
		//真实长度
		var realen = str.length + chineseCharNum;
		//限制的长度
		var limitlen = len * 2;
		if (limitlen >= realen) return str;
		else {
			//裁剪
			var slice = str.substr(0, limitlen);
			//剩余汉字数量
			chineseCharNum = ~~(slice.match(reg) && slice.match(reg).length);
			//去掉汉字多余的长度
			limitlen -= chineseCharNum;
			return str.substr(0, limitlen) + "...";
		}
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