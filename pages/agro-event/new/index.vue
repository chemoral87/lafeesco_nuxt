<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveAgroEvent">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Nombre"
            v-model="agroEvent.name"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-select
            outlined
            label="Tipo"
            v-model="agroEvent.type_id"
            :items="types"
            item-value="id"
            item-text="name"
            :clearable="true"
            hide-details
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-textarea
            rows="2"
            outlined
            label="Descripción"
            v-model="agroEvent.description"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Latitud"
            v-model="agroEvent.lat"
            readonly
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Longitud"
            v-model="agroEvent.lng"
            readonly
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-spacer />
        <v-btn @click="cancel" outlined color="primary" class="mr-3"
          >Cancelar</v-btn
        >
        <v-btn type="submit" color="primary" class="mr-4">Guardar</v-btn>
      </v-row>
      <v-row>
        <v-col cols="6">
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
        </v-col>
        <v-col cols="6">
          <v-col cols="6">
            <my-uploadimage
              :url.sync="agroEvent.image_url"
              v-model="agroEvent.image_blob"
              label="Imagenes"
              placeholder="Seleccione imagen"
              @change="uploaded"
            ></my-uploadimage>
          </v-col>
          <v-row>
            <v-col cols="3" v-for="(image, ix) in agroEvent.images" :key="ix">
              {{ image.id }}
              <v-img
                lazy-src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif?cid=82a1493bqs7zu7isoeb2bepktf6psvafnob9xcyhwc1d11dt&rid=200w.gif&ct=g"
                :src="image.url"
                alt="imagen"
              ></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import { types } from "../misc";
export default {
  validate({ store, error }) {
    return true;
    // if (store.getters.permissions.includes("casas-fe-insert"))
    // else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nueva Agro Evento",
      icon: "sprout",
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
      agroEvent: {
        images: [],
      },
      types: types,
      // types: [
      //   { id: 1, name: "Reporte" },
      //   { id: 2, name: "Alarma" },
      //   { id: 3, name: "Defecto" },
      //   { id: 4, name: "Reparación" },
      // ],
      center: { lat: 25.7, lng: -100.3 },
      marker: {},
      map: {
        name: "",
        country_id: null,
        state_id: null,
        city_id: null,
        postal_code: "",
        zoom: 17,
        locati: "",
        bound_lat: 300,
        bound_lng: 300,
      },
    };
  },
  methods: {
    uploaded() {
      let agro = this.agroEvent;
      if (agro.image_url) {
        let id = Math.max(...agro.images.map((o) => o.id), 0) + 1;
        this.agroEvent.images.push({
          id,
          url: agro.image_url,
          blob: agro.image_blob,
        });
      }
      this.$nextTick(() => {
        agro.image_url = null;
        agro.image_blob = null;
      });
    },
    updateCenter(center) {
      // this.marker = { lat: center.lat(), lng: center.lng() };
      // this.item.lat = center.lat();
      // this.item.lng = center.lng();
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
      this.$router.push("/agro-event");
    },
    async saveAgroEvent() {
      let { name, type_id, description, lat, lng, images } = this.agroEvent;
      let formData = new FormData();
      formData.append("name", name);
      type_id && formData.append("type_id", type_id);
      description && formData.append("description", description);
      formData.append("lat", lat);
      formData.append("lng", lng);
      // formData.append("images", images);
      for (let image of images) {
        formData.append("images[]", image.blob);
      }
      await this.$repository.AgroEvent.create(formData)
        .then((res) => {
          this.$router.push("/agro-event");
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;

    this.marker = this.center;
    navigator.geolocation.getCurrentPosition((position) => {
      let { latitude, longitude } = position.coords;
      me.center = { lat: latitude, lng: longitude };
      me.marker = me.center;
      me.agroEvent.lat = latitude;
      me.agroEvent.lng = longitude;
    });
  },
};
</script>
