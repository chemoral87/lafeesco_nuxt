<template>
  <v-dialog :value="true" persistent width="600px">
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">{{ iconTitle }}</v-icon>
        <span class="text-h5">{{ formTitle }}</span>
        <v-spacer />
        <v-icon @click.native="close"> $delete </v-icon>
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              @keyup.enter="save"
              v-model="item.name"
              label="Nombre del ejercicio"
              :error-messages="errors?.name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="item.default_unit"
              :items="unitOptions"
              label="Unidad por defecto"
              :error-messages="errors?.default_unit"
              required
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="item.muscles"
              :items="muscleOptions"
              label="Músculos que trabaja"
              multiple
              chips
              deletable-chips
              :error-messages="errors?.muscles"
              hint="Selecciona o escribe los músculos que trabaja este ejercicio"
              persistent-hint
            ></v-combobox>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="item.description"
              label="Descripción"
              :error-messages="errors?.description"
              rows="3"
              hint="Descripción detallada del ejercicio"
              persistent-hint
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" class="mr-1" outlined @click.native="close">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click.native="save"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value", "exercise"],
  data() {
    return {
      item: {
        name: "",
        muscles: [],
        default_unit: "kg",
        description: "",
      },
      unitOptions: [
        { text: "Kilogramos (kg)", value: "kg" },
        { text: "Libras (lb)", value: "lb" },
        { text: "Metros (mt)", value: "mt" },
      ],
      muscleOptions: [
        "Pecho",
        "Espalda",
        "Hombros",
        "Bíceps",
        "Tríceps",
        "Antebrazos",
        "Abdominales",
        "Core",
        "Glúteos",
        "Cuádriceps",
        "Isquiotibiales",
        "Pantorrillas",
        "Cardio",
        "Cuerpo completo",
      ],
    };
  },
  computed: {
    iconTitle() {
      if (this.item.id) {
        return "mdi-pencil";
      } else {
        return "mdi-plus";
      }
    },
    formTitle() {
      if (this.item.id) {
        return "Editar Ejercicio";
      } else {
        return "Nuevo Ejercicio";
      }
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save", this.item);
    },
  },
  mounted() {
    if (this.exercise) {
      this.item = Object.assign({}, this.exercise);
      // Ensure muscles is an array
      if (typeof this.item.muscles === "string") {
        try {
          this.item.muscles = JSON.parse(this.item.muscles);
        } catch (e) {
          this.item.muscles = [];
        }
      }
    }
  },
};
</script>
