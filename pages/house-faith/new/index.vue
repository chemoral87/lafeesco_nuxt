<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveMember">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Nombre"
            v-model="item.name"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Anfitrión" v-model="item.host" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Anfitrión Teléfono"
            v-model="item.host_phone"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Expositor" v-model="item.exhibitor" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Expositor Teléfono"
            v-model="item.exhibitor_phone"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Domicilio" v-model="item.address" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Latitud" v-model="item.lat" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Longitud" v-model="item.lng" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-spacer />
        <v-btn @click="cancel" outlined color="primary" class="mr-3"
          >Cancelar</v-btn
        >
        <v-btn type="submit" color="primary" class="mr-4">Guardar</v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes("casas-fe-insert")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nueva Casa de Fe",
      icon: "home",
    });
  },
  async asyncData({ $axios, app, store }) {
    // var marital_statuses = await store.dispatch(
    //   "catalogs/fetchMaritalStatuses"
    // );
    // var member_groups = await store.dispatch("catalogs/fetchMemberCategories");
    // var member_sources = await store.dispatch("catalogs/fetchMemberSources");
    // return { marital_statuses, member_groups, member_sources };
  },
  props: {},
  data() {
    return {
      item: {},
    };
  },
  methods: {
    cancel() {
      this.$router.push("/faith-house");
    },
    async saveMember() {
      if (!this.$refs.form.validate()) return;
      await this.$repository.FaithHouse.create(this.item)
        .then((res) => {
          this.$router.push("/faith-house");
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
