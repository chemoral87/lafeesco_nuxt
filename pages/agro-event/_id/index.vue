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
import My from "~/pages/consolidate/my/index.vue";
import AgroEvent from "../index.vue";
export default {
  props: {},
  data() {
    return {
      agroEvent: {},
    };
  },
  methods: {
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

    cancel() {
      this.$router.push("/agro-event");
    },
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Agro Evento",
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
  components: { My, AgroEvent },
};
</script>
