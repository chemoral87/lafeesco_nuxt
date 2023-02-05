<template></template>

<script>
export default {
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("investment-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Inversiones", icon: "pencil-box" });
  },
};
</script>
