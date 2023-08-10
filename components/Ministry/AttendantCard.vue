<template>
  <v-card-text class="px-1 pt-1 pb-0">
    <v-row dense v-for="ministry in service_ministries" :key="ministry.id + 'min'">
      <template>
        <v-col cols="12" class="pt-0 pb-0 my-0">
          <v-chip x-small outlined :color="ministry.color">{{ ministry.name | uppercase }} </v-chip>
        </v-col>
        <v-col
          class="pt-0 pb-1 my-0 text--primary d-flex align-center no-line-height"
          cols="6"
          v-for="attendant in ministry.attendants"
          :key="attendant.id + 'att'"
        >
          <div class="image-wrapper">
            <!-- <v-img class="image-cropper mr-1" aspect-ratio="1" :src="'data:image/jpeg;base64,' + attendantsBase64Images[attendant.id]"> -->
            <img class="image-cropper mr-1" aspect-ratio="1" :src="attendant.photo" />
            {{ attendant.name }} {{ attendant.paternal_surname }}
          </div>
        </v-col>
      </template>
    </v-row>
  </v-card-text>
</template>
<script>
export default {
  props: ['service_ministries'],
  data() {
    return { attendantsBase64Images: {} }
  },
  methods: {
    async getImageAsBase64(url) {
      const response = await fetch(url, {
        // mode: 'no-cors'
      })
      const blob = await response.blob()

      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    }

    // async loadImages() {
    //   for (let ministry of this.service_ministries) {
    //     for (let attendant of ministry.attendants) {
    //       if (attendant.photo) {
    //         const base64Image = await this.getImageAsBase64(attendant.photo);
    //         this.attendantsBase64Images = {
    //           ...this.attendantsBase64Images,
    //           [attendant.id]: base64Image,
    //         };
    //       }
    //     }
    //   }
    // },
  },
  async created() {
    // await this.loadImages()
  },
  mounted() {
    let me = this
  }
}
</script>
<style scoped>
.image-wrapper {
  display: flex;
  align-items: center;
}
.no-line-height {
  line-height: 14px;
}
.image-cropper {
  border-radius: 50%;
  display: inline;
  width: 30px;
  height: 30px;
}
</style>
