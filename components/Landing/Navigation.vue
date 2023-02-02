<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      dark
      src="/img/bgdrawer.png"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img alt="Logo" src="/logo.png" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">La Fe Escobedo</v-list-item-title>
            <!-- <v-list-item-subtitle>WEB</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list dense>
        <v-list-item
          v-for="([icon, text, link, route], i) in items"
          :key="i"
          link
          @click="fireItem(link, route)"
        >
          <v-list-item-icon class="justify-center">
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="subtitile-1">{{
              text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      :color="color"
      :flat="flat"
      dark
      class="px-15"
      :class="{ expand: flat }"
    >
      <v-toolbar-title>
        <v-img src="/logo_transparent.png" max-width="40px" />
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="mr-4"
        v-if="isXs"
      />
      <div v-else>
        <v-btn text @click="$vuetify.goTo('#hero')">
          <span class="mr-2">Inicio</span>
        </v-btn>
        <v-btn text @click="$vuetify.goTo('#schedule')">
          <span class="mr-2">Horarios</span>
        </v-btn>
        <v-btn text @click="$vuetify.goTo('#contact')">
          <span class="mr-2">Contacto</span>
        </v-btn>

        <v-btn rounded outlined text @click="$router.push('/login')">
          <span class="mr-2">Login</span>
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<style scoped>
.v-toolbar {
  transition: 0.6s;
}

.expand {
  height: 80px !important;
  padding-top: 10px;
}
</style>

<script>
export default {
  data: () => ({
    drawer: null,
    isXs: false,
    items: [
      ["mdi-home-outline", "Inicio", "#hero"],
      ["mdi-walk", "Actividades", "#activities"],
      ["mdi-clock-time-five-outline", "Horarios", "#schedule"],

      ["mdi-phone", "Contacto", "#contact"],
      ["mdi-lock", "Login", "", "/login"],
    ],
  }),
  props: {
    color: String,
    flat: Boolean,
  },
  methods: {
    onResize() {
      this.isXs = window.innerWidth < 850;
    },
    fireItem(link, route) {
      if (link) this.$vuetify.goTo(link);
      if (route) this$router.push(route);
      this.drawer = false;
    },
  },

  watch: {
    isXs(value) {
      if (!value) {
        if (this.drawer) {
          this.drawer = false;
        }
      }
    },
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
};
</script>
