<template></template>
<script>
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Reporte Consolidación", icon: "account-group" });
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
