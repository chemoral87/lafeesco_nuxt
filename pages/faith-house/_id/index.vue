<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveFaithHouse">
      <v-row dense>
        <v-col cols="12" md="3" lg="2">
          <v-text-field
            outlined
            label="Nombre"
            v-model="item.name"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field outlined label="Anfitrión" v-model="item.host" />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field
            outlined
            label="Anfitrión Teléfono"
            v-mask="'##-####-####'"
            v-model="item.host_phone"
          />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field outlined label="Expositor" v-model="item.exhibitor" />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field
            outlined
            label="Expositor Teléfono"
            v-mask="'##-####-####'"
            v-model="item.exhibitor_phone"
          />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field outlined label="Horario" v-model="item.schedule" />
        </v-col>
        <v-col cols="12" md="3" lg="4">
          <v-text-field outlined label="Domicilio" v-model="item.address" />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field outlined label="Latitud" v-model="item.lat" />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <v-text-field outlined label="Longitud" v-model="item.lng" />
        </v-col>
        <v-col cols="6" md="2">
          <my-uploadimage-crop
            :photo="item.host_photo"
            v-model="item.host_photo_blob"
            label="Anfitrión"
            :size="750"
            max-height="95px"
            placeholder="Seleccione imagen"
          />
        </v-col>
        <v-col cols="6" md="2">
          <my-uploadimage-crop
            :photo="item.exhibitor_photo"
            v-model="item.exhibitor_photo_blob"
            label="Expositor"
            :size="750"
            max-height="95px"
            placeholder="Seleccione imagen"
          />
        </v-col>
        <v-col cols="6" md="3" lg="2">
          <MyDatepicker outlined label="Fecha Fin" v-model="item.end_date" />
        </v-col>
      </v-row>

      <v-row dense>
        <v-spacer />
        <v-btn @click="cancel" outlined color="primary" class="mr-3">Cancelar</v-btn>
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
        disableDefaultUi: false
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
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("casas-fe-insert")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Editar Casa de Fe",
      icon: "home"
    });
  },
  async asyncData({ $axios, app, params }) {
    const item = await app.$repository.FaithHouse.show(params.id).catch((e) => {});
    return { item, id: params.id };
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
        zoom: 17,
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
      // this.map.locati = this.center.lat + " " + this.center.lng;
    },
    cancel() {
      this.$router.push("/faith-house");
    },
    async saveFaithHouse() {
      let formData = new FormData();
      let {
        name,
        host,
        host_phone,
        exhibitor,
        exhibitor_phone,
        schedule,
        address,
        lat,
        lng,
        host_photo_blob,
        exhibitor_photo_blob,
        end_date
      } = this.item;
      formData.append("_method", "PUT");
      formData.append("name", name);
      formData.append("host", host);
      formData.append("host_phone", host_phone);
      formData.append("exhibitor", exhibitor);
      formData.append("exhibitor_phone", exhibitor_phone);
      formData.append("schedule", schedule);
      formData.append("address", address);
      formData.append("lat", lat);
      formData.append("lng", lng);
      host_photo_blob && formData.append("host_photo", host_photo_blob);
      exhibitor_photo_blob && formData.append("exhibitor_photo", exhibitor_photo_blob);
      formData.append("end_date", end_date);

      await this.$repository.FaithHouse.updateForm(this.item.id, formData)
        .then((res) => {
          this.$router.push("/faith-house");
        })
        .catch((e) => {});
    }
  },
  mounted() {
    let me = this;
    let { lat, lng } = this.item;
    this.center = { lat: parseFloat(lat), lng: parseFloat(lng) };
    this.marker = this.center;
  }
};
</script>
