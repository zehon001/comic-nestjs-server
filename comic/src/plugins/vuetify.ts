import Vue from "vue";
import Vuetify from "vuetify/lib";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		dark: true,
		themes: {
			light: {
				backgroud: "#FFFFFF",
				backgroud2: colors.grey.darken4,
				backgroud3: colors.grey.darken3,
				backgroud4: colors.grey.darken2,
				backgroud5: colors.grey.darken1,
				backgroud6: colors.grey.lighten1,
				primary: colors.blue.darken3,
				secondary: colors.grey.darken1,
				accent: colors.shades.white,
				error: colors.red.accent3
			},
			dark: {
				backgroud: "#000000",
				backgroud2: colors.grey.darken4,
				backgroud3: colors.grey.darken3,
				backgroud4: colors.grey.darken2,
				backgroud5: colors.grey.darken1,
				backgroud6: colors.grey.lighten1,
				primary: "#ed2553",
				secondary: colors.grey.darken1,
				secondary2: colors.grey.darken2,
				accent: colors.shades.black,
				error: colors.red.accent3
			}
		}
	}
});
