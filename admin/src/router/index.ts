import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Main from "../views/Main.vue";
import ResourceCrud from "../views/ResourceCrud.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
	{
		path: "/",
		component: Main,
		children: [
			{ name: "home", path: "/", component: Home },
			{
				path: "/:resource/list",
				component: ResourceCrud,
				props: true
			},
			{
				path: "/:resource/list",
				component: ResourceCrud,
				props: true
			}
		]
	}
	// {
	//   path: '/about',
	//   name: 'about',
	//   // route level code-splitting
	//   // this generates a separate chunk (about.[hash].js) for this route
	//   // which is lazy-loaded when the route is visited.
	//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	// }
];

const router = new VueRouter({
	routes
});

export default router;
