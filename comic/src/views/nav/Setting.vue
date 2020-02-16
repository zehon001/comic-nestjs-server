<template>
	<v-container class="pa-0">
		<v-loading :loading="loading"></v-loading>
		<v-custom-panel
			v-if="!loading"
			class="py-0"
		>

			<v-custom-panel-content>
				<div>
					<v-card>
						<v-container>
							<v-row
								justify='space-between'
								align='center'
								class="pa-0 ma-0"
							>
								<v-col>主题风格</v-col>
								<v-switch
									class="mr-3"
									v-model="$vuetify.theme.dark"
									:label="themeDarkName"
								></v-switch>
							</v-row>

						</v-container>
					</v-card>
					<v-card class="mt-3">
						<v-container>
							<v-list
								subheader
								border='left'
								flat
							>
								<v-col class="pb-0">解析器选择</v-col>
								<v-col class="pt-1">
									<div
										class='overline'
										style="opacity:0.7"
									>(解析器选得越多搜索速度越慢)</div>
								</v-col>
								<v-list-item-group multiple>
									<v-list-item @click="onAllParserSelect">
										<v-list-item-action>
											<v-checkbox
												:indeterminate="all_parser_indeterminate"
												v-model="allParserCheck"
												color="primary"
												:ref="`parser_check_${100}`"
												@click="onAllParserSelect"
											></v-checkbox>
										</v-list-item-action>

										<v-list-item-content>
											<v-list-item-subtitle>全选</v-list-item-subtitle>
										</v-list-item-content>
									</v-list-item>
								</v-list-item-group>
								<v-divider></v-divider>
								<v-sheet>

									<v-list-item-group multiple>
										<v-list-item
											v-for="item in parsers"
											:key="item"
											@click="onParserClick(item)"
										>
											<v-list-item-action>
												<v-checkbox
													:value="item"
													v-model="selectParsers"
													color="primary"
													@click="onParserClick(item)"
												></v-checkbox>
											</v-list-item-action>

											<v-list-item-content>
												<v-list-item-subtitle>{{item}}</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-list-item-group>
								</v-sheet>
							</v-list>

						</v-container>
					</v-card>

					<v-row class="py-2"></v-row>
					<v-card class="py-2">
						<v-row justify='center'>
							<v-btn
								class='px-10 primary'
								@click="saveSettings"
							>保存</v-btn>
						</v-row>
					</v-card>
				</div>

			</v-custom-panel-content>
		</v-custom-panel>
	</v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
// import { DBSettingType } from "../../tools/db.adapter.types";

@Component({})
export default class Setting extends Vue {
	loading: boolean = false;
	all_parser_indeterminate: boolean = false;
	allParserCheck: boolean = false;
	selectParsers: Array<string> = [];
	parsers = [
		"酷酷漫画",
		"99770漫画",
		"百年漫画",
		"动漫之家1",
		"动漫之家2",
		"动漫之家3"
	];

	settings: any = this.$tools.dbAdapter.getSettings();
	get themeDarkName() {
		return this["$vuetify"].theme.dark ? "黑夜" : "白天";
	}

	async fetch() {
		this.parsers = await this.$tools.dbAdapter.getParserNames();
		this.selectParsers = this.settings.selectParsers || [];
		//清除不在现有列表的选择
		for (let i = this.selectParsers.length - 1; i >= 0; i--) {
			if (this.parsers.indexOf(this.selectParsers[i]) < 0) {
				this.selectParsers.splice(i, 1);
			}
		}
		console.log(this.selectParsers);
		this.updateAllParserCheck();
	}

	mounted() {
		this.fetch();
	}

	saveSettings() {
		this.settings.themeDark = this["$vuetify"].theme.dark;
		this.settings.selectParsers = this.selectParsers;
		this.$tools.dbAdapter.updateSetttings(this.settings);
		console.log(this.selectParsers);
	}

	onParserClick(name) {
		const idx = this.selectParsers.indexOf(name);
		if (idx >= 0) this.selectParsers.splice(idx, 1);
		else this.selectParsers.push(name);

		this.updateAllParserCheck();
	}
	onAllParserSelect() {
		this.allParserCheck = !this.allParserCheck;
		this.selectParsers = [];
		if (this.allParserCheck) {
			for (let i = 0; i < this.parsers.length; i++) {
				this.selectParsers.push(this.parsers[i]);
			}
		}
	}

	updateAllParserCheck() {
		if (this.selectParsers.length == 0) {
			this.allParserCheck = false;
			this.all_parser_indeterminate = false;
		} else if (this.selectParsers.length == this.parsers.length) {
			this.allParserCheck = true;
			this.all_parser_indeterminate = false;
		} else {
			this.allParserCheck = false;
			this.all_parser_indeterminate = true;
		}
	}
}
</script>

<style>
.m-border {
	border-radius: 10px;
	border: thin solid;
}
</style>