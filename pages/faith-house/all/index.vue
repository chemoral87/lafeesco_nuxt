<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        cols="4"
        v-for="(faith_house, ix) in response.data"
        :key="faith_house.id + 'pxr'"
      >
        <v-card class="fill-height">
          <v-card-title class="py-2 d-flex justify-center primary white--text">
            {{ ix + 1 }}. {{ faith_house.name }}
          </v-card-title>

          <v-card-text class="py-1 list-subtitle">
            <v-icon>mdi-map-marker</v-icon>
            {{ faith_house.address }}
          </v-card-text>
          <v-card-text class="py-1 list-subtitle">
            <v-icon>mdi-clock</v-icon>
            {{ faith_house.schedule }}
          </v-card-text>
          <v-row dense>
            <v-col cols="8">
              <v-card-text class="py-1">
                <strong v-if="faith_house.exhibitor">ANFITRIÓN</strong>
                <strong v-else>ANFITRIÓN y EXPOSITOR</strong>
              </v-card-text>
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-account</v-icon>
                {{ faith_house.host }}
              </v-card-text>
              <v-card-text class="py-1" v-if="faith_house.host_phone">
                <v-icon>mdi-phone</v-icon>
                {{ faith_house.host_phone }}
              </v-card-text></v-col
            >
            <v-col cols="4">
              <img
                class="image-cropper"
                style="width: 96%"
                :src="faith_house.host_photo"
              />
            </v-col>
          </v-row>

          <v-row dense v-if="faith_house.exhibitor">
            <v-col cols="8">
              <v-card-text class="py-1"> <strong>EXPOSITOR</strong> </v-card-text>
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-account</v-icon>
                {{ faith_house.exhibitor }}
              </v-card-text>
              <v-card-text class="py-1" v-if="faith_house.exhibitor_phone">
                <v-icon>mdi-phone</v-icon>
                {{ faith_house.exhibitor_phone }}
              </v-card-text></v-col
            >
            <v-col cols="4">
              <img
                class="image-cropper"
                style="width: 96%"
                :src="faith_house.exhibitor_photo"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
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
  props: {},
  data() {
    return {
      response: {}
    };
  },
  methods: {},

  mounted() {
    let me = this;
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Casas de Fe", icon: "home" });
  }
};
</script>
<style scoped>
.image-cropper {
  border-radius: 50% !important;
}
.list-subtitle {
  display: flex;
  align-items: center;
}

.list-subtitle i {
  margin-right: 3px; /* Adjust the margin based on your preference */
}
</style>
