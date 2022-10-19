<template>
  <v-data-table :headers="headers" :items-per-page="5" :items="agroEvents">
    <template v-slot:[`item.images`]="{ item }">
      {{ item.images.length }}
    </template>
    <template v-slot:[`item.type_id`]="{ item }">
      {{ getType(item.type_id) }}
    </template>
    <template v-slot:[`item.created_at`]="{ item }">
      {{ item.created_at | moment("Y-MM-D hh:mm:ss a") }}
    </template>
    <template v-slot:[`item.action`]="{ item }">
      <v-btn
        title="Editar"
        class="ma-1"
        color="primary"
        outlined
        fab
        small
        @click="$emit('edit', item)"
      >
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
export default {
  props: ["agroEvents"],
  data() {
    return {
      headers: [
        {
          text: "Nombre",
          sortable: false,
          value: "name",
        },
        { text: "Descripción", value: "description" },
        { text: "#Imágenes", value: "images" },
        { text: "Tipo", value: "type_id" },
        { text: "Fecha", value: "created_at" },
        { text: "Acción", value: "action" },
      ],
    };
  },
  methods: {
    getType(id) {
      const type = {
        1: "Report",
        2: "Alarma",
        3: "Defecto",
        4: "Reparación",
      };
      return type[id];
    },
  },
};
</script>
