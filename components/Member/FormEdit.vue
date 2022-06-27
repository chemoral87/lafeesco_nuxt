<template>
  <v-form ref="form" @submit.prevent="emitAction('save', item)">
    <v-row dense>
      <v-col cols="6" md="3">
        <v-text-field outlined label="Nombre" v-model="item.name" :rules="[v => !!v || 'Campo requerido']" ref="name" :hide-details="$refs.name && $refs.name.valid" />
      </v-col>
      <v-col cols="6" md="3">
        <v-text-field outlined label="Ape. Paterno" v-model="item.paternal_surname" :rules="[v => !!v || 'Campo requerido']" ref="paternal_name" :hide-details="$refs.paternal_name && $refs.paternal_name.valid" />
      </v-col>
      <v-col cols="6" md="3">
        <v-text-field outlined label="Ape. Materno" v-model="item.maternal_surname" hide-details />
      </v-col>
      <v-col cols="6" md="3">
        <v-text-field outlined label="Fecha cumpleaños" v-model="item.birthday" v-mask="'##-##-####'" :persistent-placeholder="true" placeholder="dd-mm-aaaa" hide-details />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6" md="3">
        <v-text-field outlined label="Celular" v-model="item.cellphone" v-mask="'##-####-####'" type="tel" hide-details />
      </v-col>
      <v-col cols="6" md="3">
        <v-select outlined label="Estado Civil" v-model="item.marital_status_id" :items="marital_statuses" item-value="id" item-text="name" :clearable="true" hide-details />
      </v-col>
      <v-col cols="6" md="3">
        <v-select outlined label="Grupo" v-model="item.category_id" :items="member_groups" item-value="id" item-text="name" :clearable="true" hide-details />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" md="6">
        <v-textarea outlined label="Petición Oración" name="prayer_request" v-model="item.prayer_request" rows="1" auto-grow hide-details></v-textarea>
      </v-col>
      <v-col cols="auto">
        <v-text-field label="Fecha Siguiente LLamada" v-model="item.next_call_date" outlined hide-details></v-text-field>
      </v-col>
    </v-row>
    <v-row dense>
      <v-spacer />
      <v-btn @click="emitAction('cancel')" outlined color="primary" class="mr-3">Cancelar</v-btn>
      <v-btn type="submit" color="primary" class="mr-4">Guardar</v-btn>
    </v-row>
  </v-form>
</template>
<script>
export default {
  props: ["member"],
  data() {
    return {
      item: {},
      marital_statuses: [],
      member_groups: []
    };
  },
  methods: {
    emitAction(event, payload) {
      this.$emit(event, payload);
    },
  },
  async created() {
    let me = this;
    const initialCatalog = await this.$repository.Consolidation.initialCatalog();
    this.marital_statuses = initialCatalog.marital_statuses;
    this.member_groups = initialCatalog.member_groups;
    me.item = this.member;
  },
  mounted() {

  }
}
</script>
