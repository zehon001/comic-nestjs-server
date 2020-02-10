<template>
	<v-col
		cols="24"
		:md="md?md:7"
		class="px-0"
		v-if="data&&data.length>0"
	>
		<v-col class="px-0">
			<div class="title font-weight-bold">{{title}}</div>
		</v-col>
		<v-col class="px-0">
			<v-card>
				<v-container>
					<v-btn
						v-for="item in data"
						:key="item._id"
						:to="`/season?id=${item._id}`"
						block
						justify="start"
						class="mb-3 backgroud3"
					>
						<div>{{beautySub(item.name,contentLen || 18)}}</div>

					</v-btn>
				</v-container>
			</v-card>
		</v-col>
	</v-col>
</template>

<script lang='ts'>
import { Vue, Component, Prop } from "vue-property-decorator";
/**分集列表 */
@Component({})
export default class SeasonList extends Vue {
	@Prop(String) title: string;
	@Prop(Array) data: Array<any>;
	@Prop(Number) contentLen: number;
	@Prop(Number) md: number;

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
</style>