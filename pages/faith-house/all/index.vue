<template>
  <v-container fluid>
    <v-row dense class="justify-center">
      <v-col cols="4" v-for="(faith_house, ix) in FaithHouses" :key="faith_house.id + 'pxr'">
        <v-card class="fill-height">
          <v-card-title class="py-2 mb-1 d-flex justify-center white--text" :class="getFlaggedMatching(faith_house)">
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

          <v-row dense v-for="contact in faith_house.contacts" :key="contact.id">
            <v-col cols="8">
              <v-card-text class="py-1">
                <strong>{{ contact.role }}</strong>
              </v-card-text>
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-account</v-icon>
                {{ contact.name }} {{ contact.paternal_surname }}
              </v-card-text>
              <v-card-text class="py-1" v-if="contact.phone">
                <v-icon>mdi-phone</v-icon>
                {{ contact.phone }}
              </v-card-text></v-col
            >
            <v-col cols="4">
              <img class="image-cropper" style="width: 90%" :src="contact.photo" />
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
          <v-card-title
            class="py-2 mb-1 d-flex justify-center white--text"
            :class="getFlaggedMatching(organizer.allow_matching)"
          >
            {{ organizer.name }}
          </v-card-title>

          <v-row dense v-for="contact in organizer.contacts" :key="contact.id">
            <v-col cols="8">
              <v-card-text>
                <strong>{{ contact.role }}</strong>
              </v-card-text>
              <v-card-text class="py-1 list-subtitle">
                <v-icon>mdi-account</v-icon>
                {{ contact.name }} {{ contact.paternal_surname }}
              </v-card-text>
              <v-card-text class="py-1" v-if="contact.phone">
                <v-icon>mdi-phone</v-icon>
                {{ contact.phone }}
              </v-card-text></v-col
            >
            <v-col cols="4">
              <img class="image-cropper" style="width: 90%" :src="contact.photo" />
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
      active_faith_house,
      with_contacts: 1
    };
    const response = await app.$repository.FaithHouse.index(options).catch(e => {});
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
      return this.response.data.filter(item => item.order == 0);
    },
    FaithHouses() {
      // remove the item that name is null
      return this.response.data.filter(item => item.order !== 0);
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
