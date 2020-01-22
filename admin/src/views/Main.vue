<template>
	<el-container>
		<el-aside width="200px">
			<el-menu
				mode="vertical"
				style="height:100%"
				:default-active="$router.path"
				router
			>
				<el-submenu
					v-for="(item, index) in menu.items"
					:index="`menu-index-${index + 1}`"
					:key="`menu-item-${index}`"
				>
					<template slot="title">{{ item.title }}</template>
					<el-menu-item
						v-for="(subItem, subIndex) in item.items"
						:key="`menu-item-${index}-${subIndex}`"
						:index="subItem.path"
						>{{ subItem.title }}</el-menu-item
					>
				</el-submenu>
			</el-menu>
		</el-aside>
		<el-container>
			<el-header>
				<h3>漫画网站-后台管理界面</h3>
			</el-header>
			<el-main>
				<router-view :key="$route.fullPath"></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Main extends Vue {
	menu = {
		items: []
	};
	/**拉取配置信息 */
	async fetchOption() {
		const res = await this.$http.get(`option`);
		this.menu = res.data;
	}
	created() {
		this.fetchOption();
	}
}
</script>

<style lang='scss'>
.el-header,
.el-footer {
	background-color: #2c66ba;
	color: #ffffff;
	box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
		0px 4px 5px 0px rgba(0, 0, 0, 0.14),
		0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.el-container {
	.el-aside {
		.el-menu {
			background-color: #ffffff;
			color: #212121;
			.el-submenu__title {
				color: #212121;
				font-weight: 700;
			}
			.el-menu-item {
				color: #212121;
			}
			.el-menu-item.is-active {
				color: #579ef8;
			}
		}
	}
}
</style>
