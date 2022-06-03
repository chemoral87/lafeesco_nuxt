<template>
  <div>
    <v-data-table dense mobile-breakpoint="0" :must-sort="true" :headers="headers" :items="items" :options.sync="optionsTable" :server-items-length="total" class="elevation-1">
      <!-- https://stackoverflow.com/questions/61344980/v-slot-directive-doesnt-support-any-modifier -->
      <template v-slot:[`item.full_name`]="{ item }">

        {{ getfullName(item.name, item.paternal_surname, item.maternal_surname) }}

      </template>
      <template v-slot:[`item.created_at`]="{ item }">

        {{ item.created_at | moment("DD MMM YYYY/hh:mma") }}

      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn title="Editar" class="ma-1" color="primary" outlined fab small @click="emitAction('edit', item)">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>

        <v-btn title="Eliminar" class="ma-1" color="error" outlined fab small @click="emitAction('delete' ,item)">
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
        { text: 'Nombre Completo', align: 'start', value: 'full_name', sortable: false },
        { text: 'Celular', value: 'cellphone', sortable: false },
        { text: 'Categoría', value: 'category', sortable: false },
        { text: 'Edad', value: 'years', sortable: false },
        { text: 'Fecha Creación', value: 'created_at', },
        { text: 'Acciones', value: 'actions', width: "200px", sortable: false },
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
    emitAction(action, payload) {
      this.$emit(action, payload);
    },
    getfullName(name, paternal_surname, maternal_surname) {
      return [name, paternal_surname, maternal_surname].filter(Boolean).join(" ");
    },
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
