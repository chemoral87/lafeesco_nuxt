<template>
  <v-container dense>
    <v-row dense>
      <v-col cols="12" sm="3">
        <v-select
          v-model="identification_type"
          :items="items"
          outlined
          label="Tipo Identificación"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-file-input
          v-model="front_identification"
          label="Documento"
          placeholder="Seleccione un archivo PDF o Imagen"
        ></v-file-input>
        <v-img
          max-height="200"
          contain
          :src="response.front_identification_url"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="3"> </v-col>
      <v-col cols="12">
        <v-btn @click="saveInvestorProfile()" color="primary">Guardar</v-btn>
      </v-col>
      <!-- {{ response }} -->
    </v-row>
  </v-container>
</template>
<script>
export default {
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("investment-my-profile"))
      return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Perfil Inversor",
      icon: "account",
    });
  },
  async asyncData({ app }) {
    const res = await app.$repository.InvestorProfile.myIndex().catch(
      (e) => {}
    );
    // let res = [];
    return { response: res.data };
  },
  props: {},
  data() {
    return {
      items: ["IFE", "PASAPORTE", "LICENCIA MANEJO"],
      identification_type: "",
      front_identification: null,
      img: "",
      response: {},
    };
  },
  methods: {
    async saveInvestorProfile() {
      let form = new FormData();
      if (this.front_identification)
        form.append("front_identification", this.front_identification);
      form.append("identification_type", this.identification_type);

      await this.$repository.InvestorProfile.myUpdate(form)
        .then((res) => {
          // this.img = res.img;
          this.response = res.data;
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
