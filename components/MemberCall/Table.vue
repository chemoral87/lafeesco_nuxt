<template>
  <v-data-table
    dense
    mobile-breakpoint="0"
    @update:sort-by="sortTable"
    :must-sort="true"
    :headers="headers"
    :items="items"
    :options.sync="optionsTable"
    :server-items-length="total"
    class="elevation-1 xwidth1100"
  >
    <template v-slot:[`item.full_name`]="{ item }">
      {{ getfullName(item.name, item.paternal_surname, item.maternal_surname) }}
    </template>
    <template v-slot:[`item.was_contacted`]="{ item }">
      <div v-if="item.was_contacted">
        <v-chip color="success"> SI </v-chip>
      </div>
      <div v-else>
        <v-chip color="warning"> No </v-chip>
      </div>
    </template>
    <template v-slot:[`item.next_call_date`]="{ item }">
      <div v-if="item.next_call_date">
        {{ item.next_call_date | moment("DD MMM YYYY") }} |
        <strong>{{ item.next_call_type }}</strong>
      </div>
    </template>
    <template v-slot:[`item.created_at`]="{ item }">
      {{ item.created_at | moment("DD MMM YYYY/hh:mma") }}
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        @click="emitAction('edit', item)"
        color="primary"
        class="ma-1"
        outlined
        fab
        small
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: ["response", "options", "tableHeaders"],
  data() {
    return {
      flagSetOption: true,
      pageRule: 1,
      optionsTable: {},
      pageCountRule: 0,
      sortDesc: false,
      headers: [
        { text: "Contactado?", value: "was_contacted", sortable: false },
        { text: "Tipo de Llamada", value: "call_type", sortable: false },
        { text: "Comentarios", value: "comments", sortable: false },
        { text: "Fecha Creación", value: "created_at", firstSortDesc: true },
        { text: "Creado por", value: "created_name", sortable: false },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    total() {
      if (this.response) return this.response.total;
      else return 0;
    },
    items() {
      if (this.response) return this.response.data;
      else return [];
    },
  },
  methods: {
    sortTable(columnName) {
      if (this.flagSetOption) {
        this.flagSetOption = false;
      } else {
        let head = this.headers.find((x) => x.value == columnName);
        if (head.firstSortDesc) this.optionsTable.sortDesc[0] = true;
      }
    },
    emitAction(action, payload) {
      this.$emit(action, payload);
    },
    getfullName(name, paternal_surname, maternal_surname) {
      return [name, paternal_surname, maternal_surname]
        .filter(Boolean)
        .join(" ");
    },
    sort_desc: function (val, _prev) {},
  },
  mounted() {
    let me = this;
    this.optionsTable = this.options;
    if (this)
      me.$nextTick(() => {
        me.options_watch = me.$watch(
          "optionsTable",
          function () {
            this.$emit("sorting", this.optionsTable);
          },
          {
            immediate: false,
          }
        );
      });
  },
};
</script>
