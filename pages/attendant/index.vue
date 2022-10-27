<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="success"
          @click="$router.push('attendant/new')"
          class="mb-1 mr-1"
        >
          <v-icon class="mr-1">mdi-account-plus</v-icon> Nuevo Servidor
        </v-btn>
      </v-col>
      <v-col cols="12"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios, app }) {
    // let options = {
    //   sortBy: ["name"],
    //   sortDesc: [true],
    //   itemsPerPage: 20,
    // };
    // const response = await app.$repository.FaithHouse.index(options).catch(
    //   (e) => {}
    // );
    // return { response, options };
  },

  methods: {},
  data() {
    return {};
  },
  validate({ store, error }) {
    return true;
    if (store.getters.permissions.includes("attendant-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Servidores",
      icon: "human-greeting-variant",
    });
  },
};
</script>
