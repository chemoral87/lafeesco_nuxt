<template>
  <div>
    <v-data-table dense mobile-breakpoint="0" @update:sort-by="sortTable" :must-sort="true" :headers="headers" :items="items" :options.sync="optionsTable" :server-items-length="total" class="elevation-1 xwidth900">
      <template v-slot:[`item.full_name`]="{ item }">
        {{ getfullName(item.name, item.paternal_surname, item.maternal_surname) }}
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
        <v-btn title="LLamar" class="ma-1" color="primary" small @click="emitAction('toCall', item)">
          <v-icon>
            mdi-clipboard-text
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:[`item.last_call_date`]="{ item }">
        <div v-if="item.last_call_date">
          {{ item.last_call_date | moment("DD MMM YYYY HH:mm") }} |
          <strong>{{ item.last_call_type }}</strong>
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('consolidador-index'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  created() {

    this.$nuxt.$emit("setNavBar", { title: "Seguimiento", icon: "phone" });
  },
  props: ['response', 'options', "tableHeaders"],
  data() {
    return {
      flagSetOption: true,
      optionsTable: {},
      sortDesc: false,
      headers: [
        { text: 'Acciones', value: 'actions', sortable: false },
        { text: 'Nombre Completo', align: 'start', value: 'full_name', sortable: false },
        // { text: 'Celular', value: 'cellphone', sortable: false },
        { text: 'Grupo', value: 'category', sortable: false },
        { text: 'Edad', value: 'years', sortable: false },
        { text: 'Fecha Creación', value: 'created_at', firstSortDesc: true },
        {
          text: 'Siguiente Llamadas', value: 'next_call_date',
        },
        { text: 'Última Llamada', value: 'last_call_date', },

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
    sortTable(columnName) {
      if (this.flagSetOption) {
        this.flagSetOption = false;
      } else {
        let head = this.headers.find(x => x.value == columnName);
        // console.log(columnName);
        // if (columnName == "next_call_date" || columnName == "created_at")
        if (head.firstSortDesc)
          this.optionsTable.sortDesc[0] = true;
      }

    },
    emitAction(action, payload) {
      this.$emit(action, payload);
    },
    getfullName(name, paternal_surname, maternal_surname) {
      return [name, paternal_surname, maternal_surname].filter(Boolean).join(" ");
    },
    sort_desc: function (val, _prev) {
      console.log(val, _prev);
      //do what you need to change sort and refresh
    },
  },
  mounted() {
    let me = this;
    this.optionsTable = this.options;
    if (this)
      me.$nextTick(() => {
        me.options_watch = me.$watch('optionsTable', function () {
          this.$emit("sorting", this.optionsTable);
        }, {
          immediate: false
        });
      });
  }
}
</script>
