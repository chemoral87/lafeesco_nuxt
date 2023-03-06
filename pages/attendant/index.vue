<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field append-icon="mdi-magnify" clearable hide-details v-model="filterAttendant" placeholder="Filtro"></v-text-field>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn color="success" @click="$router.push('attendant/new')" class="mb-1 mr-1">
          <v-icon class="mr-1">mdi-account-plus</v-icon> Nuevo Servidor
        </v-btn>
      </v-col>
      <v-col cols="12">
        <AttendantTable
          @sorting="indexAttendant"
          :options="options"
          :response="response"
          @edit="editAttendant"
          @delete="deleteAttendant"
          :dialogDelete.sync="dialogDeleteAttendant"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios, app }) {
    let options = {
      sortBy: ['name'],
      sortDesc: [true],
      itemsPerPage: 20
    }
    const response = await app.$repository.Attendant.index(options).catch((e) => {})
    return { response, options }
  },
  watch: {
    async filterAttendant(value) {
      let me = this
      this.$store.dispatch('hideNextLoading')
      let op = Object.assign(me.options, { filter: value, page: 1 })
      me.response = await me.$repository.Attendant.index(op)
    }
  },
  methods: {
    async indexAttendant(options) {
      // let me = this;
      // let op = Object.assign(me.options, { page: 1 });
      // me.response = me.$repository.Attendant.index(op);

      if (options) {
        this.options = options
      }
      let op = Object.assign({ filter: this.filter }, this.options)
      this.response = await this.$repository.Attendant.index(op)
    },
    editAttendant(item) {
      this.$router.push(`/attendant/${item.id}`)
    },
    async deleteAttendant(item) {
      await this.$repository.Attendant.delete(item.id)
        .then((res) => {
          this.dialogDeleteAttendant = false
          this.index()
        })
        .catch((e) => {})
    },
    async index(options) {
      if (options) {
        this.options = options
      }
      let op = Object.assign({ filter: this.filter }, this.options)
      this.response = await this.$repository.Attendant.index(op)
    }
  },
  data() {
    return {
      dialogDeleteAttendant: false,
      options: {},
      response: {},
      filterAttendant: ''
    }
  },
  middleware: ['authenticated'],
  validate({ store, error }) {
    return true
    if (store.getters.permissions.includes('attendant-index')) return true
    else throw error({ statusCode: 403 })
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Servidores',
      icon: 'human-greeting-variant'
    })
  }
}
</script>
