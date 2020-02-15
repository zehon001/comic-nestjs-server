<template>
	<v-container class="pa-0">
		<v-loading :loading="loading"></v-loading>
		<v-custom-panel
			v-if="!loading"
			class="py-0"
		>

			<v-custom-panel-content>
				<div class="mx-10">
					<v-card>
						<v-container>
							<v-row
								justify='space-between'
								align='center'
								class="pa-0 ma-0"
							>
								<v-col>主题颜色</v-col>
								<v-switch
									v-model="$vuetify.theme.dark"
									:label="themeDarkName"
								></v-switch>
							</v-row>
						</v-container>
						<v-divider
							class="mx-4"
							:insert="true"
							vertical
						></v-divider>
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
	settings: any = this.$tools.dbAdapter.getSettings();
	get themeDarkName() {
		return this["$vuetify"].theme.dark ? "深色" : "亮色";
	}

	saveSettings() {
		this.settings.themeDark = this["$vuetify"].theme.dark;
		this.$tools.dbAdapter.updateSetttings(this.settings);
	}
}
</script>

<style>
</style>