import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import vuetify from "./plugins/vuetify";
import router from "./router";
import components from "./components/index";
import Tools from "./tools/tools";
import AppDF from "./app.define";

Vue.config.productionTip = false;

const $http = axios.create({
	baseURL: AppDF.SERVER_URL
});

Vue.prototype.$http = $http;

Vue.prototype.$httpajax = $http;

Vue.prototype.$tools = Tools.instance;

components.init();

new Vue({
	vuetify,
	router,
	render: h => h(App)
}).$mount("#app");
