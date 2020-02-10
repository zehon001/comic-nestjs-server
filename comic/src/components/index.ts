import Vue from "vue";
import Loading from "./Loading.vue";
import SeasonList from "./SeasonList.vue";

export default {
	init() {
		Vue.component("v-loading", Loading);
		Vue.component("v-seasons-list", SeasonList);
	},
	Loading
};
