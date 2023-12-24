<template>
  <v-dialog :value="true" persistent width="400px">
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">{{ iconTitle }}</v-icon>
        <span class="text-h5">{{ formTitle }}</span>
        <v-spacer />
        <v-icon @click.native="close"> $delete </v-icon>
      </v-card-title>
      <v-form ref="form" @submit.prevent="save">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-select
                outlined
                hide-details
                label="Municipio"
                v-model="item.municipality_id"
                :items="municipalities"
                item-value="id"
                item-text="name"
                :clearable="true"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                outlined
                label="Otro Municipio"
                v-model="item.other_municipality"
                hide-details
              />
            </v-col>
            <v-col cols="7">
              <v-text-field
                outlined
                label="Calle"
                v-model="item.street"
                :rules="[(v) => !!v || 'Campo requerido']"
              />
            </v-col>
            <v-col cols="5">
              <v-text-field
                outlined
                label="Número "
                v-model="item.number"
                :rules="[(v) => !!v || 'Campo requerido']"
              />
            </v-col>
            <v-col cols="7">
              <v-text-field outlined label="Colonia " v-model="item.suburn" />
            </v-col>
            <v-col cols="5">
              <v-text-field
                outlined
                label="Código Postal "
                v-model="item.postal_code"
                hide-details
              />
            </v-col>
            <v-col cols="7">
              <v-text-field
                outlined
                label="Teléfono de Casa"
                type="tel"
                v-model="item.telephone"
                v-mask="'##-####-####'"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" class="mr-1" outlined @click.native="close">
            Cancelar
          </v-btn>
          <v-btn color="primary" type="submit"> Guardar </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      municipalities: [
        { id: 1, name: "Escobedo" },
        { id: 2, name: "García" },
        { id: 3, name: "San Nicolás" },
        { id: 4, name: "Monterrey" }
      ],
      item: {}
    };
  },
  computed: {
    iconTitle() {
      return "mdi-home-city";
      // if (this.item.id) {
      //   return "mdi-pencil";
      // } else {
      //   return "mdi-plus";
      // }
    },
    formTitle() {
      return "Domicilio";
      // if (this.item.id) {
      //   return "Añadir domicilio";
      // } else {
      //   return "Nuevo Permiso";
      // }
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      if (this.$refs.form.validate()) this.$emit("save", this.item);
    }
  },
  mounted() {}
};
</script>
