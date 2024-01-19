<template>
  <v-container fluid style="max-width: 800px">
    <v-card>
      <v-img src="banner_casa_fe2.png"></v-img>
      <v-card-title>¿Quieres asistir a una casa de fe?</v-card-title>
      <v-form ref="form" @submit.prevent="submit">
        <v-card-text>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                label="Nombre Completo"
                v-model="name"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Edad" v-mask="'##'" v-model="age"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Teléfono"
                v-model="phone"
                v-mask="'##-####-####'"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Calle"
                v-model="street_address"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Número"
                v-model="house_number"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Colonia"
                v-model="neighborhood"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field label="Municipio" v-model="municipality"></v-text-field>
            </v-col>
          </v-row>

          <div v-if="submitted">
            <p>Gracias por tu interés. Nos pondremos en contacto contigo.</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer /> <v-btn color="primary" large type="submit">Enviar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
export default {
  layout: "none",
  props: {},
  data() {
    return {
      rules: {
        required: (value) => {
          return !!value || "Requerido.";
        },
        min: (v) => v.length >= 8 || "Min 8 characters"
      },
      name: "",
      age: "",

      phone: "",
      street_address: "",
      house_number: "",
      neighborhood: "",
      municipality: "",

      submitted: false
    };
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) return;
      let me = this;
      let data = {
        name: me.name,
        age: me.age,

        phone: me.phone,
        street_address: me.street_address,
        house_number: me.house_number,
        neighborhood: me.neighborhood,
        municipality: me.municipality
      };
      console.log(data);
      me.submitted = true;
    }
  },
  mounted() {
    let me = this;
  }
};
</script>
