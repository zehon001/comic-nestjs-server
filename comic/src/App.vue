<template>
	<v-app
		id="app"
		v-scroll="onScroll"
	>
		<v-navigation-drawer
			v-model="drawer"
			clipped
			temporary
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
			color="primary"
			dark
			short
			max-height="56px"
		>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer" />
			<v-toolbar-title
				style="width: 300px"
				class="hidden-sm-and-down ml-0 pl-4"
			>
				<span class="">漫画在线</span>
			</v-toolbar-title>
			<!-- 弹出带搜索按钮的输入法 -->
			<v-form action="javascript:(function(){return true;})()">
				<v-text-field
					flat
					solo-inverted
					hide-details
					clearable
					dense
					prepend-inner-icon="mdi-magnify"
					label="搜索"
					type='search'
					ref="search"
					@keyup.13="onSearch"
					v-model="searchContent"
				/>
			</v-form>
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
				to="/user"
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
		<!-- <v-fab-transition>
			<v-btn
				bottom
				right
				color="primary"
				dark
				fab
				fixed
				small
				v-show="scrollTop>1"
				@click="$vuetify.goTo(0, scrollTopOptions)"
			>
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</v-fab-transition> -->
		<v-fab-transition>
			<v-speed-dial
				v-model="floatFab"
				bottom
				right
				fixed
				v-show="scrollTop>hideFloatScrollTop"
				direction="top"
				transition='slide-y-reverse-transition'
			>
				<template v-slot:activator>
					<v-btn
						v-model="floatFab"
						bottom
						right
						color="primary"
						dark
						fab
						small
					>
						<v-icon v-if="floatFab">mdi-close</v-icon>
						<v-icon v-else>mdi-plus</v-icon>
					</v-btn>
				</template>
				<!-- <v-btn
					fab
					small
					color="green"
				>
					<v-icon>mdi-pencil</v-icon>
				</v-btn> -->
				<v-btn
					fab
					small
					color="indigo"
					@click="$vuetify.goTo(0, scrollTopOptions);$refs.search.focus();"
				>
					<v-icon>mdi-magnify</v-icon>
				</v-btn>
				<v-btn
					fab
					small
					color="red"
					@click="$vuetify.goTo(scrollHeight, scrollTopOptions)"
				>
					<v-icon>mdi-chevron-down</v-icon>
				</v-btn>
				<v-btn
					fab
					small
					color="red"
					@click="$vuetify.goTo(0, scrollTopOptions)"
				>
					<v-icon>mdi-chevron-up</v-icon>
				</v-btn>

			</v-speed-dial>
		</v-fab-transition>
		<v-snackbar
			v-model="toastVisible"
			:timeout="toastDelay"
			:color="toastColor"
		>
			{{ toastMsg }}
			<v-btn
				icon
				small
				@click="toastVisible = false"
			>
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-snackbar>
		<!-- <v-btn @click="$tools.toast('dhaushdi','',3000)">弹消息</v-btn> -->
	</v-app>
</template>

<script>
export default {
	props: {},
	data: () => ({
		searchContent: "",
		dialog: false,
		drawer: false,
		scrollTop: 0,
		hideFloatScrollTop: 56,
		floatFab: false,
		toastVisible: false,
		toastMsg: "",
		toastDelay: 3000,
		toastColor: null,
		items: [
			{ icon: "mdi-home", text: "首页", link: "/home" },
			{ icon: "mdi-history", text: "观看历史", link: "/history" },
			{ icon: "mdi-star", text: "收藏", link: "/star" },
			{ icon: "mdi-account", text: "个人中心", link: "/user" },
			{ icon: "mdi-settings", text: "设置", link: "/setting" },
			{ icon: "mdi-help-circle", text: "帮助", link: "/help" }
		]
	}),
	created() {
		this.$tools.toast = this.toast.bind(this);

		this.$vuetify.theme.dark = !!this.$tools.dbAdapter.getSettings()
			.themeDark;
	},

	computed: {
		scrollTopOptions() {
			return {
				duration: 300,
				offset: 0,
				easing: "easeInQuad"
			};
		},
		scrollHeight() {
			return (
				document.body.scrollHeight ||
				document.documentElement.scrollHeight
			);
		}
	},
	methods: {
		onSearch() {
			this.$refs.search.blur();
			if (this.searchContent) {
				console.log("搜索：" + this.searchContent);
				this.$router.push({
					path: "/search",
					query: { content: this.searchContent }
				});
			}
		},
		onScroll() {
			this.scrollTop =
				document.documentElement.scrollTop || document.body.scrollTop;
			if (this.scrollTop <= this.hideFloatScrollTop)
				this.floatFab = false;
		},
		toast(msg, color, delay = 3000) {
			this.toastColor = color;
			this.toastVisible = false;
			setTimeout(() => {
				this.toastMsg = msg;
				this.toastDelay = delay;
				this.toastVisible = true;
			}, 1);
		},
		error() {}
	},
	mounted() {}
};
</script>

<style lang="scss">
#inspire {
	// background: black;
	// background-color: black;
	// margin-top: 60px;
}
// html {
// 	height: 100%;
// 	width: 100%;
// 	overflow: hidden;
// }

// body {
// 	height: 100%;
// 	width: 100%;
// 	overflow: auto;
// 	-webkit-overflow-scrolling: touch;
// }
</style>