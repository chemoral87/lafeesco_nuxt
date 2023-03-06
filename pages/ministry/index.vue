<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field append-icon="mdi-magnify" clearable hide-details v-model="filterMinistry" placeholder="Filtro"></v-text-field>
      </v-col>
      <v-spacer />

      <v-col cols="auto">
        <v-btn color="success" @click="$router.push('ministry/new')" class="mb-1 mr-1"> <v-icon>mdi-plus</v-icon>Nuevo </v-btn>
      </v-col>
      <v-col cols="12">
        <MinistryTable
          @sorting="indexMinistry"
          :options="options"
          :response="response"
          @edit="editMinistry"
          @editPermissions="editRolePermissions"
          @delete="deleteMinistry"
          :dialogDelete.sync="dialogDeleteMinistry"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  async asyncData({ $axios, app }) {
    let options = {
      sortBy: ['order'],
      sortDesc: [false],
      itemsPerPage: 5
    }
    const response = await app.$repository.Ministry.index(options).catch((e) => {})
    return { response, options }
  },
  watch: {
    async filterMinistry(value) {
      let me = this
      this.$store.dispatch('hideNextLoading')
      let op = Object.assign(me.options, { filter: value, page: 1 })
      me.response = await me.$repository.Ministry.index(op)
    }
  },
  methods: {
    async indexMinistry(options) {
      if (options) {
        this.options = Object.assign(this.options, options)
      }
      let op = Object.assign({ filter: this.filter }, this.options)
      this.response = await this.$repository.Ministry.index(op)
    },
    editMinistry(item) {
      this.$router.push(`/ministry/${item.id}`)
    },
    async deleteMinistry(item) {
      await this.$repository.Ministry.delete(item.id)
        .then((res) => {
          this.dialogDeleteMinistry = false
          this.indexMinistry()
        })
        .catch((e) => {})
    }
  },
  data() {
    return {
      dialogDeleteMinistry: false,
      options: {},
      response: {},
      filterMinistry: ''
    }
  },
  middleware: ['authenticated'],
  validate({ store, error }) {
    return true
    if (store.getters.permissions.includes('ministry-index')) return true
    else throw error({ statusCode: 403 })
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Ministerios',
      icon: 'hand-heart'
    })
  }
}
</script>
