<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <h1 class="text-h5">
          <v-icon class="mr-1">mdi-key</v-icon>
          Permisos
        </h1>
      </v-col>
      <v-col cols="12">
        <v-btn @click="newPermission()" color="primary">
          <v-icon class="mr-1">mdi-plus</v-icon> Nuevo
        </v-btn>
        <v-btn @click="getPermissions()" color="primary">
          <v-icon class="mr-1">mdi-reload</v-icon> Refrescar
        </v-btn>
      </v-col>
    </v-row>
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
  },
  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ["name"],
      sortDesc: [false]
    };
    // const res = await app.$permissionRepository.index(op)
    //   .catch(e => { });
    // return { response: res, options: op };
  }
}
</script>