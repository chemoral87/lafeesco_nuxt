<template>
  <v-container>
    <v-form ref="formRegistration" @submit.prevent="save">
      <v-row dense>
        <v-col cols="12" md="3">
          <v-text-field
            @keyup.enter="save"
            v-model="item.name"
            label="Nombre"
            :rules="[rules.required]"
            :error-messages="errors?.name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            @keyup.enter="save"
            v-model="item.last_name"
            label="Ap. Paterno"
            :rules="[rules.required]"
            :error-messages="errors?.last_name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            @keyup.enter="save"
            v-model="item.second_last_name"
            label="Ap. materno"
            :error-messages="errors?.second_last_name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            @keyup.enter="save"
            v-model="item.email"
            :rules="[rules.required]"
            label="E-mail"
            :error-messages="errors?.email"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field @keyup.enter="save" v-model="item.cellphone" label="Celular" :error-messages="errors?.cellphone"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            @keyup.enter="save"
            v-model="item.password"
            :rules="[rules.required]"
            label="Contraseña"
            type="password"
            :error-messages="errors?.password"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            @keyup.enter="save"
            v-model="item.confirm_password"
            :rules="[rules.required]"
            label="Confirma Contraseña"
            type="password"
          ></v-text-field>
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
      item: {
        second_last_name: ''
      },
      rules: {
        required: (value) => {
          return !!value || 'Requerido.'
        },
        min: (v) => v.length >= 8 || 'Min 8 characters'
      }
    }
  },
  methods: {
    async save() {
      let me = this
      if (!this.$refs.formRegistration.validate()) return
      await this.$repository.User.register(this.item)
        .then((res) => {
          me.$router.push('/login')
        })
        .catch((e) => {})
    },
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
