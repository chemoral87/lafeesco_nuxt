<template>

  <div>
    <span class="text-h6">Bienvenido {{NAME_SECRET}}</span>
    <!-- {{user}} -->
  </div>
  <!-- {{authenticated}}
      {{user}} <br><br> a
      {{permissions}} -->

</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      NAME_SECRET: "", // process.env.NAME_SECRET
    };
  },
  methods: {
  },
  mounted() {
    let me = this;
    this.$nuxt.$emit("setNavBar", { title: "Dashboard", icon: "view-dashboard" });
  }
}
</script>
