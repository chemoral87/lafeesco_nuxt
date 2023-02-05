<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" md="4">
        <v-btn @click="newInvestment()" color="primary" class="mr-1">
          <v-icon>mdi-plus</v-icon> Nuevo Contratos
        </v-btn>
        <v-btn @click="getInvestments()" color="primary">
          <v-icon>mdi-reload</v-icon> Refrescar
        </v-btn>
      </v-col>
      <v-col cols="12">
        {{ $t("welcome") }} a
        <InvestmentMyTable
          @sorting="getInvestments()"
          :options="options"
          :response="response"
        ></InvestmentMyTable>
      </v-col>
    </v-row>
    CAPTURA, EN REVISION, AUTORIZADO, CANCELADO
  </v-container>
</template>
<script>
export default {
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("investment-my-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Inversiones", icon: "pencil-box" });
  },
  async asyncData({ app }) {
    let op = {
      sortBy: ["contract_date"],
      sortDesc: [true],
      itemsPerPage: 10,
    };
    //NOTE Repository https://medium.com/js-dojo/consuming-apis-in-nuxt-using-the-repository-pattern-8a13ea57d520
    const res = await app.$repository.Investment.myIndex(op).catch((e) => {});
    return { response: res, options: op };
  },
  data() {
    return {
      response: {
        data: [],
      },
      options: {},
    };
  },
  methods: {
    newInvestment() {},
    getInvestments() {},
  },
  mounted() {
    let me = this;
  },
  props: {},
};
</script>
