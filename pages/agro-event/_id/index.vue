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
              disableDefaultUi: false,
            }"
            :zoom="map.zoom"
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
            <v-col cols="6" v-for="(image, ix) in agroEvent.images" :key="ix">
              <my-image-wrap
                @deleteImage="deleteImage(image)"
                :src="image.path ? image.path : image.url"
                alt="imagen"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
import { types } from "../misc";
import My from "~/pages/consolidate/my/index.vue";
export default {
  props: {},
  data() {
    return {
      agroEvent: {},
      center: null,
      types: types,
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
    deleteImage(item) {
      let { images } = this.agroEvent;
      let imgs = images.filter((x) => x.id != item.id);
      this.$set(this.agroEvent, "images", imgs);
    },
    async saveAgroEvent() {
      let { name, type_id, description, lat, lng, images } = this.agroEvent;
      let formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("name", name);
      type_id && formData.append("type_id", type_id);
      description && formData.append("description", description);
      formData.append("lat", lat);
      formData.append("lng", lng);
      for (let image of images) {
        if (image.blob) formData.append("images[]", image.blob);
        else if (image.id) formData.append("image_ids[]", image.id);
      }
      await this.$repository.AgroEvent.update(this.agroEvent.id, formData)
        .then((res) => {
          this.$router.push("/agro-event");
        })
        .catch((e) => {
          alert(e);
        });
    },
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
    cancel() {
      this.$router.push("/agro-event");
    },
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Agro EventoX",
      icon: "sprout",
    });
  },
  async asyncData({ $axios, app, params }) {
    const agroEvent = await app.$repository.AgroEvent.show(params.id).catch(
      (e) => {}
    );
    return { agroEvent, id: params.id };
  },
  mounted() {
    let { lat, lng } = this.agroEvent;
    this.marker = this.center = { lat: parseFloat(lat), lng: parseFloat(lng) };
  },
  components: { My },
};
</script>
