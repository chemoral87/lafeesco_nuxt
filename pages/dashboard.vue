<template>
  <v-container fluid>
    <div>
      <v-container>
        <span class="text-h6">Bienvenido {{NAME_SECRET}}</span>
        <!-- {{user}} -->
      </v-container>
      <!-- {{authenticated}}
      {{user}} <br><br> a
      {{permissions}} -->
    </div>
  </v-container>

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