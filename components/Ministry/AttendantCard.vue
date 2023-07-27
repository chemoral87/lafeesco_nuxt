<template>
  <v-card-text class="px-1 pt-1 pb-2">
    <v-row dense v-for="ministry in service_ministries" :key="ministry.id + 'min'">
      <template v-if="displayFromSelectedMinistry(ministry.id)">
        <v-col cols="12" class="py-0 my-0" v-if="selectedMinistries.length != 1">
          <v-chip x-small outlined :color="ministry.color">{{ ministry.name | uppercase }} </v-chip>
        </v-col>
        <v-col
          class="py-0 my-0 text--primary d-flex align-center no-line-height"
          cols="6"
          v-for="attendant in ministry.attendants"
          :key="attendant.id + 'att'"
        >
          <div class="image-wrapper">
            <img class="image-cropper mr-1" :src="attendantsBase64Images[attendant.id]" :alt="attendant.name" />
            {{ attendant.name }} {{ attendant.paternal_surname }}
          </div>
        </v-col>
      </template>
    </v-row>
    {{ attendantsBase64Images }}
  </v-card-text>
</template>
<script>
export default {
  props: ['service_ministries', 'selectedMinistries'],
  data() {
    return { attendantsBase64Images: {} }
  },
  methods: {
    getImageAsBase64(imageUrl) {
      console.log('getImageAsBase64', imageUrl)
      return new Promise((resolve, reject) => {
        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
          .catch((error) => {
            console.error('Error fetching image:', error)
            reject('Error fetching image')
          })
      })
    },
    displayFromSelectedMinistry(ministry_id) {
      if (this.selectedMinistries.length == 0) return true
      else if (this.selectedMinistries.indexOf(ministry_id) > -1) return true
      return false
    }
  },
  async created() {
    // this.attendantsBase64Images[3] = this.getImageAsBase64('https://via.placeholder.com/150')
    for (let ministry of this.service_ministries) {
      for (let attendant of ministry.attendants) {
        if (attendant.photo) {
          this.attendantsBase64Images[attendant.id] = await this.getImageAsBase64(attendant.photo)
        }
      }
    }
    // When component is created, start fetching images
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
