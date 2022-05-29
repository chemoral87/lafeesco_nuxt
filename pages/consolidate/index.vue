<template>
  <v-container fluid>
    <v-form>
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Nombre" model="member.name" :rules="[v => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Apellido Paterno" model="member.paternal_surame" :rules="[v => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Apellido Materno" model="member.maternal_surame" />
        </v-col>
      </v-row>
      <!-- <v-row dense>
        Cumpleaños
      </v-row>
      <v-row dense>

        <v-col cols="6" md="2" lg="1">
          <v-text-field outlined label="Día" name="day_b" model="member.day_b" />
        </v-col>
        <v-col cols="6" md="2">
          <v-text-field outlined label="Mes" name="month_b" model="member.month_b" />
        </v-col>
        <v-col cols="6" md="2" lg="1">
          <v-text-field outlined label="Año" name="year_b" model="member.year_b" />
        </v-col>
      </v-row> -->
      <v-row dense>

        <v-col cols="6" md="3">
          <v-select outlined hide-details label="Estado Civil" v-model="member.marital_status_id" :items="marital_statuses" item-value="id" item-text="name" clearable="true"></v-select>
          <!-- <v-text-field label="Estado Civil" name="marital_status_id" model="member.marital_status_id" /> -->
        </v-col>
        <v-col cols="6" md="3">
          <v-select outlined hide-details label="Grupo" v-model="member.category_id" :items="member_groups" item-value="id" item-text="name" clearable="true"></v-select>
          <!-- <v-text-field label="Grupo" name="category_id" model="member.category_id" /> -->
        </v-col>

      </v-row>
      <v-row dense>
        <v-col cols="6" md="3">
          <!-- <v-text-field label="Petición Oración" name="prayer_request" model="member.prayer_request" /> -->
          <v-textarea outlined label="Petición Oración" name="prayer_request" model="member.prayer_request" rows="1" auto-grow></v-textarea>
        </v-col>
      </v-row>

    </v-form>
  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('consolidador-index'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Consolidar", icon: "account-plus" });
  },
  async asyncData({ $axios, app }) {
    const res = await app.$repository.Consolidation.initialCatalog()
      .catch(e => { });
    return { ...res };
  },
  props: {
  },
  data() {
    return {
      member: {},
      marital_statuses: [],
      months: [
        { id: "01", name: "Enero" },
        { id: "02", name: "Febrero" },
        { id: "03", name: "Marzo" },
        { id: "04", name: "Abril" },
        { id: "05", name: "Mayo" },
        { id: "06", name: "Junio" },
        { id: "07", name: "Julio" },
        { id: "08", name: "Agosto" },
        { id: "09", name: "Septiembre" },
        { id: "10", name: "Octubre" },
        { id: "11", name: "Noviembre" },
        { id: "12", name: "Diciembre" },
      ]
    };
  },
  methods: {
  },
  mounted() {
    let me = this;
  }
}
</script>

