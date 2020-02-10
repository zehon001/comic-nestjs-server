<template>
	<v-app id="inspire">
		<v-navigation-drawer
			v-model="drawer"
			clipped
			app
		>
			<v-list dense>
				<template v-for="item in items">
					<v-list-item
						:to="item.link"
						:key="item.text"
						link
					>
						<v-list-item-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title>
								{{ item.text }}
							</v-list-item-title>
						</v-list-item-content>
					</v-list-item>
				</template>
			</v-list>
		</v-navigation-drawer>

		<v-app-bar
			:clipped-left="$vuetify.breakpoint.lgAndUp"
			app
			hide-on-scrol
			color="primary"
			dark
		>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title
				style="width: 300px"
				class="hidden-sm-and-down ml-0 pl-4"
			>
				<span class="">漫画在线</span>
			</v-toolbar-title>

			<v-text-field
				flat
				solo-inverted
				hide-details
				clearable
				dense
				prepend-inner-icon="mdi-magnify"
				label="搜索"
				v-model="searchContent"
				@keydown="onKeyDown"
			/>
			<v-spacer />
			<v-btn icon>
				<v-icon>mdi-apps</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-bell</v-icon>
			</v-btn>
			<v-btn
				icon
				large
			>
				<v-avatar
					size="32px"
					item
				>
					<v-img
						src="./assets/head.jpg"
						alt="Vuetify"
					/>
				</v-avatar>
			</v-btn>
		</v-app-bar>
		<v-content>
			<v-container class="fill-height">
				<router-view :key="$route.fullPath"></router-view>
			</v-container>
		</v-content>
		<v-btn
			bottom
			color="primary"
			dark
			fab
			fixed
			right
			@click="dialog = !dialog"
		>
			<v-icon>mdi-plus</v-icon>
		</v-btn>

	</v-app>
</template>

<script>
export default {
	props: {},
	data: () => ({
		searchContent: "",
		dialog: false,
		drawer: false,
		items: [
			{ icon: "mdi-home", text: "首页", link: "/home" },
			{ icon: "mdi-history", text: "观看历史", link: "/history" },
			{ icon: "mdi-star", text: "收藏", link: "/star" },
			{ icon: "mdi-settings", text: "设置", link: "/setting" },
			{ icon: "mdi-account", text: "个人中心", link: "/user" },
			{ icon: "mdi-help-circle", text: "帮助", link: "/help" }
		]
	}),
	created() {},
	methods: {
		onKeyDown(event) {
			if (event.code == "Enter") {
				console.log("搜索：" + this.searchContent);
				this.$router.push({
					path: "/search",
					query: { content: this.searchContent }
				});
			}
		}
	},
	mounted() {}
};
</script>

<style lang="scss">
#inspire {
	background: black;
	background-color: black;
	// margin-top: 60px;
}
</style>