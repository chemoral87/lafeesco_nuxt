import es from "vuetify/es5/locale/es";
import en from "vuetify/es5/locale/en";
import fr from "vuetify/es5/locale/fr";
import colors from "vuetify/es5/util/colors";

export default function({ app, store }) {
  return {
    // locale: app.i18n.locale,
    lang: {
      locales: { en, es, fr },
      current: store.state.locale
      // current: app.i18n.getLocale(),
      // t: (key, ...params) => app.i18n.t(key, params)
    },
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          // amber accent-3
          banner: colors.amber.accent3,
          banner_item: colors.amber.accent2,
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green,
          return: colors.red
        },
        dark: {
          // banner: colors.blue.darken2,
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  };
}
