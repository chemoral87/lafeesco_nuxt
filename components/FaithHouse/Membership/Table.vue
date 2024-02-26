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
      class="elevation-1 xwidth1300"
    >
      <!-- https://stackoverflow.com/questions/61344980/v-slot-directive-doesnt-support-any-modifier -->

      <template v-slot:[`item.created_at`]="{ item }">
        {{ item.created_at | moment("DD MMM YYYY/hh:mma") }}
      </template>
      <template v-slot:[`item.full_address`]="{ item }">
        {{ item.street_address }} {{ item.house_number }}, {{ item.neighborhood }},
        {{ item.municipality }}
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
        <v-btn
          title="Ver"
          class="ma-1"
          color="info"
          outlined
          fab
          small
          @click="emitAction('focus', item)"
        >
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
        (item) => {
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
        { text: "Acción", value: "actions", sortable: false },
        { text: "Nombre ", value: "name" },
        { text: "Edad", value: "age", sortable: false },
        { text: "Teléfono", value: "phone", sortable: false },
        { text: "Domicilio", value: "full_address", sortable: false },
        { text: "Origen", value: "source" },
        { text: "Fecha Captura", value: "created_at" }
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
        let head = this.headers.find((x) => x.value == columnName);
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
