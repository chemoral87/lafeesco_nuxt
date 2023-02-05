<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="success"
          @click="$router.push('agro-event/new')"
          class="mb-1 mr-1"
        >
          <v-icon class="mr-1">mdi-account-plus</v-icon> Nuevo Agro Evento
        </v-btn>
      </v-col>
      <v-col cols="12">
        <AgroEventTable
          :dialog-delete.sync="dialogDeleteAgroEvent"
          @edit="editAgroEvent"
          @delete="deleteAgroEvent"
          :agroEvents="agroEvents"
      /></v-col>
    </v-row>

    <v-row>
      <!-- <v-col cols="10" sm="12"
        ><GmapMap
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
          :zoom="zoom"
          @center_changed="updateCenter"
          @zoom_changed="updateZoom"
          map-type-id="roadmap"
          style="height: 610px"
        >

        </GmapMap>
      </v-col> -->
    </v-row>
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
    const agroEvents = await app.$repository.AgroEvent.index(options).catch(
      (e) => {}
    );
    return { agroEvents };
  },
  computed: {
    markers() {
      // let faith_houses = this.response.data;
      // return faith_houses.map((x) => {
      //   return { lat: parseFloat(x.lat), lng: parseFloat(x.lng), name: x.name };
      // });
    },
  },
  methods: {
    editAgroEvent(item) {
      this.$router.push(`/agro-event/${item.id}`);
    },
    showInfo(item) {
      this.infoWindow = true;
      this.infoContent = item.name;
      this.infoPosition = { lat: item.lat, lng: item.lng };
    },
    async deleteAgroEvent(item) {
      await this.$repository.AgroEvent.delete(item.id)
        .then((res) => {
          this.dialogDeleteAgroEvent = false;
          this.index();
        })
        .catch((e) => {});
    },
    async index(options) {
      this.agroEvents = await this.$repository.AgroEvent.index();
      // if (options) {
      //   this.options = options;
      // }
      // let op = Object.assign({ filter: this.filter }, this.options);
      // this.response = await this.$repository.FaithHouse.index(op);
    },
    editItem(item) {
      // this.$router.push(`/faith-house/${item.id}`);
    },

    async deleteItem(item) {
      // await this.$repository.FaithHouse.delete(item.id)
      //   .then((res) => {
      //     this.dialogDelete = false;
      //     this.index();
      //   })
      //   .catch((e) => {});
    },
    focusItem(item) {
      this.center = { lat: parseFloat(item.lat), lng: parseFloat(item.lng) };
      this.zoom = 17;
    },

    updateCenter(center) {
      // this.marker = { lat: center.lat(), lng: center.lng() };
    },
    updateZoom(zoom) {
      this.zoom = zoom;
    },
  },
  data() {
    return {
      dialogDeleteAgroEvent: false,
      agroEvents: [],

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
      center: { lat: parseFloat(25.786), lng: parseFloat(-100.3044) },
      zoom: 14,
      response: {},
      options: {},

      clusterStyle: [
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff",
        },
      ],
      dialogDelete: false,
    };
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    // if (store.getters.permissions.includes("casas-fe-index")) return true;
    // else throw error({ statusCode: 403 });
    return true;
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Agro Eventos", icon: "sprout" });
  },
};
</script>
