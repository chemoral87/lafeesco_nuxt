<template>
  <div>
    <v-form
      ref="filterForm"
      @submit.prevent="
        () => {
          return indexMyMembers()
        }
      "
    >
      <v-row dense>
        <v-col cols="12" md="3">
          <v-text-field clearable hide-details v-model="filter" placeholder="Filtro Nombre">
            <template v-slot:append-outer>
              <v-btn type="submit">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="12">
          <MemberTable @sorting="indexMyMembers" :options="options" :response="response" @edit="editMember" @delete="" />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
export default {
  middleware: ['authenticated'],
  validate({ store, error }) {
    if (store.getters.permissions.includes('consolidador-index')) return true
    else throw error({ statusCode: 403 })
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Mis Consolidados',
      icon: 'account-group'
    })
  },
  async asyncData({ $axios, app }) {
    let options = {
      sortBy: ['created_at'],
      sortDesc: [true],
      itemsPerPage: 10
    }
    const response = await app.$repository.Member.indexMy(options).catch((e) => {})
    return { response, options }
  },
  watch: {
    async filter(value) {
      if (value == null) {
        this.indexMyMembers()
      }
    }
  },
  props: {},
  data() {
    return {
      response: {},
      options: {},
      filter: ''
    }
  },
  methods: {
    async indexMyMembers(options) {
      if (options) {
        this.options = options
      }
      let op = Object.assign({ filter: this.filter }, this.options)
      this.response = await this.$repository.Member.indexMy(op)
    },
    editMember(item) {
      this.$router.push(`/consolidate/my/${item.id}`)
    }
  },
  mounted() {
    let me = this
  }
}
</script>
