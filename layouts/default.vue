<template>
  <v-app dark>
    <v-navigation-drawer
      :color="authenticated ? '' : 'banner'"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item>
          <v-list-item-action class="mr-2">
            <v-img class="logo" width="35px" src="/logo.png"></v-img>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ title_companion }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          @click="closeDrawer"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-spacer />
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      class="elevation-2"
      fixed
      app
      :color="authenticated ? '' : 'banner'"
    >
      <v-app-bar-nav-icon v-if="show_drawer" @click.stop="drawer = !drawer" />
      <v-toolbar-title class="pl-0">
        <v-btn
          v-if="back"
          @click="$router.push(back)"
          class="mr-1"
          outlined
          fab
          small
          elevation="0"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-icon v-if="icon">mdi-{{ icon }}</v-icon>
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-if="!authenticated && show_login"
        @click="gotoLogin()"
        color="banner_item elevation-2"
        class="mr-2"
      >
        <v-icon>mdi-lock</v-icon> Login
      </v-btn>

      <!-- Usuario -->
      <v-menu
        v-if="authenticated"
        v-model="menu"
        offset-y
        :close-on-content-click="true"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="ml-3"
            small
            fab
            color="blue white--text"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item :to="'/account'">
            <v-list-item-content>
              <v-list-item-title
                >{{ user.name }} {{ user.last_name }}</v-list-item-title
              >
              <v-list-item-subtitle>{{ user.email }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>

          <v-list-item @click="logout()">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>mdi-logout</v-icon> Cerrar Sesión
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
      <MyLoading :value="loading_display"></MyLoading>
      <div class="snackbar-wrapper">
        <v-snackbar
          absolute
          :color="snackbar.color"
          v-model="snackbar_display"
          shaped
          multi-line
          right
          bottom
          :timeout="3800"
        >
          <span class="text-subtitle-1 font-weight-bold">{{
            snackbar.text
          }}</span>
          <template v-slot:action="{ attrs }">
            <v-btn color="grey" v-bind="attrs" fab small @click="closeSnackbar">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { MenuService } from "../services/menu-service";
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false, // footer
      miniVariant: false,
      right: true,
      rightDrawer: false,
      menu: false,
      title_companion: process.env.APP_NAME,
      title: "",
      icon: null,
      back: null,
      show_drawer: true,
      show_login: true,
    };
  },
  computed: {
    snackbar_display: {
      get() {
        return this.snackbar.display;
      },
      set() {
        this.$store.dispatch("closeNotify");
      },
    },
    loading_display() {
      return this.showLoading;
    },
    items() {
      const menu_ = new MenuService(this.authenticated, this.permissions);
      return menu_.getMenu();
    },
  },
  methods: {
    setNavBar(navbar) {
      this.title = navbar.hasOwnProperty("title")
        ? navbar.title
        : "La Fe Escobedo";
      this.icon = navbar.hasOwnProperty("icon") ? navbar.icon : null;
      this.back = navbar.hasOwnProperty("back") ? navbar.back : null;
      this.show_drawer = navbar.hasOwnProperty("show_drawer")
        ? navbar.show_drawer
        : true;
      this.show_login = navbar.hasOwnProperty("show_login")
        ? navbar.show_login
        : true;
    },
    closeDrawer() {
      this.drawer = false;
    },
    gotoLogin() {
      this.$router.push("/login");
    },
    gotoHome() {
      this.$router.push("/");
    },
    logout() {
      this.menu = false;
      this.$auth.logout();
    },
    closeSnackbar() {
      this.$store.dispatch("closeNotify");
    },
  },
  created() {
    this.$nuxt.$on("setNavBar", ($event) => this.setNavBar($event));
  },
};
</script>
<style>
.snackbar-wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  pointer-events: none;
  top: 0;
  left: 0;
  z-index: 1000;
}
</style>
