<template>
  <div>
    <v-data-table mobile-breakpoint="0" :must-sort="true" :headers="headers" :items="items" :options.sync="optionsTable" :server-items-length="total" class="elevation-1">
      <!-- https://stackoverflow.com/questions/61344980/v-slot-directive-doesnt-support-any-modifier -->
      <template v-slot:[`item.roles`]="{ item }">
        <v-chip v-for="it in item.roles" :key="it.id" class="ma-2" color="primary">
          {{it.name}}
        </v-chip>
      </template>
      <template v-slot:[`item.direct_permissions`]="{ item }">
        <v-chip v-for="it in item.permissions" :key="it.id" class="ma-2" color="info">
          {{it.name}}
        </v-chip>

      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn title="Editar" class="ma-1" color="primary" outlined fab small @click="edit(item)">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn title="Roles y Permisos" class="ma-1" color="success" outlined fab small @click="editRoles(item)">
          <v-icon>
            mdi-redhat
          </v-icon>
        </v-btn>
        <v-btn title="Eliminar" class="ma-1" color="error" outlined fab small @click="deleteItem(item)">
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
        { text: 'Nombre', align: 'start', value: 'name' },
        { text: 'Ap. Paterno', value: 'last_name' },
        { text: 'Ap. Materno', value: 'second_last_name' },
        { text: 'E-Mail', value: 'email' },
        { text: 'Roles', value: 'roles' },
        { text: 'Permisos Directos', value: 'direct_permissions' },
        { text: 'Acciones', value: 'actions', width: "200px", sortable: false, },
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
    editRoles(item) {
      this.$emit("editRoles", item);
    },
    edit(item) {
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