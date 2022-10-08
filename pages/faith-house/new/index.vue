<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveFaithHouse">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Nombre"
            v-model="item.name"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Anfitrión" v-model="item.host" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Anfitrión Teléfono"
            v-mask="'##-####-####'"
            v-model="item.host_phone"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Expositor" v-model="item.exhibitor" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Expositor Teléfono"
            v-mask="'##-####-####'"
            v-model="item.exhibitor_phone"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Domicilio" v-model="item.address" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Latitud" v-model="item.lat" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Longitud" v-model="item.lng" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-spacer />
        <v-btn @click="cancel" outlined color="primary" class="mr-3"
          >Cancelar</v-btn
        >
        <v-btn type="submit" color="primary" class="mr-4">Guardar</v-btn>
      </v-row>
    </v-form>
    <gmap-autocomplete
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
        disableDefaultUi: false,
      }"
      :zoom="map.zoom"
      @center_changed="updateCenter"
      @zoom_changed="updateZoom"
      map-type-id="roadmap"
      style="height: 610px"
    >
      <GmapMarker
        :clickable="true"
        :draggable="false"
        :position="marker"
        @click="center = marker.position"
      />
    </GmapMap>
    {{ marker }}
  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes("casas-fe-insert")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nueva Casa de Fe",
      icon: "home",
    });
  },
  async asyncData({ $axios, app, store }) {
    // var marital_statuses = await store.dispatch(
    //   "catalogs/fetchMaritalStatuses"
    // );
    // var member_groups = await store.dispatch("catalogs/fetchMemberCategories");
    // var member_sources = await store.dispatch("catalogs/fetchMemberSources");
    // return { marital_statuses, member_groups, member_sources };
  },
  props: {},
  data() {
    return {
      item: {},
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
        bound_lng: 300,
      },
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
      // this.map.locati = this.center.lat + " " + this.center.lng;
    },
    cancel() {
      this.$router.push("/faith-house");
    },
    async saveFaithHouse() {
      if (!this.$refs.form.validate()) return;
      await this.$repository.FaithHouse.create(this.item)
        .then((res) => {
          this.$router.push("/faith-house");
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;
    this.marker = this.center;
  },
};
</script>
