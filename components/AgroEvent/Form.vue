<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="$emit('save')">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Nombre" v-model="agroEvent.name" :rules="[v => !!v || 'Campo requerido']" />
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
        <v-col cols="12" md="6">
          <v-textarea rows="2" outlined label="Descripción" v-model="agroEvent.description" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Latitud" v-model="agroEvent.lat" readonly />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Longitud" v-model="agroEvent.lng" readonly />
        </v-col>
      </v-row>

      <v-row dense> </v-row>
      <v-row dense class="mb-1">
        <v-col cols="10" md="4" v-if="center">
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
            map-type-id="roadmap"
            style="height: 300px"
          >
            <GmapMarker :clickable="true" :draggable="false" :position="marker" @click="center = marker.position" />
          </GmapMap>
        </v-col>
        <v-col cols="12" md="8">
          <v-col cols="12">
            <my-uploadimage
              :url.sync="agroEvent.image_url"
              v-model="agroEvent.image_blob"
              label="Imagenes"
              placeholder="Seleccione imagen"
              @change="uploaded"
            ></my-uploadimage>
          </v-col>
          <v-row>
            <v-col cols="6" md="3" v-for="(image, ix) in agroEvent.images" :key="ix">
              <my-image-wrap
                @deleteImage="deleteImage(image)"
                :src="image.path ? image.path : image.url"
                alt="imagen"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-bottom-navigation app fixed :value="1" color="primary" grow>
        <v-spacer />
        <v-btn @click.native="$emit('cancel')" color="error" text class="mr-1">
          <span>Cancelar</span>
          <v-icon>mdi-cancel</v-icon>
        </v-btn>

        <v-btn type="submit" text class="mr-4">
          <span>Guardar</span>
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-form>
  </v-container>
</template>
<script>
import { types } from "@/pages/agro-event/misc";
export default {
  props: ["agroEvent"],
  data() {
    return {
      types: types,
      center: null,
      marker: null,
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
    deleteImage(item) {
      let { images } = this.agroEvent;
      let imgs = images.filter(x => x.id != item.id);
      let me = this;
      // me.$set(this.agroEvent, "images", imgs);
      this.agroEvent.images = imgs;
      this.$nextTick(() => {
        me.$emit("update:agroEvent", Object.assign({}, this.agroEvent));
        // this.agroEvent = Object.assign({}, this.agroEvent);
        // me.$set(this.agroEvent, "images", imgs);
        // me.$emit("update:agroEvent", this.agroEvent);
      });
    },
    uploaded() {
      let agro = this.agroEvent;
      if ("images" in agro == false) agro.images = [];
      if (agro.image_url) {
        let id = Math.max(...agro.images.map(o => o.id), 0) + 1;
        this.agroEvent.images.push({
          id,
          url: agro.image_url,
          blob: agro.image_blob
        });
      }
      this.$nuxtTick(() => {
        agro.image_url = null;
        agro.image_blob = null;
      });
    }
  },
  mounted() {
    let me = this;

    this.marker = this.center;
    navigator.geolocation.getCurrentPosition(position => {
      let { latitude, longitude } = position.coords;
      me.center = { lat: latitude, lng: longitude };
      me.marker = me.center;
      me.agroEvent.lat = latitude;
      me.agroEvent.lng = longitude;
    });
  }
};
</script>
