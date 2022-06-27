<template>
  <v-container>
    <v-list-item-group v-model="selectedItem" color="primary">
      <v-list-item v-for="(item, i) in items" :key="i" @click="$router.push(item.route)">
        <v-list-item-icon>
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.text"></v-list-item-title>
          <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
        </v-list-item-content>

      </v-list-item>
      <v-divider></v-divider>
    </v-list-item-group>
  </v-container>
</template>
<script>
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Reportes", icon: "chart-bar" });
  },
  data() {
    return {
      items: [
        { text: 'Consolidación', icon: 'mdi-account-group', description: "Reporte Mensual de consolidación", route: "/reports/consolidation" },
        // { text: 'Audience', icon: 'mdi-account' },
        // { text: 'Conversions', icon: 'mdi-flag' },
      ],
      selectedItem: ""
    };
  },
  methods: {
  },
  mounted() {
    let me = this;
  }
}
</script>
