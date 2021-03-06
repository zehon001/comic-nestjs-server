import Vue from "vue";
import Loading from "./Loading.vue";
import SeasonList from "./SeasonList.vue";

import CustomPanel from "./CustomPanel.vue";
import CustomPanelContent from "./CustomPanelContent.vue";

import LoginDialog from "./LoginDialog.vue";
import RegisterDialog from "./RegisterDialog.vue";

export default {
	init() {
		Vue.component("v-loading", Loading);
		Vue.component("v-seasons-list", SeasonList);
		Vue.component("v-custom-panel", CustomPanel);
		Vue.component("v-custom-panel-content", CustomPanelContent);

		Vue.component("v-login-dialog", LoginDialog);
		Vue.component("v-register-dialog", RegisterDialog);
	},
	Loading
};
