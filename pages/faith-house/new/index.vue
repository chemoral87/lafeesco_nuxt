<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveFaithHouse">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Nombre" v-model="item.name" :rules="[v => !!v || 'Campo requerido']" />
        </v-col>

        <v-col cols="6" md="3" lg="2">
          <v-text-field outlined label="Horario" v-model="item.schedule" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Domicilio" v-model="item.address" />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field outlined label="Orden" v-model="item.order" />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field outlined label="Latitud" v-model="item.lat" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Longitud" v-model="item.lng" />
        </v-col>

        <v-col cols="6" md="3" lg="2">
          <v-checkbox v-model="item.allow_matching" label="Permite match" :true-value="1" :false-value="0">
          </v-checkbox>
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <organization-select v-model="item.org_id" outlined :rules="[$vrules.required]" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-spacer />
        <v-btn @click="cancel" outlined color="primary" class="mr-3">Cancelar</v-btn>
        <v-btn type="submit" color="primary" class="mr-4">Guardar</v-btn>
      </v-row>
    </v-form>
    <gmap-autocomplete
      style="background-color: yellow"
      size="40"
      @place_changed="setPlace"
      v-on:keydown.enter.prevent
    ></gmap-autocomplete>
    <GmapMap
      :center="center"
      :options="{
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false
      }"
      :zoom="map.zoom"
      @center_changed="updateCenter"
      @zoom_changed="updateZoom"
      map-type-id="roadmap"
      style="height: 610px"
    >
      <GmapMarker :clickable="true" :draggable="false" :position="marker" @click="center = marker.position" />
    </GmapMap>
  </v-container>
</template>
<script>
export default {
  middleware: ["authenticated"],
  async asyncData({ $axios, app, store, error }) {
    store.dispatch("validatePermission", { error, permission: "casas-fe-insert" });
  },

  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nueva Casa de Fe",
      icon: "home"
    });
  },

  props: {},
  computed: {
    formData() {
      const formData = new FormData();
      const fields = [
        "name",
        // "host",
        // "host_phone",
        // "exhibitor",
        // "exhibitor_phone",
        "schedule",
        "address",
        "order",
        "allow_matching",
        "lat",
        "lng",
        "org_id"
      ];

      fields.forEach(field => {
        const value = this.item[field];
        if (value !== undefined && value !== null) {
          formData.append(field, value);
        }
      });

      // if (this.item.host_photo_blob) {
      //   formData.append("host_photo", this.item.host_photo_blob);
      // }

      // if (this.item.exhibitor_photo_blob) {
      //   formData.append("exhibitor_photo", this.item.exhibitor_photo_blob);
      // }

      return formData;
    }
  },
  data() {
    return {
      item: {
        allow_matching: 1
      },
      center: { lat: 25.7, lng: -100.3 },
      marker: {},
      map: {
        name: "",
        country_id: null,
        state_id: null,
        city_id: null,
        postal_code: "",
        zoom: 12,
        locati: "",
        bound_lat: 300,
        bound_lng: 300
      }
    };
  },
  methods: {
    updateCenter(center) {
      this.marker = { lat: center.lat(), lng: center.lng() };
      this.item.lat = center.lat();
      this.item.lng = center.lng();
      // this.map.locati = center.lat().toFixed(9) + " " + center.lng().toFixed(9); //this.marker.position;
    },
    updateZoom(zoom) {
      this.map.zoom = zoom;
    },
    setPlace(place) {
      if (!place) return;
      this.map.zoom = 17;

      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      this.center = { lat, lng };
      this.marker = { lat, lng };
      this.item.lat = lat;
      this.item.lng = lng;
    },
    cancel() {
      this.$router.push("/faith-house");
    },
    async saveFaithHouse() {
      if (!this.$refs.form.validate()) return;

      await this.$repository.FaithHouse.createForm(this.formData)
        .then(res => {
          // redirect to add contacts
          this.$router.push("/faith-house/" + res.id);
        })
        .catch(e => {});
    }
  },
  mounted() {
    let me = this;
    this.marker = this.center;
  }
};
</script>
