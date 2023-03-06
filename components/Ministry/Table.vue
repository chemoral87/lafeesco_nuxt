<template>
  <div>
    <v-data-table
      dense
      mobile-breakpoint="0"
      @update:sort-by="sortTable"
      :must-sort="true"
      :headers="headers"
      :items="items"
      :options.sync="optionsTable"
      :server-items-length="total"
      class="elevation-1 xwidth1200"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn title="Editar" class="ma-1" color="primary" outlined fab small @click="emitAction('edit', item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn title="Delete" class="ma-1" color="error" outlined fab small @click="confirmDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <DialogDelete
      v-if="dialogDelete"
      :dialog="dialogDeleteProp"
      @ok="
        (item) => {
          $emit('delete', item)
        }
      "
      @close="$emit('update:dialogDelete', false)"
    ></DialogDelete>
  </div>
</template>
<script>
export default {
  props: ['dialogDelete', 'response', 'options', 'tableHeaders'],
  data() {
    return {
      optionsTable: {},
      pageCountRule: 0,
      sortDesc: true,
      headers: [
        { text: 'name', value: 'name', sortable: true },
        { text: 'order', value: 'order', sortable: true },
        { text: 'Acciones', value: 'actions', width: '200px', sortable: false }
      ],
      dialogDeleteProp: {}
    }
  },
  computed: {
    total() {
      if (this.response) return this.response.total
      else return 0
    },
    items() {
      if (this.response) return this.response.data
      else return []
    }
  },
  methods: {
    confirmDelete(item) {
      this.dialogDeleteProp = {
        text: 'Desea eliminar el ministerio',
        strong: item.name,
        payload: item
      }
      this.$emit('update:dialogDelete', true)
    },
    sortTable(columnName) {
      let head = this.headers.find((x) => x.value == columnName)
      if (head.firstSortDesc) this.optionsTable.sortDesc[0] = true
    },
    emitAction(action, payload) {
      this.$emit(action, payload)
    }
  },
  mounted() {
    let me = this
    this.optionsTable = this.options
    if (this)
      me.$nextTick(() => {
        me.options_watch = me.$watch(
          'optionsTable',
          function () {
            this.$emit('sorting', this.optionsTable)
          },
          {
            immediate: false
          }
        )
      })
  }
}
</script>
