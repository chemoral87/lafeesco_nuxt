<template>
  <v-container fluid>
    <div>
      {{authenticated}}
      {{user}} <br><br> a
      {{permissions}}
    </div>
  </v-container>

</template>
<script>
export default {
  props: {
  },
  data() {
    return {};
  },
  methods: {
  },
  mounted() {
    let me = this;
    this.$nuxt.$emit("setNavBar", { title: "Dashboard" });
  }
}
</script>