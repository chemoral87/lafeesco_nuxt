<template>
  <v-container>
    <v-row dense>

    </v-row>
  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('investment-my-index'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Inversiones", icon: "pencil-box" });
  },
  props: {
  },
  data() {
    return {};
  },
  methods: {
  },
  mounted() {
    let me = this;
  }
}
</script>