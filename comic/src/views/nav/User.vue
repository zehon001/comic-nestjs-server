<template>
	<v-container class="pa-0">
		<v-loading :loading="loading"></v-loading>
		<v-custom-panel
			v-if="!loading"
			class="py-0"
		>

			<!-- 未登录 -->
			<v-custom-panel-content md="5">
				<v-card>
					<v-container>
						<v-row justify='center'>
							<v-avatar item>
								<v-img
									src="@/assets/head.jpg"
									alt="Vuetify"
								/>
							</v-avatar>
						</v-row>
						<v-row justify='center'>
							<v-card-title class="pb-0">漫画在线</v-card-title>
						</v-row>
						<v-row justify='center'>
							<v-card-subtitle v-if='data'>{{"用户名："+data.username}}</v-card-subtitle>
							<v-card-subtitle v-else>登录可以保存操作信息</v-card-subtitle>
						</v-row>
						<v-row
							justify='center'
							v-if='!data'
						>
							<v-col align='center'>
								<!-- 注册按钮 -->
								<v-btn
									color="primary mr-6"
									dark
									@click.stop="registerDialog = true"
								>
									注册
								</v-btn>
								<v-register-dialog
									v-model="registerDialog"
									:onRegister="onRegister"
								></v-register-dialog>

								<!-- 登录按钮 -->
								<v-btn
									color="primary"
									dark
									@click.stop="loginDialog = true"
								>
									登录
								</v-btn>
								<v-login-dialog
									v-model="loginDialog"
									:onLogin="onLogin"
								></v-login-dialog>

							</v-col>
						</v-row>

					</v-container>
				</v-card>

				<v-card class="mt-3">
					<v-container>
						<v-list>
							<div
								v-for="(item,index) in list"
								:key="index"
							>
								<v-list-item @click="item.event">
									<v-list-item-icon>
										<v-icon color="primary">{{item.icon}}</v-icon>
									</v-list-item-icon>

									<v-list-item-title>{{item.text}}</v-list-item-title>
									<v-list-item-icon>
										<v-icon color="primary">mdi-chevron-right</v-icon>
									</v-list-item-icon>
								</v-list-item>
								<v-divider v-if="index!=list.length-1"></v-divider>
							</div>

						</v-list>
					</v-container>
				</v-card>

			</v-custom-panel-content>

		</v-custom-panel>
	</v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class User extends Vue {
	loading: boolean = true;
	data: any = null;
	loginDialog: boolean = false;
	registerDialog: boolean = false;

	list: Array<any> = [
		{
			icon: "mdi-crown",
			text: "我的VIP",
			event: this.onVipClick
		},
		{
			icon: "mdi-wallet",
			text: "我的钱包",
			event: this.onWalletClick
		},
		{
			icon: "mdi-coin",
			text: "充值",
			event: this.onRechargeClick
		},
		{
			icon: "mdi-file-edit",
			text: "意见反馈",
			event: this.onIdeaClick
		}
	];

	// error: boolean = true;
	get adapter() {
		return this.$tools.dbAdapter;
	}

	async fetch() {
		this.loading = true;
		this.data = await this.adapter.getUserData();
		this.loading = false;
	}
	mounted() {
		this.fetch();
	}
	async onLogin(username, password) {
		// console.log("onLogin");
		// console.log(username);
		// console.log(password);
		const ret = await this.adapter.login(username, password);
		console.log(ret);
		if (ret) {
			this.loginDialog = false;
			this.data = ret;
			this.$tools.toast("登录成功", "success");
		}
	}

	async onRegister(username, password) {
		// console.log("onRegister");
		// console.log(username);
		// console.log(password);
		const ret = await this.adapter.register(username, password);
		if (ret) {
			this.registerDialog = false;
			this.$tools.toast("注册成功", "success");
		}
	}

	/**我的vip */
	onVipClick() {}

	/**钱包 */
	onWalletClick() {}
	/**充值 */
	onRechargeClick() {}
	/**意见反馈 */
	onIdeaClick() {}
}
</script>

<style>
</style>