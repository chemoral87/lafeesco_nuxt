<template>
  <div>
    <v-data-table fixed-header :page.sync="page" @page-count="pageCount = $event" dense mobile-breakpoint="0" :must-sort="true" :headers="headers" :items="items" :options.sync="optionsTable" :server-items-length="total" class="elevation-1">
      <!-- https://stackoverflow.com/questions/61344980/v-slot-directive-doesnt-support-any-modifier -->
      <template v-slot:[`item.permissions`]="{ item }">
        <v-chip v-for="it in item.permissions" :key="it.id" class="ma-2" color="primary">
          {{it.name}}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn title="Editar" outlined class="mr-1 my-1" color="primary" fab small @click="editRole(item)">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn title="Permisos" outlined class="mr-1 my-1" color="success" fab small @click="editPermissions(item)">
          <v-icon>
            mdi-key
          </v-icon>
        </v-btn>
        <v-btn title="Eliminar" outlined color="error" class="my-1" fab small @click="deleteRole(item)">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

  </div>
  <!-- <v-pagination v-model="page" :length="pageCount"></v-pagination> -->

</template>
<script>
export default {
  props: ['response', 'options'],
  data() {
    return {
      optionsTable: {},
      headers: [
        { text: 'Nombre', align: 'start', value: 'name', width: "7rem" },
        { text: "Permisos", value: "permissions", sortable: false, width: "50rem" },
        { text: 'Acciones', value: 'actions', sortable: false, width: "11rem" },
      ],
      page: 1,
      pageCount: 1,
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
    editRole(item) {
      this.$emit("edit", item);
    },
    editPermissions(item) {
      this.$emit("editPermissions", item);
    },
    deleteRole(item) {
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
