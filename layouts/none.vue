<template>
  <v-app dark>
    <v-main>
      <v-container fluid class="pa-0">
        <Nuxt />
      </v-container>

      <MyLoading :value="loading_display"></MyLoading>

      <div class="snackbar-wrapper">
        <v-snackbar
          v-for="(snack, i) in snacks.filter((s) => s.display == true)"
          :key="i + 'snackbars'"
          :color="snack.color"
          v-model="snack.showing"
          shaped
          multi-line
          right
          bottom
          absolute
          :timeout="snack.timeout"
          :style="`bottom: ${i * 69 + 0}px`"
        >
          <span class="text-subtitle-1 font-weight-bold">{{ snack.text }}</span>
          <template v-slot:action="{ attrs }">
            <v-btn color="grey" v-bind="attrs" fab small @click="snack.display = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    // snackbar_display: {
    //   get() {
    //     return this.snackbar.display;
    //   },
    //   set() {
    //     this.$store.dispatch("closeNotify");
    //   },
    // },
    loading_display() {
      return this.showLoading;
    },
    snacks() {
      return this.$store.getters.getSnackbars;
    }
  }
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
