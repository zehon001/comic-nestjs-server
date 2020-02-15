<template>
	<v-dialog
		v-model="dialog"
		max-width="500"
		persistent
	>
		<v-card class="elevation-12">
			<v-toolbar color="primary">
				<v-toolbar-title>注册</v-toolbar-title>
				<v-spacer />
				<v-btn
					icon
					@click="closeDialog"
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-toolbar>

			<v-card-text class="pb-0">
				<v-form
					ref='registerForm'
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
						@blur="passwordBlur"
						@keyup.13="$refs.password.blur()"
						required
					>
						<template v-slot:prepend>
							<v-icon>mdi-lock</v-icon>
						</template>
					</v-text-field>
					<v-text-field
						label="重复密码"
						v-model="password2"
						:rules="password2Rules"
						name="password2"
						type="password"
						ref="password2"
						@keyup.13="$refs.password2.blur()"
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
						@click="onRegisterClick"
						color="primary"
					>注册</v-btn>
				</v-row>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang='ts'>
import { Vue, Component, Prop, Model } from "vue-property-decorator";
@Component({})
export default class RegisterDialog extends Vue {
	@Prop(Function) onRegister;
	@Model("dialog") dialog: boolean;

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

	password2: string = "";
	password2Rules: Array<Function> = [
		v => this.password == v || "两次密码不一致"
	];

	passwordBlur() {
		this.password2Rules = [v => this.password == v || "两次密码不一致"];
	}

	checkbox: boolean = false;

	closeDialog() {
		this.$emit("dialog", false);
	}

	onRegisterClick() {
		if (this.$refs.registerForm["validate"]()) {
			this.onRegister && this.onRegister(this.username, this.password);
		}
	}
}
</script>

<style>
</style>