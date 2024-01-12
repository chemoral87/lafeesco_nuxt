<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filterFaithHouse"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-checkbox
          hide-details
          class="mt-1"
          label="Solo Activas"
          v-model="active_faith_house"
        ></v-checkbox>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn color="success" @click="$router.push('faith-house/new')" class="mb-1 mr-1">
          <v-icon class="mr-1">mdi-account-plus</v-icon> Nuevo Casa Fe
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <FaithHouseTable
          @sorting="index"
          :options="options"
          :response="response"
          @edit="editItem"
          @editContext="editContext"
          @delete="deleteItem"
          @focus="focusItem"
          :dialogDelete.sync="dialogDelete"
        />
      </v-col>
    </v-row>

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
      :zoom="zoom"
      @center_changed="updateCenter"
      @zoom_changed="updateZoom"
      map-type-id="roadmap"
      style="height: 610px"
    >
      <gmap-info-window
        :opened="infoWindow"
        :options="infoOptions"
        :position="infoPosition"
        @closeclick="infoWindow = false"
        >{{ infoContent }}</gmap-info-window
      >
      <GmapMarker
        @click="showInfo(item)"
        v-for="(item, ix) in markers"
        :key="ix"
        :clickable="true"
        :draggable="false"
        :position="item"
      />
    </GmapMap>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios, app }) {
    let active_faith_house = true;
    let options = {
      sortBy: ["name"],
      sortDesc: [true],
      itemsPerPage: 40,
      active_faith_house
    };
    const response = await app.$repository.FaithHouse.index(options).catch((e) => {});
    return { response, options, active_faith_house };
  },
  watch: {
    async filterFaithHouse(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.FaithHouse.index(op).catch((e) => {});
    },
    active_faith_house: async function (val) {
      this.options.active_faith_house = val;
      this.response = await this.$repository.FaithHouse.index(
        this.options
      ).catch((e) => {});
    }
  },
  computed: {
    markers() {
      let faith_houses = this.response.data;
      console.log(typeof faith_houses);
      return faith_houses.map((x) => {
        return { lat: parseFloat(x.lat), lng: parseFloat(x.lng), name: x.name };
      });
    }
  },
  methods: {
    showInfo(item) {
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
    editContext(item) {
      //open in new tab
      window.open(`/faith-house/${item.id}`, "_blank");
    },

    async deleteItem(item) {
      await this.$repository.FaithHouse.delete(item.id)
        .then((res) => {
          this.dialogDelete = false;
          this.index();
        })
        .catch((e) => {});
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
    }
  },
  data() {
    return {
      filterFaithHouse: "",
      active_faith_house: true,
      infoWindow: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -10
        }
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
        lng: -100.30426405190066
      },
      circleOptions: {},
      mapStyle: [],
      clusterStyle: [
        {
          url:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          width: 56,
          height: 56,
          textColor: "#fff"
        }
      ],
      dialogDeleteProp: {},
      dialogDelete: false
    };
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("casas-fe-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Casas de Fe", icon: "home" });
  }
};
</script>
