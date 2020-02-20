import Vue from "vue";
import axios from "axios";
import App from "./App.vue";
import router from "./router";
import "./plugins/element";
import "./plugins/avue";
import AppDF from "./app.define";

Vue.config.productionTip = false;

const $http = axios.create({
	baseURL: AppDF.SERVER_URL
});

Vue.prototype.$http = $http;

Vue.prototype.$httpajax = $http;

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
