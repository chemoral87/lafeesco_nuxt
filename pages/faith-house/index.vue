<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn color="success" @click="$router.push('faith-house/new')" class="mb-1 mr-1">
          <v-icon class="mr-1">mdi-account-plus</v-icon> Nuevo Casa Fe
        </v-btn>
      </v-col>
      <v-col cols="12">
        <FaithHouseTable @sorting="index" :options="options" :response="response" @edit="editItem" @delete="deleteItem"
          @focus="focusItem" :dialogDelete.sync="dialogDelete" />
      </v-col>
    </v-row>

    <GmapMap :center="center" :options="{
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUi: false,
    }" :zoom="zoom" @center_changed="updateCenter" @zoom_changed="updateZoom" map-type-id="roadmap"
      style="height: 610px">
      <gmap-info-window :opened="infoWindow" :options="infoOptions" :position="infoPosition"
        @closeclick="infoWindow = false">{{
          infoContent
        }}</gmap-info-window>
      <GmapMarker @click="showInfo(item)" v-for="(item, ix) in markers" :key="ix" :clickable="true" :draggable="false"
        :position="item" />
    </GmapMap>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios, app }) {
    let options = {
      sortBy: ["name"],
      sortDesc: [true],
      itemsPerPage: 20,
    };
    const response = await app.$repository.FaithHouse.index(options).catch((e) => { });
    return { response, options };
  },
  computed: {
    markers() {
      let faith_houses = this.response.data;
      return faith_houses.map((x) => {
        return { lat: parseFloat(x.lat), lng: parseFloat(x.lng), name: x.name };
      });
    },
  },
  methods: {
    showInfo(item) {
      console.log("showInfor");
      this.infoWindow = false;
      this.$nextTick(() => {
        this.infoWindow = true;
        this.infoContent = item.name;
        this.infoPosition = { lat: item.lat, lng: item.lng };
      });
    },
    async index(options) {
      if (options) {
        this.options = options;
      }
      let op = Object.assign({ filter: this.filter }, this.options);
      this.response = await this.$repository.FaithHouse.index(op);
    },
    editItem(item) {
      this.$router.push(`/faith-house/${item.id}`);
    },

    async deleteItem(item) {
      await this.$repository.FaithHouse.delete(item.id)
        .then((res) => {
          this.dialogDelete = false;
          this.index();
        })
        .catch((e) => { });
    },
    focusItem(item) {
      this.center = { lat: parseFloat(item.lat), lng: parseFloat(item.lng) };
      this.zoom = 17;
    },

    updateCenter(center) {
      this.marker = { lat: center.lat(), lng: center.lng() };
    },
    updateZoom(zoom) {
      this.zoom = zoom;
    },
  },
  data() {
    return {
      infoWindow: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -10,
        },
      },
      infoContent: "",
      infoPosition: { lat: null, lng: null },
      dialogDelete: false,
      center: { lat: 25.786, lng: -100.3044 },

      zoom: 14,

      response: {},
      options: {},
      currentLocation: {
        lat: 25.788294135889345,
        lng: -100.30426405190066,
      },
      circleOptions: {},
      mapStyle: [],
      clusterStyle: [
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff",
        },
      ],
      dialogDeleteProp: {},
      dialogDelete: false,
    };
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("casas-fe-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Casas de Fe", icon: "home" });
  },
};
</script>
