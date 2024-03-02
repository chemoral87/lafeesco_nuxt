<template>
  <v-container fluid style="max-width: 800px">
    <v-card>
      <v-img src="banner_casa_fe2.min.png"></v-img>
      <v-card-title class="py-1">Casas de Fe</v-card-title>
      <v-card-subtitle class="py-1">Castillo del Rey La Fe Escobedo</v-card-subtitle>

      <template v-if="!submitted">
        <v-card-text class="py-1">
          LLene el formularo para asistir a una casa de Fe, y presione Enviar
        </v-card-text>
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
                <v-text-field
                  label="Edad"
                  v-mask="'##'"
                  v-model="item.age"
                  :rules="[rules.required]"
                />
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
                  :items="[
                    'Soltero',
                    'Casado',
                    'Unión Libre',
                    'Separado',
                    'Divorciado',
                    'Viudo'
                  ]"
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
          <v-card-actions>
            <v-spacer /> <v-btn color="primary" large type="submit">Enviar</v-btn>
          </v-card-actions>
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
          <v-col
            cols="12"
            sm="6"
            lg="5"
            v-for="(faith_house, ix) in match"
            :key="faith_house.id + 'pxr'"
          >
            <v-card class="fill-height">
              <v-card-title class="py-2 d-flex justify-center primary white--text">
                {{ faith_house.name }}
              </v-card-title>
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-map-marker</v-icon>
                Col. {{ faith_house.neighborhood }}, {{ faith_house.municipality }}
              </v-card-text>
              <!-- <v-card-text class="py-1 list-subtitle">
              <v-icon>mdi-map-marker</v-icon>
              {{ faith_house.address }}
            </v-card-text> -->
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-clock</v-icon>
                {{ faith_house.schedule }}
              </v-card-text>
              <v-row dense>
                <v-col cols="8">
                  <v-card-text class="py-1">
                    <strong v-if="faith_house.exhibitor">ANFITRIÓN</strong>
                    <strong v-else>ANFITRIÓN y EXPOSITOR</strong>
                  </v-card-text>
                  <v-card-text class="py-1 list-subtitle">
                    <v-icon>mdi-account</v-icon>
                    {{ faith_house.host }}
                  </v-card-text>
                  <v-card-text class="py-1" v-if="faith_house.host_phone">
                    <v-icon>mdi-phone</v-icon>
                    {{ faith_house.host_phone }}
                  </v-card-text></v-col
                >
                <v-col cols="4">
                  <img
                    class="image-cropper"
                    style="width: 96%"
                    :src="faith_house.host_photo"
                  />
                </v-col>
              </v-row>

              <v-row dense v-if="faith_house.exhibitor">
                <v-col cols="8">
                  <v-card-text class="py-1"> <strong>EXPOSITOR</strong> </v-card-text>
                  <v-card-text class="py-1 list-subtitle">
                    <v-icon>mdi-account</v-icon>
                    {{ faith_house.exhibitor }}
                  </v-card-text>
                  <v-card-text class="py-1" v-if="faith_house.exhibitor_phone">
                    <v-icon>mdi-phone</v-icon>
                    {{ faith_house.exhibitor_phone }}
                  </v-card-text>
                </v-col>
                <v-col cols="4">
                  <img
                    class="image-cropper"
                    style="width: 96%"
                    :src="faith_house.exhibitor_photo"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <img :src="mapImageUrl" alt="Static Map" />
    <img :src="generateCityMap" alt="City Map with Circle" />
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
        min: (v) => {
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
    generateCityMap() {
      let cityName = "paraje anahuac, escobedo";
      const apiKey = process.env.GOOGLE_MAPS_KEY; // Replace with your actual API key
      const apiUrl = "https://maps.googleapis.com/maps/api/staticmap";

      // Geocode the city name to get its coordinates
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: cityName + ", Nuevo León" }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0].geometry) {
          const cityCenter = results[0].geometry.location;

          // Create a circle around the city center
          const circle = new google.maps.Circle({
            center: cityCenter,
            radius: 5000 // Adjust the radius in meters as needed
          });

          // Get the path of the circle as an encoded polyline
          const circlePath = google.maps.geometry.encoding.encodePath(
            circle.getPaths().getAt(0)
          );

          console.log(cityCenter);

          // Map parameters
          const parameters = {
            center: `${cityCenter.lat()},${cityCenter.lng()}`,
            zoom: 12,
            size: "600x400",
            path: `color:0x0000ff|fillcolor:0xFFFF0033|weight:2|enc:${circlePath}`,
            format: "png",
            key: apiKey
          };

          // Construct the URL
          const queryString = Object.keys(parameters)
            .map((key) => `${key}=${encodeURIComponent(parameters[key])}`)
            .join("&");

          // Set the staticMapUrl to the generated URL
          this.staticMapUrl = `${apiUrl}?${queryString}`;
        } else {
          console.error(`Geocode was not successful for the following reason: ${status}`);
        }
      });
    },
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
      // show loader
      me.item.source = this.source;
      me.$repository.FaithHouseMembership.create(me.item).then((res) => {
        this.match = res.match;
      });
    }
  },
  computed: {
    // generateCityMap() {
    //   let cityName = "paraje anahuac, escobedo";
    //   const apiKey = process.env.GOOGLE_MAPS_KEY; // Replace with your actual API key
    //   const apiUrl = "https://maps.googleapis.com/maps/api/staticmap";

    //   // Geocode the city name to get its coordinates
    //   const geocoder = new google.maps.Geocoder();
    //   geocoder.geocode({ address: cityName + ", Nuevo León" }, (results, status) => {
    //     if (status === google.maps.GeocoderStatus.OK && results[0].geometry) {
    //       const cityCenter = results[0].geometry.location;

    //       // Create a circle around the city center
    //       const circle = new google.maps.Circle({
    //         center: cityCenter,
    //         radius: 5000 // Adjust the radius in meters as needed
    //       });

    //       // Get the path of the circle as an encoded polyline
    //       const circlePath = google.maps.geometry.encoding.encodePath(
    //         circle.getPaths().getAt(0)
    //       );

    //       console.log(cityCenter);

    //       // Map parameters
    //       const parameters = {
    //         center: `${cityCenter.lat()},${cityCenter.lng()}`,
    //         zoom: 12,
    //         size: "600x400",
    //         path: `color:0x0000ff|fillcolor:0xFFFF0033|weight:2|enc:${circlePath}`,
    //         format: "png",
    //         key: apiKey
    //       };

    //       // Construct the URL
    //       const queryString = Object.keys(parameters)
    //         .map((key) => `${key}=${encodeURIComponent(parameters[key])}`)
    //         .join("&");

    //       // Set the image source to the generated URL
    //       // document.getElementById("staticMap").src = `${apiUrl}?${queryString}`;
    //       return `${apiUrl}?${queryString}`;
    //     } else {
    //       console.error(`Geocode was not successful for the following reason: ${status}`);
    //     }
    //   });
    // },
    mapImageUrl() {
      const apiKey = process.env.GOOGLE_MAPS_KEY;
      const apiUrl = "https://maps.googleapis.com/maps/api/staticmap";
      // const path = `${this.neighborhood},${this.state}`;

      const parameters = {
        center: `${this.neighborhood},${this.state}`,
        zoom: 15,
        size: "400x400",
        markers: `${this.neighborhood},${this.state}`,
        path:
          "enc:|!1m18!1m12!1m3!1d7184.976096091344!2d-100.28063370932708!3d25.787468269487317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866293458b03503f%3A0x67f777bf6abacb3a!2sParajes%20Anahuac%2C%2066059%20Cdad.%20Gral.%20Escobedo%2C%20N.L.!5e0!3m2!1ses-419!2smx!4v1709013629837!5m2!1ses-419!2smx",
        // markers: `label:1|${this.neighborhood},${this.state}`,
        format: "png",
        key: apiKey
      };

      const queryString = Object.keys(parameters)
        .map((key) => `${key}=${encodeURIComponent(parameters[key])}`)
        .join("&");

      return `${apiUrl}?${queryString}`;
    }
  },
  mounted() {
    let me = this;
    this.source = this.$route.query.source;
    this.generateCityMap();
  }
};
</script>
<style scoped>
.image-cropper {
  border-radius: 50% !important;
}
</style>
