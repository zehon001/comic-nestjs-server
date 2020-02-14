<template>
	<v-container class="pa-0">
		<v-loading :loading="loading"></v-loading>
		<v-custom-panel
			v-if="!loading"
			class="py-0"
		>
			<v-custom-panel-content v-if="data">
				<v-card>已经登录</v-card>
			</v-custom-panel-content>

			<!-- 未登录 -->
			<v-custom-panel-content
				md="5"
				v-else
			>

				<v-card class="elevation-12 mx-4">
					<v-toolbar color="primary">
						<v-toolbar-title>登录</v-toolbar-title>
						<v-spacer />
					</v-toolbar>
					<v-card-text class="pb-0">
						<v-form
							ref='loginForm'
							action="javascript:(function(){return true;})()"
							lazy-validation
						>
							<v-text-field
								label="账号"
								v-model="username"
								:rules="usernameRules"
								name="username"
								ref="username"
								@keyup.13="$refs.username.blur()"
								required
							>
								<template v-slot:prepend>
									<v-icon>mdi-account-circle</v-icon>
								</template>
							</v-text-field>

							<v-text-field
								label="密码"
								v-model="password"
								:rules="passwordRules"
								name="password"
								type="password"
								ref="password"
								@keyup.13="$refs.password.blur()"
								required
							>
								<template v-slot:prepend>
									<v-icon>mdi-lock</v-icon>
								</template>
							</v-text-field>
							<v-row justify='center'>
								<v-checkbox
									v-model="checkbox"
									:rules="[v => !!v || '必须同意条款!']"
									label="是否同意条款?"
									required
								></v-checkbox>
							</v-row>
						</v-form>
					</v-card-text>
					<v-card-actions class="pt-0 pb-6">
						<v-row justify='center'>
							<v-btn
								@click="onLoginClick"
								color="primary"
							>确认登录</v-btn>
						</v-row>
					</v-card-actions>
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
	username: string = "";
	usernameRules: Array<Function> = [
		v => !!v || "用户名不能为空",
		v => (v && v.length >= 4) || "用户名不能小于4位",
		v => (v && v.length <= 16) || "用户名不能超过16位"
	];
	password: string = "";
	passwordRules: Array<Function> = [
		v => !!v || "密码不能为空",
		v => (v && v.length >= 4) || "密码不能小于4位",
		v => (v && v.length <= 16) || "密码不能超过16位"
	];
	checkbox: boolean = false;

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

	onLoginClick() {
		if (this.$refs.loginForm["validate"]()) {
			console.log("登录");
			console.log(this.username);
			console.log(this.password);
		}
	}
}
</script>

<style>
</style>