<template>
  <div>
    <v-data-table dense mobile-breakpoint="0" :must-sort="true" :headers="headers" :items="items" :options.sync="optionsTable" :server-items-length="total" class="elevation-1">

      DD-MMM-YYYY
      <template v-slot:[`item.contract_date`]="{ item }">
        {{ item.capital | moment( 'DD-MMM-YYYY') }}
      </template>
      <template v-slot:[`item.capital`]="{ item }">
        {{ item.capital | price }}
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn color="primary" fab small outlined @click="editItem(item)" class="mr-1 my-1">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn color="error" fab small outlined @click="deleteItem(item)" class="my-1">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  props: ['response', 'options'],
  data() {
    return {
      optionsTable: {},
      headers: [
        { text: 'Estado', value: 'status' },
        { text: 'Fecha Contrato', value: 'contract_date' },
        { text: 'Capital', value: 'capital', align: 'right' },
        { text: 'Plazo/Meses', value: 'months', align: 'right' },
        { text: 'Interés %', value: 'yield', align: 'right' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
    };
  },
  computed: {
    total() {
      if (this.response)
        return this.response.total;
      else return 0;
    },
    items() {
      if (this.response)
        return this.response.data;
      else return [];
    }
  },
  methods: {
    editItem(item) {
      this.$emit("edit", item);
    },
    deleteItem(item) {
      this.$emit("delete", item);
    }
  },
  mounted() {
    let me = this;
    this.optionsTable = this.options;
    me.$nextTick(() => {
      me.options_watch = me.$watch('optionsTable', function () {
        this.$emit("sorting", me.optionsTable);
      }, {
        immediate: false
      });
    });
  }
}
</script>
