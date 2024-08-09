<template>
  <v-app>
    <LandingNavigation :color="color" :flat="flat" />
    <v-main class="pt-0">
      <LandingHome />
      <LandingSchedule />
      <LandingContact />
    </v-main>
    <v-scale-transition>
      <v-btn fab v-show="fab" v-scroll="onScroll" fixed bottom right color="secondary" @click="toTop">
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-scale-transition>
    <LandingFooter />
  </v-app>
</template>
<script>
export default {
  layout: "empty",
  props: {},
  data: () => ({
    fab: null,
    color: "",
    flat: null
  }),
  watch: {
    fab(value) {
      if (value) {
        this.color = "secondary";
        this.flat = false;
      } else {
        this.color = "transparent";
        this.flat = true;
      }
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 60;
    },
    toTop() {
      this.$vuetify.goTo(0);
    }
  },
  mounted() {
    let me = this;
  },
  created() {
    const top = window.pageYOffset || 0;
    if (top <= 60) {
      this.color = "transparent";
      this.flat = true;
    }
  }
};
</script>
<style scoped>
.v-main {
  /* background-image: url("~@/assets/img/bgMain.png"); */
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
</style>
