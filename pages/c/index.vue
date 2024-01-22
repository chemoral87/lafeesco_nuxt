<template></template>
<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {
    let me = this;
    //redirect to home if user is already logged in

    this.$router.push({ path: "/casadefe" });
  }
};
</script>
