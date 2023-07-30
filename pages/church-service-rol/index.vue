<template>
  <v-container fluid class="pa-2">
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <MinistrySelect :ministries="ministries" v-model="selectedMinistries"></MinistrySelect>
      </v-col>
      <v-col cols="5" sm="3" md="2">
        <v-select :items="range_items" item-text="text" item-value="value" label="Rango" v-model="range_display"></v-select>
      </v-col>
      <v-col cols="4" sm="3" md="2">
        <v-select :items="range_views" item-text="text" item-value="value" label="Vista" v-model="range_view"></v-select>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="exportImg2()" fab color="primary">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="6" sm="auto">
        <v-switch hide-details v-model="showChurchService" :label="!showChurchService ? 'Hra. LLegada' : 'Hra. Servicio'"></v-switch>
      </v-col>
    </v-row>
    <v-row dense ref="captureElement">
      <v-col cols="12" sm="6" md="4" lg="3" v-for="service in church_services" :key="service.id">
        <v-card :color="isSunday(service.event_date) == false ? 'light-blue lighten-5' : ''">
          <ChurchServiceCardTitle :service="service" :show-church-service-hour="showChurchService" :show-diff-humanize="true" />

          <MinistryAttendantCard :selectedMinistries="selectedMinistries" :service_ministries="service.ministries" />
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogChurchService" persistent width="400px">
      <v-card>
        <v-card-title> Nuevo Servicio <v-spacer /> <v-icon @click.native="dialogChurchService = false"> $delete </v-icon> </v-card-title>
        <v-form ref="form" @submit.prevent="save">
          <v-card-text>
            <v-row dense>
              <v-col cols="12">
                <v-date-picker width="auto" v-model="date" :allowed-dates="allowedDates" :show-current="current"></v-date-picker>
              </v-col>
              <v-col cols="12">
                <v-dialog ref="dialog" v-model="modal2" :return-value.sync="time" persistent width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="time"
                      label="Picker in dialog"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-if="modal2" v-model="time" :allowed-minutes="allowedStep" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal2 = false"> Cancel </v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(time)"> OK </v-btn>
                  </v-time-picker>
                </v-dialog>
                <!-- <v-text-field v-model="time" label="Hora"></v-text-field> -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" class="mr-1" outlined @click.native="dialogChurchService = false"> Cancelar </v-btn>
          <v-btn color="primary" @click="saveChurchService()"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import domtoimage from 'dom-to-image'
export default {
  props: {},
  data() {
    return {
      captureElement: null,
      range_items: [{ value: 'today', text: 'Hoy' }],
      range_display: 'today',
      range_views: [
        { value: 'card', text: 'Servicios' },
        { value: 'text', text: 'Texto' },
        { value: 'attendants', text: 'Servidor' }
      ],
      range_view: 'card',
      dialogChurchService: false,
      date: '2018-03-02',
      current: new Date(),
      modal2: false,
      time: null,
      church_services: [],
      myLeaders: [],
      showChurchService: false,
      ministries: [{ id: '', name: '' }],
      selectedMinistries: []
    }
  },
  watch: {
    range_display() {
      this.getChurchService()
    }
  },
  methods: {
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    async exportImg2() {
      let me = this
      me.$store.dispatch('showLoading')

      const blob = domtoimage.toPng(this.captureElement, {
        cacheBust: true,
        height: this.captureElement.offsetHeight * 2, // increase scale factor
        width: this.captureElement.offsetWidth * 2, // increase scale factor
        style: {
          transform: 'scale(2)', // increase scale factor
          transformOrigin: 'top left',
          width: this.captureElement.offsetWidth + 'px',
          height: this.captureElement.offsetHeight + 'px'
        }
      })

      // Create a share object
      const share = {
        files: [blob],
        title: 'Imagen capturada',
        text: 'Esta es una imagen capturada de mi página web.'
      }

      // Share the image
      navigator.share(share).then(
        function () {
          console.log('Image shared successfully')
        },
        function (error) {
          console.log('Error sharing image:', error)
        }
      )

      // domtoimage
      //   .toPng(this.captureElement, {
      //     quality: 1,
      //     cacheBust: true,
      //     height: this.captureElement.offsetHeight * 2, // increase scale factor
      //     width: this.captureElement.offsetWidth * 2, // increase scale factor
      //     style: {
      //       transform: 'scale(2)', // increase scale factor
      //       transformOrigin: 'top left',
      //       width: this.captureElement.offsetWidth + 'px',
      //       height: this.captureElement.offsetHeight + 'px'
      //     }
      //   })
      //   .then(function (dataUrl) {
      //     // Create a new Blob object with the image data
      //     if (me.isMobile()) {
      //       var blob = new Blob([dataUrl], { type: 'image/png' })

      //       // Create a share object
      //       var share = {
      //         url: window.URL.createObjectURL(blob),
      //         title: 'Imagen capturada',
      //         text: 'Esta es una imagen capturada de mi página web.'
      //       }

      //       // Share the image
      //       navigator.share(share).then(
      //         function () {
      //           console.log('Image shared successfully')
      //         },
      //         function (error) {
      //           console.log('Error sharing image:', error)
      //         }
      //       )
      //     } else {
      //       var link = document.createElement('a')
      //       link.download = 'servicio_general.png'
      //       link.href = dataUrl

      //       link.click()
      //     }

      //     me.$store.dispatch('notify', { success: 'Imagen descargada' })
      //     me.$store.dispatch('hideLoading')
      //   })
      //   .catch(function (error) {
      //     console.error('Error occurred:', error)
      //     me.$store.dispatch('hideLoading')
      //   })

      // domtoimage
      //   .toPng(this.captureElement, {
      //     // quality: 1,
      //     cacheBust: true,
      //     height: this.captureElement.offsetHeight * 3,
      //     width: this.captureElement.offsetWidth * 3,
      //     style: {
      //       transform: 'scale(3)',
      //       transformOrigin: 'top left',
      //       width: this.captureElement.offsetWidth + 'px',
      //       height: this.captureElement.offsetHeight + 'px'
      //     }
      //   })
      //   .then(function (dataUrl) {
      //     // Convert data URL to blob
      //     fetch(dataUrl)
      //       .then((res) => res.blob())
      //       .then((blob) => {
      //         // Convert blob to file
      //         var file = new File([blob], 'my-image.png', { type: 'image/png' })

      //         if (navigator.share && me.isMobile()) {
      //           console.log('share')
      //           // Use Web Share API if available
      //           navigator
      //             .share({
      //               title: 'My Image',
      //               text: 'Here is my image',
      //               files: [file]
      //             })
      //             .then(() => console.log('Successful share'))
      //             .catch((error) => console.log('Error sharing', error))
      //         } else {
      //           // Fallback to downloading the image
      //           var link = document.createElement('a')
      //           link.download = 'my-image.png'
      //           link.href = URL.createObjectURL(blob)
      //           link.click()
      //         }

      //         me.$store.dispatch('hideLoading')
      //       })
      //       .catch((error) => {
      //         console.error('Error occurred:', error)
      //       })
      //   })
      //   .catch(function (error) {
      //     me.$store.dispatch('hideLoading')
      //     console.error('Error occurred:', error)
      //   })
    },
    async getChurchService() {
      let op = {
        sortBy: ['event_date'],
        sortDesc: [false],
        range_display: this.range_display,
        itemsPerPage: 50
        // start_date: this.start_date
      }
      this.church_services = await this.$repository.ChurchService.index(op).catch((e) => {})
    },
    isSunday(date) {
      return this.$moment(date).day() === 0
    },
    getServiceNumber(date) {
      let hours = this.$moment(date).hours()
      let minutes = this.$moment(date).minutes()
      const time = `${hours}:${minutes}`

      switch (time) {
        case '9:0':
        case '19:30':
          return '1º'
        case '11:30':
          return '2º'
        case '18:0':
          return '3º'
        default:
          return '0º'
      }
    },

    assignAttendant(service_id, ministry) {
      this.$router.push(`/church-service/assign/${service_id}/${ministry.id}`)
    },
    allowedStep: (m) => m % 30 === 0,
    // allowedDates: (val) => parseInt(val.split('-')[2], 10) % 2 === 0,
    allowedDates(val) {
      let day = this.$moment(val).day()
      //0 is sunday
      if ([0, 3].indexOf(day) > -1) return true
      return false
    },
    newChurchService() {
      this.dialogChurchService = true
    },
    async saveChurchService() {
      var churchService = { event_date: this.date + ' ' + this.time }

      await this.$repository.ChurchService.create(churchService)
        .then((res) => {
          // this.$router.push('/church-service')
          this.dialogChurchService = false
        })
        .catch((e) => {})
    }
  },
  mounted() {
    let me = this
    this.captureElement = this.$refs.captureElement

    this.date = this.$moment().format('YYYY-MM-DD')
    this.current = this.$moment().format('YYYY-MM-DD')
    this.selectedMinistries = this.myLeaders.map((x) => x.ministry_id)
    this.getChurchService()

    let currentDate = this.$moment().subtract(21, 'days')
    const endDate = this.$moment().add(21, 'days')

    while (currentDate.isSameOrBefore(endDate)) {
      const formattedDate = currentDate.format('YYYY-MM')
      if (!this.range_items.some((x) => x.value === formattedDate)) {
        this.range_items.push({
          value: formattedDate,
          text: currentDate.format('MMMM YYYY')
        })
      }
      currentDate.add(1, 'months')
    }

    //function to upper the first letter
    this.range_items.forEach((x) => {
      x.text = x.text.charAt(0).toUpperCase() + x.text.slice(1)
    })
  },
  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ['event_date'],
      sortDesc: [false],
      itemsPerPage: 30
    }
    const myLeaders = await app.$repository.MinistryLeader.my().catch((e) => {})
    let opMin = {
      sortBy: ['name'],
      sortDesc: [false],
      itemsPerPage: 50
    }
    const ministries = await app.$repository.Ministry.index(opMin)
    // const church_services = await app.$repository.ChurchService.index(op).catch((e) => {})
    return { ministries: ministries.data, myLeaders: myLeaders, options: op }
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Servicios Generales',
      icon: 'church'
    })
  }
}
</script>
