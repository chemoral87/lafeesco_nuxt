// require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
// const env = require("dotenv").config({ path: ".env." + process.env.NODE_ENV });
let env;

let title;
let dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
if (process.env.NODE_ENV == "production") {
  env = require("dotenv").config({ path: ".env.production" });
  title = process.env.APP_NAME;
} else {
  env = require("dotenv").config({ path: ".env" });
  title = process.env.APP_ENVIRONMENT;
}
console.log("NODE_ENV ", process.env.NODE_ENV);
console.log("BASE_URL ", process.env.BASE_URL);
// import VueI18n from "vue-i18n";

// const i18n = new VueI18n({
//   locale: "es" // set locale
//   // messages // set locale messages
// });

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "server",
  env: env.parsed,
  ssr: false,
  telemetry: false,
  router: {
    trailingSlash: false,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
    title: title,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/styles/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "./plugins/mixins/user.js",
    "./plugins/mixins/validation.js",
    "./plugins/axios.js",
    "./plugins/filters.js",
    "./plugins/i18n.js",
    "./plugins/repository.js",
    "./plugins/v-mask.js",
    "./plugins/vue2-google-maps.js",
    "./plugins/vue-advanced-cropper.js",
    // "./plugins/vue-image-crop-upload.js",
    // "./plugins/vue-mask.js"
    // { src: "./plugins/geolocation.js", ssr: false, mode: "client" }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/moment",
  ],
  moment: {
    defaultLocale: "es",
    locales: ["es"],
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios

    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    ["@nuxtjs/dotenv", { filename: ".env." + process.env.NODE_ENV }],
    // [
    //   "@nuxtjs/i18n",
    //   {
    //     locales: ["en", "es"],
    //     defaultLocale: "en",
    //     vueI18n: {
    //       fallbackLocale: "en",
    //       messages: {
    //         en: {
    //           greeting: "Hello world!",
    //         },
    //         es: {
    //           greeting: "¡Hola mundo!",
    //         },
    //       },
    //     },
    //   },
    // ],
    // [
    //   "nuxt-gmaps",
    //   {
    //     key: process.env.GOOGLE_MAPS_KEY
    //   }
    // ]
    // "@nuxtjs/i18n"
    // [
    //   "@nuxtjs/i18n",
    //   {
    //     locales: ["en", "es"],
    //     defaultLocale: "es",
    //     vueI18n: {
    //       fallbackLocale: "en",
    //       messages: {
    //         en: {
    //           greeting: "Hello world!"
    //         },
    //         es: {
    //           greeting: "¡Hola mundo!"
    //         }
    //       }
    //     }
    //   }
    // ]
    // "@nuxtjs/dotenv"
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL,
  },
  auth: {
    strategies: {
      laravelJWT: {
        // optional //
        provider: "laravel/jwt",
        token: {
          property: "access_token",
          maxAge: 60 * 60,
        },
        refreshToken: {
          maxAge: 20160 * 60,
        },
        // optional. //
        url: "/",
        endpoints: {
          login: {
            url: "auth/login",
            method: "post",
          },
          refresh: {
            url: "auth/refresh",
            method: "post",
          },
          logout: {
            url: "auth/logout",
            method: "post",
          },
          user: {
            url: "auth/user",
            method: "post",
          },
        },
      },
    },
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
    // https://www.favicon-generator.org/
    icon: {
      fileName: "favicon-96x96.png",
    },
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // lang: {
    //   locales: { es, en },
    //   current: "es"
    // },
    // defaultLocale: "es",
    // lang: {
    //   t: (key, ...params) => app.i18n.t(key, params)
    // },
    optionsPath: "./vuetify.options.js",
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // maxChunkSize: 900000,
    extractCSS: true,
    filenames: {
      chunk: ({ isDev }) => (isDev ? "[name].js" : "[id].[contenthash].js"),
    },
  },
};
