<template>
  <div>
    <v-combobox
      v-model="model"
      :filter="filter"
      item-value="id"
      item-text="name"
      label="Ministerios"
      hide-selected
      :hide-no-data="!search"
      :items="items"
      :search-input.sync="search"
      v-bind="$attrs"
      multiple
    >
      <template v-slot:no-data>
        <v-list-item v-if="!searching"> Intente con otra búsqueda </v-list-item>
        <v-list-item v-else> Buscando... </v-list-item>
      </template>
      <template v-slot:selection="{ attrs, item, parent, selected }">
        <v-chip v-if="item === Object(item)" v-bind="attrs" color="primary" :input-value="selected" label>
          <span class="pr-2">
            {{ item.name }}
          </span>
          <v-icon small @click="parent.selectItem(item)"> $delete </v-icon>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-chip color="info" dark label small>
          {{ item.name }}
        </v-chip>
        <v-spacer></v-spacer>
      </template>
    </v-combobox>
  </div>
</template>
<script>
export default {
  props: ['ministries'],
  data: () => ({
    items: [],
    model: [],
    search: null,
    searching: false
  }),
  computed: {
    ministry_ids() {
      let ids = []
      this.model.forEach((element) => {
        ids.push(element.id)
      })
      return ids
    }
  },
  watch: {
    async search(val, prev) {
      this.searching = true
      if (!(val == null || val.trim() == '')) {
        this.$store.dispatch('hideNextLoading')
        let itemz = await this.$repository.Ministry.filter({ queryText: val, ids: this.ministry_ids })
        this.searching = false
        this.items = itemz
      }
    },
    model(val, prev) {
      if (val.length === prev.length) return
      var i = val.length
      while (i--) {
        if (typeof val[i] === 'string') {
          val.splice(i, 1)
        }
      }
      this.model = val
      this.$emit('modelChange', val)
    }
  },
  mounted() {
    this.model = this.ministries || []
  },
  methods: {
    filter(item, queryText, itemText) {
      const hasValue = (val) => (val != null ? val : '')
      const text = hasValue(itemText)
      const query = hasValue(queryText)
      return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
    }
  }
}
</script>
