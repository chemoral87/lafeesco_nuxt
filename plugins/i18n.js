import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import en from "~/locales/en.json";
import es from "~/locales/es.json";
import fr from "~/locales/fr.json";
// https://allenhwkim.medium.com/multiple-language-with-nuxt-vuejs-efc3dad45eac
export default async function({ app, store }) {
  console.log(store.state.locale);
  // await app.i18n.setLocale(store.state.locale);

  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: "en",
    messages: {
      en,
      es,
      fr
      // en: require("~/locales/en.json"),
      // es: require("~/locales/es.json"),
      // fr: require("~/locales/fr.json")
    }
  });

  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    console.log("beforeLanguageSwitch");
  };

  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    console.log("onLanguageSwitched", oldLocale, newLocale);
  };
}
