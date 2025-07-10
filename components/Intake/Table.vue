
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
          <v-btn
            title="Editar"
            class="ma-1"
            color="primary"
            outlined
            fab
            small
            @click="emitAction('edit', item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            title="Delete"
            class="ma-1"
            color="error"
            outlined
            fab
            small
            @click="confirmDelete(item)"
          >
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
    name: "IntakeTable",
    props: ["dialogDelete", "response", "options", "tableHeaders"],
    data() {
      return {
        optionsTable: {},
        pageCountRule: 0,
        sortDesc: false,
        headers: [
         {   text: "intake_time", value: "intake_time", sortable: true, firstSortDesc:true  },
         {   text: "intake_concept_id", value: "intake_concept_id", sortable: true },{   text: "measure_id", value: "measure_id", sortable: true },{   text: "quantity", value: "quantity", sortable: true },{   text: "created_by", value: "created_by", sortable: true },{   text: "updated_by", value: "updated_by", sortable: true },
          { text: "Acciones", value: "actions", width: "200px", sortable: false },
        ],
        dialogDeleteProp: {},
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
      confirmDelete(item) {
        this.dialogDeleteProp = {
          text: "Desea eliminar intake",
          strong: item.name,
          payload: item,
        };
        this.$emit("update:dialogDelete", true);
      },
      sortTable(columnName) {
          let head = this.headers.find((x) => x.value === columnName);
          if (head && typeof head.firstSortDesc !== 'undefined') {
            this.optionsTable.sortDesc[0] = head.firstSortDesc;
         }
      },
      emitAction(action, payload) {
        this.$emit(action, payload);
      },
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
  
        