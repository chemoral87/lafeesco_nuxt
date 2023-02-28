<template>
  <div class="osc"></div>
</template>
<script>
export default {
  layout: "empty",
  created() {
    this.$router.push("/landing");
    if (this.authenticated) this.$router.push("/dashboard");
    else this.$router.push("/landing");
  },
};
</script>
<style scoped>
.osc {
  background-color: black;
  height: 100vh;
}
</style>
