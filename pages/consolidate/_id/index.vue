<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveMember">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Nombre" v-model="member.name" :rules="[v => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Apellido Paterno" v-model="member.paternal_surname" :rules="[v => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Apellido Materno" v-model="member.maternal_surname" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Fecha cumpleaños" v-model="member.birthday" v-mask="'##-##-####'" :persistent-placeholder="true" placeholder="dd-mm-aaaa" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Celular" v-model="member.cellphone" v-mask="'##-####-####'" />
        </v-col>
        <v-col cols="6" md="3">
          <v-select outlined hide-details label="Estado Civil" v-model="member.marital_status_id" :items="marital_statuses" item-value="id" item-text="name" :clearable="true"></v-select>
        </v-col>
        <v-col cols="6" md="3">
          <v-select outlined hide-details label="Grupo" v-model="member.category_id" :items="member_groups" item-value="id" item-text="name" :clearable="true"></v-select>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6" md="3">
          <v-textarea outlined label="Petición Oración" name="prayer_request" v-model="member.prayer_request" rows="1" auto-grow></v-textarea>
        </v-col>
      </v-row>
      <v-row dense>
        <v-spacer />
        <v-btn @click="cancel" outlined color="primary" class="mr-3">Cancelar</v-btn>
        <v-btn type="submit" color="primary" class="mr-4">Guardar</v-btn>
      </v-row>

    </v-form>
  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('consolidador-update'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Editar Miembro", icon: "account-plus" });
  },
  async asyncData({ $axios, app, params }) {
    const initialCatalog = await app.$repository.Consolidation.initialCatalog()
      .catch(e => { });
    const member = await app.$repository.Member.show(params.id);
    return { ...initialCatalog, member, id: params.id };
  },
  props: {
  },
  data() {
    return {
      coma: "",
      id: 0,
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

    cancel() {
      this.$router.push("/consolidate");
    },
    async saveMember() {
      if (!this.$refs.form.validate()) return;
      await this.$repository.Member.update(this.id, this.member)
        .then(res => {
          this.$router.push("/consolidate");
        })
        .catch(e => { });
    }
  },
  mounted() {
    let me = this;
  }
}
</script>

