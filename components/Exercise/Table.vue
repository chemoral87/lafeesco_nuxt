<template>
  <div>
    <v-data-table
      dense
      mobile-breakpoint="0"
      :must-sort="true"
      :headers="headers"
      :items="items"
      :options.sync="optionsTable"
      :server-items-length="total"
      :loading="loading"
      loading-text="Cargando ejercicios..."
      class="elevation-1"
    >
      <template v-slot:[`item.muscles`]="{ item }">
        <v-chip
          v-for="muscle in item.muscles"
          :key="muscle"
          small
          class="ma-1"
          color="primary"
          outlined
        >
          {{ muscle }}
        </v-chip>
      </template>
      <template v-slot:[`item.default_unit`]="{ item }">
        <v-chip small :color="getUnitColor(item.default_unit)">
          {{ item.default_unit.toUpperCase() }}
        </v-chip>
      </template>
      <template v-slot:[`item.description`]="{ item }">
        <span :title="item.description">
          {{
            item.description
              ? item.description.substring(0, 50) +
                (item.description.length > 50 ? "..." : "")
              : ""
          }}
        </span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          color="primary"
          fab
          small
          outlined
          @click="editItem(item)"
          class="mr-1 my-1"
        >
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-btn
          color="error"
          fab
          small
          outlined
          @click="deleteItem(item)"
          class="my-1"
        >
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  props: ["response", "options", "loading"],
  data() {
    return {
      optionsTable: {},
      headers: [
        { text: "Nombre", value: "name" },
        { text: "Músculos", value: "muscles", sortable: false },
        { text: "Unidad", value: "default_unit" },
        { text: "Descripción", value: "description", sortable: false },
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
    editItem(item) {
      this.$emit("edit", item);
    },
    deleteItem(item) {
      this.$emit("delete", item);
    },
    getUnitColor(unit) {
      switch (unit) {
        case "kg":
          return "blue";
        case "lb":
          return "green";
        case "mt":
          return "orange";
        default:
          return "grey";
      }
    },
  },
  mounted() {
    let me = this;
    this.optionsTable = this.options;
    me.$nextTick(() => {
      me.options_watch = me.$watch(
        "optionsTable",
        function () {
          this.$emit("sorting", me.optionsTable);
        },
        {
          immediate: false,
        }
      );
    });
  },
};
</script>
