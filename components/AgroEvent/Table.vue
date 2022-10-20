<template>
  <div>
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
  props: ["agroEvents", "dialogDelete"],
  data() {
    return {
      dialogDeleteProp: {},
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
    confirmDelete(item) {
      this.dialogDeleteProp = {
        text: "Desea eliminar el Evento ",
        strong: item.name,
        payload: item,
      };
      this.$emit("update:dialogDelete", true);
    },
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
