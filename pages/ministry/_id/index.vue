<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveMinistry">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="name" v-model="ministry.name" :rules="[(v) => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="order" v-model="ministry.order" :rules="[(v) => !!v || 'Campo requerido']" />
        </v-col>
        <v-col cols="12" md="6">
          <UserCombobox :users="ministry.leaders" :label="'Lideres'" @modelChange="setLeaders"></UserCombobox>
        </v-col>
        <v-col cols="6" md="3">
          <v-color-picker show-swatches hide-canvas hide-inputs v-model="ministry.color"></v-color-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="auto">
          <v-btn @click.native="cancel" color="primary" outlined class="mr-1">
            <span>Cancelar</span>
            <v-icon>mdi-cancel</v-icon>
          </v-btn>

          <v-btn type="submit" color="primary" class="mr-4">
            <span>Guardar</span>
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      ministry: {}
    }
  },
  methods: {
    setLeaders(leaders) {
      this.ministry.leaders = leaders
    },
    async saveMinistry() {
      if (!this.$refs.form.validate()) return

      await this.$repository.Ministry.update(this.ministry.id, this.ministry)
        .then((res) => {
          this.$router.push('/ministry')
        })
        .catch((e) => {
          alert(e)
        })
    },
    cancel() {
      this.$router.push('/ministry')
    }
  },
  middleware: ['authenticated'],
  validate({ store, error }) {
    return true
    let permission = 'ministry-update'
    if (store.getters.permissions.includes(permission)) return true
    else
      throw error({
        statusCode: 403,
        message: `Permission required ${permission}`
      })
  },
  async asyncData({ $axios, app, params }) {
    const ministry = await app.$repository.Ministry.show(params.id).catch((e) => {})
    return { ministry, id: params.id }
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Editar Ministerio',
      icon: 'human-greeting-variant'
    })
  }
}
</script>
