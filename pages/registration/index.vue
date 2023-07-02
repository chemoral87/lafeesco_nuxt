<template>
  <v-container>
    <v-form ref="form" @submit.prevent="save">
      <v-row dense>
        <v-col cols="12" md="3">
          <v-text-field @keyup.enter="save" v-model="item.name" label="Nombre" :error-messages="errors?.name"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field @keyup.enter="save" v-model="item.last_name" label="Ap. Paterno" :error-messages="errors?.last_name"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            @keyup.enter="save"
            v-model="item.second_last_name"
            label="Ap. materno"
            :error-messages="errors?.second_last_name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" v-if="!item.id">
          <v-text-field @keyup.enter="save" v-model="item.email" label="E-mail" :error-messages="errors?.email"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field @keyup.enter="save" v-model="item.cellphone" label="Celular" :error-messages="errors?.cellphone"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="auto">
          <v-btn color="primary" class="mr-1" outlined @click="gotoMain"> Cancelar </v-btn>
          <v-btn color="primary" type="submit"> Guardar </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      item: {}
    }
  },
  methods: {
    save() {},
    gotoMain() {
      this.$router.push('/landing')
    }
  },
  mounted() {
    let me = this
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Registro',
      icon: 'pencil'
    })
  }
}
</script>
