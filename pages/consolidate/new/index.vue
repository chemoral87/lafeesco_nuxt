<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveMember">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Nombre" v-model="member.name" :rules="[(v) => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Ape. Paterno" v-model="member.paternal_surname" :rules="[(v) => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Ape. Materno" v-model="member.maternal_surname" />
        </v-col>
        <v-col cols="6" md="3">
          <!-- <v-text-field type="date" outlined label="Fecha cumpleaños" v-model="member.birthday" :persistent-placeholder="true" /> -->

          <v-text-field
            outlined
            label="Fecha cumpleaños"
            v-model="member.birthday"
            v-mask="'##-##-####'"
            :persistent-placeholder="true"
            placeholder="dd-mm-aaaa"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Celular" v-model="member.cellphone" v-mask="'##-####-####'" type="tel" />
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            outlined
            hide-details
            label="Estado Civil"
            v-model="member.marital_status_id"
            :items="marital_statuses"
            item-value="id"
            item-text="name"
            :clearable="true"
          ></v-select>
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            outlined
            hide-details
            label="Grupo"
            v-model="member.category_id"
            :items="member_groups"
            item-value="id"
            item-text="name"
            :clearable="true"
          ></v-select>
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            outlined
            label="Horario"
            v-model="member.source_id"
            :items="member_sources"
            item-value="id"
            item-text="name"
            :clearable="true"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="6">
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
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("consolidador-insert")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nuevo Miembro",
      icon: "account-plus",
    });
  },
  async asyncData({ $axios, app, store }) {
    var marital_statuses = await store.dispatch("catalogs/fetchMaritalStatuses");
    var member_groups = await store.dispatch("catalogs/fetchMemberCategories");
    var member_sources = await store.dispatch("catalogs/fetchMemberSources");

    return { marital_statuses, member_groups, member_sources };
  },
  props: {},
  data() {
    return {
      member: {},
      marital_statuses: [],
      member_sources: [],
      member_groups: [],
    };
  },
  methods: {
    cancel() {
      this.$router.push("/consolidate");
    },
    async saveMember() {
      if (!this.$refs.form.validate()) return;
      await this.$repository.Member.create(this.member)
        .then((res) => {
          this.$router.push("/consolidate");
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
