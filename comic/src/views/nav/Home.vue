<template>
	<v-container class="fill-height">
		<div style="position: absolute;top: 0;left: 0;">首页</div>
		<v-row
			align="center"
			justify="center"
		>
			<v-tooltip right>
				<template v-slot:activator="{ on }">
					<v-btn
						icon
						large
						target="_blank"
						v-on="on"
					>
						<v-icon large>mdi-code-tags</v-icon>
					</v-btn>
				</template>
				<span>Source</span>
			</v-tooltip>
			<v-tooltip right>
				<template v-slot:activator="{ on }">
					<v-btn
						icon
						large
						href="https://codepen.io/johnjleider/pen/MNYLdL"
						target="_blank"
						v-on="on"
					>
						<v-icon large>mdi-codepen</v-icon>
					</v-btn>
				</template>
				<span>Codepen</span>
			</v-tooltip>
		</v-row>
	</v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {}
</script>

<style>
</style>