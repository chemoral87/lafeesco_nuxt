import colors from "vuetify/es5/util/colors";
// require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
require("dotenv").config({ path: ".env." + process.env.NODE_ENV });
// console.log(process.env.NODE_ENV, process.env.BASE_URL);
// require("dotenv").config();
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: "server",
  // mode: "spa",
  ssr: false,
  router: {
    trailingSlash: false
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
    title: "RC Desarrolladora",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/styles/main.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "./plugins/mixins/user.js",
    "./plugins/mixins/validation.js",
    "./plugins/axios.js",
    "./plugins/repository.js"
    // { src: "./plugins/vue-html-to-paper.js", mode: "client" }
    // { src: "@/plugins/vue-html2pdf.js", mode: "client" }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify"
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    ["@nuxtjs/dotenv", { filename: ".env." + process.env.NODE_ENV }]
    // "@nuxtjs/dotenv"
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL
  },
  auth: {
    strategies: {
      // local: {
      //   endpoints: {
      //     login: {
      //       url: "login",
      //       method: "post",
      //       propertyName: "meta.access_token"
      //     },
      //     user: { url: "user", method: "get", propertyName: "data" },
      //     logout: { url: "logout", method: "post" }
      //   }
      // },
      laravelJWT: {
        url: "/",
        endpoints: {
          login: {
            url: "auth/login",
            method: "post"
          },
          refresh: {
            url: "auth/refresh",
            method: "post"
          },
          logout: {
            url: "auth/logout",
            method: "post"
          },
          user: {
            url: "auth/user",
            method: "post"
          }
        }
      }
    }
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en"
    },
    icon: {
      fileName: "favicon.png"
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
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
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    maxChunkSize: 300000
  }
};
