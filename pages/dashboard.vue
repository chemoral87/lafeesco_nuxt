<template>
  <v-container fluid>
    <span class="text-h6 ml-2">Bienvenido {{ NAME_SECRET }}</span>
    <!-- {{permissions}} -->
    <!-- {{user}} -->
    <v-row>
      <template v-if="hasPermission('consolidador-index')">
        <v-col cols="auto">
          <v-btn color="primary" large @click="$router.push('/consolidate')">
            <div class="wrapper">
              <v-icon>mdi-account-plus</v-icon>
              <div>Consolidar</div>
            </div>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="success" large @click="$router.push('/consolidate/my')">
            <div class="wrapper">
              <div><v-icon>mdi-account-group</v-icon> Mis</div>
              <div>Consolidados</div>
            </div>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="info" large @click="$router.push('/consolidate/calls')">
            <div class="wrapper">
              <v-icon>mdi-phone</v-icon>
              <span>Seguimiento</span>
            </div>
          </v-btn>
        </v-col>
      </template>
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
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      NAME_SECRET: "", // process.env.NAME_SECRET
      currentLocation: {
        lat: 25.788294135889345,
        lng: -100.30426405190066,
      },
      circleOptions: {},
      locations: [
        {
          lat: 44.933076,
          lng: 15.629058,
        },
        {
          lat: 45.815,
          lng: "15.9819",
        },
        {
          lat: "45.12",
          lng: "16.21",
        },
      ],
      pins: {
        selected: "data:image/png;base64,iVBORw0KGgo...",
        notSelected: "data:image/png;base64,iVBORw0KGgo...",
      },
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
  methods: {
    hasPermission(permission) {
      return this.permissions.includes(permission);
    },
  },
  mounted() {
    let me = this;
    this.$nuxt.$emit("setNavBar", {
      title: "Dashboard",
      icon: "view-dashboard",
    });
  },
};
</script>
