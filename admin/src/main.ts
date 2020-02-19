import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import "./plugins/element";
import "./plugins/avue";

Vue.config.productionTip = false;

const $http = axios.create({
	baseURL: "http://www.leronggame.cn/comic_admin_api"
	// baseURL: "http://localhost:9030/comic_admin_api"
});

Vue.prototype.$http = $http;

Vue.prototype.$httpajax = $http;

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
