import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/nav/Home.vue";
import History from "../views/nav/History.vue";
import Star from "../views/nav/Star.vue";
import Setting from "../views/nav/Setting.vue";
import User from "../views/nav/User.vue";
import Help from "../views/nav/Help.vue";

import Search from "../views/Search.vue";
import Comic from "../views/Comic.vue";
import Season from "../views/Season.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home
	},
	{
		path: "/home",
		component: Home
	},
	{
		path: "/history",
		component: History
	},
	{
		path: "/star",
		component: Star
	},
	{
		path: "/setting",
		component: Setting
	},
	{
		path: "/user",
		component: User
	},
	{
		path: "/help",
		component: Help
	},

	{
		path: "/search",
		component: Search
	},

	{
		path: "/comic",
		component: Comic
	},

	{
		path: "/season",
		component: Season
	}
];

const router = new VueRouter({
	routes
});
router.afterEach((to, from) => {
	// console.log("切换页面");
});

export default router;
