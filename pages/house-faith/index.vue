<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="success"
          @click="$router.push('faith-house/new')"
          class="mb-1 mr-1"
        >
          <v-icon class="mr-1">mdi-account-plus</v-icon> Nuevo Casa Fe
        </v-btn>
      </v-col>
      <v-col cols="12">
        <FaithHouseTable
          @sorting="indexMyMembers"
          :options="options"
          :response="response"
          @edit="editMember"
        />
      </v-col>
    </v-row>

    <GMap
      ref="gMap"
      language="en"
      :cluster="{ options: { styles: clusterStyle } }"
      :center="currentLocation"
      :options="{ fullscreenControl: false, styles: mapStyle }"
      :zoom="12"
    >
      <!-- <GMapMarker
        v-for="location in locations"
        :key="location.id"
        :position="{ lat: location.lat, lng: location.lng }"
        :options="{
          icon: location === currentLocation ? pins.selected : pins.notSelected,
        }"
        @click="currentLocation = location"
      >
        <GMapInfoWindow :options="{ maxWidth: 200 }">
          <code> lat: {{ location.lat }}, lng: {{ location.lng }} </code>
        </GMapInfoWindow>
      </GMapMarker> -->
      <GMapCircle :options="circleOptions" />
    </GMap>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, app }) {
    let options = {
      sortBy: ["name"],
      sortDesc: [true],
      itemsPerPage: 10,
    };
    const response = await app.$repository.FaithHouse.index(options).catch(
      (e) => {}
    );
    return { response, options };
  },
  data() {
    return {
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
    };
  },
  validate({ store, error }) {
    if (store.getters.permissions.includes("casas-fe-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Casas de Fe", icon: "home" });
  },
};
</script>
