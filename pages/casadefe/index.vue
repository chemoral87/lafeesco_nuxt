<template>
  <v-container fluid style="max-width: 800px">
    <v-card>
      <v-img src="banner_casa_fe2.min.png"></v-img>
      <v-card-title class="py-1">Casas de Fe</v-card-title>
      <v-card-subtitle class="py-1">Castillo del Rey La Fe Escobedo</v-card-subtitle>

      <template v-if="!submitted">
        <v-card-text class="py-1"> LLene el formularo para asistir a una casa de Fe, y presione Enviar </v-card-text>
        <v-form ref="form" @submit.prevent="submit" lazy-validation>
          <v-card-text>
            <v-row dense>
              <v-col cols="9" md="4">
                <v-text-field
                  label="Nombre Completo"
                  v-model="item.name"
                  :rules="[rules.required]"
                  :readonly="submitted"
                />
              </v-col>
              <v-col cols="3" md="2">
                <v-text-field label="Edad" v-mask="'##'" v-model="item.age" :rules="[rules.required]" />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Teléfono"
                  v-model="item.phone"
                  v-mask="'##-####-#####'"
                  :rules="[rules.required, rules.min]"
                  :readonly="submitted"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="3">
                <v-select
                  label="Estado Civil"
                  v-model="item.marital_status"
                  :items="['Soltero', 'Casado', 'Unión Libre', 'Separado', 'Divorciado', 'Viudo']"
                  :rules="[rules.required]"
                />
              </v-col>
            </v-row>
            <v-row dense v-if="match.length == 0">
              <v-col cols="8" md="3">
                <v-text-field
                  label="Calle"
                  v-model="item.street_address"
                  :rules="[rules.required]"
                  :readonly="submitted"
                ></v-text-field>
              </v-col>
              <v-col cols="4" md="2">
                <v-text-field
                  label="Número"
                  v-model="item.house_number"
                  :rules="[rules.required]"
                  :readonly="submitted"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="4">
                <v-text-field
                  label="Colonia"
                  v-model="item.neighborhood"
                  :rules="[rules.required]"
                  :readonly="submitted"
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  label="Municipio"
                  v-model="item.municipality"
                  :readonly="submitted"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions> <v-spacer /> <v-btn color="primary" large type="submit">Enviar</v-btn> </v-card-actions>
        </v-form>
      </template>
      <v-card-text class="black--text pt-2" v-else>
        <span class="text-h6">{{ item.name }}</span>
        <p>
          Gracias por tu interés.
          <strong>
            <template v-if="match.length > 0">
              Esta es la casa de Fe más cerca de tu domicilio, en breve te contactarán.
            </template>
            <template v-else> En breve nos pondremos en contacto contigo.</template>
          </strong>
        </p>
        <v-row dense>
          <v-col cols="12" sm="6" lg="5" v-for="(faith_house, ix) in match" :key="faith_house.id + 'pxr'">
            <v-card class="fill-height">
              <v-card-title class="py-2 mb-1 d-flex justify-center primary white--text">
                {{ faith_house.name }}
              </v-card-title>
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-map-marker</v-icon>
                Col. {{ faith_house.neighborhood }}, {{ faith_house.municipality }}
              </v-card-text>
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-clock</v-icon>
                {{ faith_house.schedule }}
              </v-card-text>

              <v-row dense v-for="contact in faith_house.contacts" :key="contact.id">
                <v-col cols="8">
                  <v-card-text class="py-1">
                    <strong>{{ contact.role }}</strong>
                  </v-card-text>
                  <v-card-text class="py-1 list-subtitle">
                    <v-icon>mdi-account</v-icon>
                    {{ contact.name }} {{ contact.paternal_surname }}
                  </v-card-text>
                  <v-card-text class="py-1" v-if="contact.phone">
                    <v-icon>mdi-phone</v-icon>
                    {{ contact.phone }}
                  </v-card-text></v-col
                >
                <v-col cols="4">
                  <img class="image-cropper" style="width: 90%" :src="contact.photo" />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
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
        required: value => {
          return !!value || "Requerido.";
        },
        min: v => {
          return v.length >= 12 || "Teléfono 10 dígitos";
        }
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
      source: "",
      sourc: "",
      full_adress: "",
      places: [],
      match: [],
      submitted: false,
      neighborhood: "paraje anahuac",
      state: "escobedo, nuevo leon"
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
      const placeService = new google.maps.places.PlacesService(document.createElement("div"));

      placeService.getDetails({ placeId: place.place_id }, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const coordinates = {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng()
          };
          this.item.lat = coordinates.lat;
          this.item.lng = coordinates.lng;
          // console.log("Selected Coordinates:", coordinates);
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
        me.item.street_address + " " + me.item.house_number + ", " + me.item.neighborhood + ", " + me.item.municipality;
      this.searchPlaces();
    },
    saveMembership() {
      let me = this;
      // show loader
      me.item.source = this.source;
      me.$repository.FaithHouseMembership.create(me.item).then(res => {
        this.match = res.match;
      });
    }
  },
  computed: {},
  mounted() {
    let me = this;
    this.source = this.$route.query.source;
  }
};
</script>
<style scoped>
.image-cropper {
  border-radius: 50% !important;
}
</style>
