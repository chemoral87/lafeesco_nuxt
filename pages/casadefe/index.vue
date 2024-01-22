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
                v-model="item.name"
                :rules="[rules.required]"
                :readonly="submitted"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field label="Edad" v-mask="'##'" v-model="item.age"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Teléfono"
                v-model="item.phone"
                v-mask="'##-####-####'"
                :rules="[rules.required]"
                :readonly="submitted"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Calle"
                v-model="item.street_address"
                :rules="[rules.required]"
                :readonly="submitted"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                label="Número"
                v-model="item.house_number"
                :rules="[rules.required]"
                :readonly="submitted"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Colonia"
                v-model="item.neighborhood"
                :rules="[rules.required]"
                :readonly="submitted"
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field
                label="Municipio"
                v-model="item.municipality"
                :readonly="submitted"
              ></v-text-field>
            </v-col>
          </v-row>

          <div v-if="submitted">
            <p>Gracias por tu interés. Nos pondremos en contacto contigo.</p>
          </div>
        </v-card-text>
        <v-card-actions v-if="!submitted">
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
      item: {
        name: "",
        age: "",
        phone: "",
        street_address: "",
        house_number: "",
        neighborhood: "",
        municipality: "",
        lat: "",
        lng: ""
      },
      full_adress: "",
      places: [],

      submitted: false
    };
  },
  methods: {
    searchPlaces() {
      const service = new google.maps.places.AutocompleteService();

      service.getQueryPredictions({ input: this.full_adress }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.places = predictions;
          this.selectPlace(this.places[0]);
        } else {
          this.places = [];
          this.saveMembership();
        }
      });
    },
    selectPlace(place) {
      console.log("Selected Place:", place);
      const placeService = new google.maps.places.PlacesService(
        document.createElement("div")
      );

      placeService.getDetails({ placeId: place.place_id }, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const coordinates = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          };
          this.item.lat = coordinates.lat;
          this.item.lng = coordinates.lng;
          console.log("Selected Coordinates:", coordinates);
          this.saveMembership();
          // get near faith house
        }
      });
    },
    submit() {
      if (!this.$refs.form.validate()) return;
      let me = this;
      me.submitted = true;
      me.full_adress =
        me.item.street_address +
        " " +
        me.item.house_number +
        ", " +
        me.item.neighborhood +
        ", " +
        me.item.municipality;
      this.searchPlaces();
    },
    saveMembership() {
      let me = this;
      me.$repository.FaithHouseMembership.create(me.item).then((res) => {});
    }
  },
  mounted() {
    let me = this;
  }
};
</script>
