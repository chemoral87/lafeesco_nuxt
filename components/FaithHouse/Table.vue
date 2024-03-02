<template>
  <div>
    <v-data-table
      fixed-header
      height="300px"
      dense
      mobile-breakpoint="0"
      @update:sort-by="sortTable"
      :must-sort="true"
      :headers="headers"
      :items="items"
      :options.sync="optionsTable"
      :server-items-length="total"
      :footer-props="{
        'items-per-page-options': [10, 20, 30, 40, 50]
      }"
      class="elevation-1 xwidth1800"
    >
      <!-- https://stackoverflow.com/questions/61344980/v-slot-directive-doesnt-support-any-modifier -->
      <template v-slot:[`item.full_name`]="{ item }">
        {{ getfullName(item.name, item.paternal_surname, item.maternal_surname) }}
      </template>
      <template v-slot:[`item.next_call_date`]="{ item }">
        <div v-if="item.next_call_date">
          {{ item.next_call_date | moment("DD MMM YYYY") }} |
          <strong>{{ item.next_call_type }}</strong>
        </div>
      </template>
      <template v-slot:[`item.last_call_date`]="{ item }">
        <div v-if="item.last_call_date">
          {{ item.last_call_date | moment("DD MMM YYYY HH:mm") }} |
          <strong>{{ item.last_call_type }}</strong>
        </div>
      </template>
      <template v-slot:[`item.cellphone`]="{ item }">
        <span v-if="item.cellphone">
          {{ item.cellphone }}
        </span>
        <span v-else>
          <v-chip color="error">Sin Número</v-chip>
        </span>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        {{ item.created_at | moment("DD MMM YYYY/hh:mma") }}
      </template>
      <template v-slot:[`item.end_date`]="{ item }">
        {{ item.end_date | moment("DD MMM YYYY") }}
      </template>
      <template v-slot:[`item.allow_matching`]="{ item }">
        <v-chip :color="item.allow_matching ? 'success' : 'error'" text-color="white" small>
          {{ item.allow_matching ? "Si" : "No" }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          title="Editar"
          class="ma-1"
          color="primary"
          outlined
          fab
          small
          @click="emitAction('edit', item)"
          @contextmenu.prevent="emitAction('editContext', item)"
        >
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-btn title="Ver" class="ma-1" color="info" outlined fab small @click="emitAction('focus', item)">
          <v-icon> mdi-eye </v-icon>
        </v-btn>
        <v-btn @click="confirmDelete(item)" fab small color="error">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <DialogDelete
      v-if="dialogDelete"
      :dialog="dialogDeleteProp"
      @ok="
        item => {
          $emit('delete', item);
        }
      "
      @close="$emit('update:dialogDelete', false)"
    ></DialogDelete>
  </div>
</template>
<script>
export default {
  props: ["dialogDelete", "response", "options", "tableHeaders"],
  data() {
    return {
      dialogDeleteProp: {},
      flagSetOption: true,
      pageRule: 1,
      optionsTable: {},
      pageCountRule: 0,
      sortDesc: false,
      headers: [
        {
          text: "Acción",
          value: "actions"
        },
        {
          text: "Nombre ",
          value: "name"
        },
        // { text: "Anfitrión", value: "host", sortable: true },
        // { text: "Anfitrión Cel.", value: "host_phone", sortable: false },
        // { text: "Expositor", value: "exhibitor", sortable: true },

        // { text: "Expositor Cel.", value: "exhibitor_phone", sortable: false },
        {
          text: "Horario",
          value: "schedule"
        },
        {
          text: "Match",
          value: "allow_matching"
        },
        {
          text: "Orden",
          value: "order",
          sortable: true
        },
        {
          text: "Dirección",
          value: "address",
          sortable: true
        },
        { text: "Fecha Fin", value: "end_date", sortable: true }
      ]
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
    }
  },
  methods: {
    confirmDelete(item) {
      this.dialogDeleteProp = {
        text: "Desea eliminar la Casa de Fe ",
        strong: item.name,
        payload: item
      };
      this.$emit("update:dialogDelete", true);
    },
    sortTable(columnName) {
      if (this.flagSetOption) {
        this.flagSetOption = false;
      } else {
        let head = this.headers.find(x => x.value == columnName);
        if (head.firstSortDesc) this.optionsTable.sortDesc[0] = true;
      }
    },
    emitAction(action, payload) {
      this.$emit(action, payload);
    }
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
            immediate: false
          }
        );
      });
  }
};
</script>
