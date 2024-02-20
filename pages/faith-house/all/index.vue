<template>
  <v-container fluid>
    <v-row dense class="justify-center">
      <v-col
        cols="4"
        v-for="(faith_house, ix) in FaithHouses"
        :key="faith_house.id + 'pxr'"
      >
        <v-card class="fill-height">
          <v-card-title
            class="py-2 d-flex justify-center white--text"
            :class="getFlaggedMatching(faith_house.allow_matching)"
          >
            {{ ix + 1 }}. {{ faith_house.name }}
          </v-card-title>
          <v-card-text class="py-1 list-subtitle" v-if="faith_house.neighborhood">
            <v-icon>mdi-map-marker</v-icon>
            Col. {{ faith_house.neighborhood }}, {{ faith_house.municipality }}
          </v-card-text>
          <!-- <v-card-text class="py-1 list-subtitle">
            <v-icon>mdi-map-marker</v-icon>
             {{ faith_house.address }}
          </v-card-text> -->
          <v-card-text class="py-1 list-subtitle" v-if="faith_house.schedule">
            <v-icon>mdi-clock</v-icon>
            {{ faith_house.schedule }}
          </v-card-text>
          <v-row dense>
            <v-col cols="8">
              <v-card-text class="py-1">
                <strong v-if="faith_house.name.toLowerCase() == 'supervisores'">
                  SUPERVISORES
                </strong>
                <strong v-else-if="faith_house.exhibitor">ANFITRIÓN</strong>
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
                class="image-cropper py-2"
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

    <v-row dense class="justify-center">
      <v-col cols="4">
        <div class="d-flex justify-center">
          <img style="width: 230px" alt="Logo" src="/logo_casas_fe2.png" />
        </div>
      </v-col>
      <v-col cols="4" v-for="(organizer, ix) in Organizers" :key="organizer.id + 'pxz'">
        <v-card class="fill-height">
          <v-card-title class="py-2 d-flex justify-center primary white--text">
            {{ organizer.name }}
          </v-card-title>
          <v-row dense class="pt-2">
            <v-col cols="7">
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-account</v-icon>
                {{ organizer.host }}
              </v-card-text>
              <v-card-text class="py-1" v-if="organizer.host_phone">
                <v-icon>mdi-phone</v-icon>
                {{ organizer.host_phone }}
              </v-card-text>
              <br />

              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-account</v-icon>
                {{ organizer.exhibitor }}
              </v-card-text>
              <v-card-text class="py-1" v-if="organizer.exhibitor_phone">
                <v-icon>mdi-phone</v-icon>
                {{ organizer.exhibitor_phone }}
              </v-card-text>
            </v-col>
            <v-col cols="5">
              <img class="image-cropper" style="width: 96%" :src="organizer.host_photo" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="4">
        <div class="d-flex justify-center">
          <img style="width: 230px" alt="Logo" src="/logo.png" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  //laoyout none
  layout: "none",
  async asyncData({ $axios, app, route }) {
    let active_faith_house = true;
    let options = {
      sortBy: ["order", "name"],
      sortDesc: [false, true],
      itemsPerPage: 40,
      active_faith_house
    };
    const response = await app.$repository.FaithHouse.index(options).catch((e) => {});
    return { response, options, active_faith_house, flagged: route.query.flagged };
  },
  props: {},
  data() {
    return {
      flagged: null,
      response: {}
    };
  },
  methods: {
    getFlaggedMatching(allow_matching) {
      if (this.flagged == undefined) return "primary";
      return allow_matching ? "primary" : "error";
    }
  },
  computed: {
    Organizers() {
      return this.response.data.filter((item) => item.order == 0);
    },
    FaithHouses() {
      // remove the item that name is null
      return this.response.data.filter((item) => item.order !== 0);
    }
  },
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
