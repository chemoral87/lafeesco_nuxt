<template>
  <v-container fluid>
    <AgroEventForm
      @save="saveAgroEvent"
      @cancel="cancel"
      :agroEvent.sync="agroEvent"
    ></AgroEventForm>
  </v-container>
</template>
<script>
import { types } from "../misc";
export default {
  middleware: ["authenticated"],
  validate({ store, error }) {
    return true;
    // if (store.getters.permissions.includes("casas-fe-insert"))
    // else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nueva Agro Evento",
      icon: "sprout",
    });
  },
  async asyncData({ $axios, app, store }) {},
  props: {},
  data() {
    return {
      agroEvent: {},
    };
  },
  methods: {
    cancel() {
      this.$router.push("/agro-event");
    },
    async saveAgroEvent() {
      let { name, type_id, description, lat, lng, images } = this.agroEvent;
      let formData = new FormData();
      formData.append("name", name);
      type_id && formData.append("type_id", type_id);
      description && formData.append("description", description);
      formData.append("lat", lat);
      formData.append("lng", lng);
      // formData.append("images", images);
      for (let image of images) {
        formData.append("images[]", image.blob);
      }
      await this.$repository.AgroEvent.create(formData)
        .then((res) => {
          this.$router.push("/agro-event");
        })
        .catch((e) => {});
    },
  },
};
</script>
