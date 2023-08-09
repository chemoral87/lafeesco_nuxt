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
        <v-btn @click="share()" fab color="primary">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="6" sm="auto">
        <v-switch
          hide-details
          v-model="showHourChurchService"
          :label="!showHourChurchService ? 'Hra. LLegada' : 'Hra. Servicio'"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row dense ref="captureElement" v-if="range_view == 'service'">
      <v-col cols="12" sm="6" md="4" lg="3" class="px-1" v-for="service in church_services_filtered" :key="service.id">
        <v-card :color="isSunday(service.event_date) == false ? 'light-blue lighten-5' : ''">
          <ChurchServiceCardTitle :service="service" :show-diff-humanize="false" />

          <MinistryAttendantCard :selectedMinistries="selectedMinistries" :service_ministries="service.ministries" />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense ref="captureElement" v-else-if="range_view == 'text'">
      <v-col cols="12">
        <v-textarea rows="15" outlined readonly v-model="church_services_text" class="text-body-2"> </v-textarea>
      </v-col>
    </v-row>

    <v-row dense ref="captureElement" v-else-if="range_view == 'attendant'">
      <v-col cols="12" sm="6" md="4" v-for="person in attendant_ministry_events" :key="person.id">
        <v-card class="pa-1">
          <!-- <v-img :src="person.photo" height="200px"></v-img> -->
          <v-card-title class="pa-1 text-body-2">
            <v-avatar size="29" class="mr-1">
              <img :src="person.photo" :alt="`${person.name} ${person.paternal_surname}`" />
            </v-avatar>
            {{ person.name }} {{ person.paternal_surname }}
            <span class="px-2" v-if="person.ministries && person.ministries.length">
              <v-chip x-small v-for="ministry in person.ministries" :key="ministry.id" :color="ministry.color" outlined class="mr-1 mb-1">
                <strong> {{ ministry.name }}</strong>
              </v-chip>
            </span>
          </v-card-title>
          <v-card-text class="pa-1">
            <v-chip
              class="mr-1 mb-1 text--black black--text"
              outlined
              v-for="event_date_item in person.event_dates"
              :key="event_date_item.event_date"
              :color="event_date_item.ministry_color"
            >
              {{ event_date_item.event_date | moment('ddd DD MMMM') }}

              <strong class="ml-1" :class="getServiceTextColor(event_date_item.event_date)">{{
                getServiceNumber(event_date_item.event_date)
              }}</strong>
              <!-- <strong v-if="showChurchServiceHour"> {{ event_date_item.event_date | moment('hh:mm a') }}</strong> -->
              <!-- <strong v-else> {{ getArriveDate(event_date_item.event_date) | moment('hh:mm a') }}</strong> -->
            </v-chip>
            <!-- <v-list>
              <v-list-item v-for="ministry in person.ministries" :key="ministry.id">
                <v-list-item-icon>
                  <v-icon :color="ministry.color">mdi-account-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ ministry.name }}</v-list-item-title>
                  <v-list-item-subtitle v-for="date in ministry.event_dates" :key="date">
                    {{ new Date(date).toLocaleString() }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list> -->
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12">
        <v-row v-for="attendant in attendant_ministry_events" :key="attendant.id">
          <v-col class="pt-0 pb-1 my-0 text--primary d-flex align-center no-line-height" cols="auto">
            <div class="image-wrapper">

              <img class="image-cropper mr-1" aspect-ratio="1" :src="attendant.photo" />
              {{ attendant.name }} {{ attendant.paternal_surname }}
            </div>
          </v-col>
          <v-col cols="auto" v-for="ministry in attendant.ministries" :key="ministry.id + '-' + attendant.id"> {{ ministry.name }} </v-col>
        </v-row>
      </v-col> -->
    </v-row>
    {{ church_services_filtered }} ad

    {{ selectedMinistries }}
    <!-- {{ attendant_ministry_events }} -->
  </v-container>
</template>
<script>
import domtoimage from 'dom-to-image'
import churchService from '~/services/church-service'
export default {
  props: {},
  mixins: [churchService],
  data() {
    return {
      captureElement: null,
      range_items: [{ value: 'week', text: 'Próximos' }],
      range_display: 'week',
      range_views: [
        { value: 'service', text: 'Servicios' },
        { value: 'text', text: 'Texto' },
        { value: 'attendant', text: 'Servidor' }
      ],
      range_view: 'service',
      dialogChurchService: false,
      date: '2018-03-02',
      current: new Date(),
      modal2: false,
      time: null,
      church_services: [],
      myLeaders: [],
      showHourChurchService: false,
      ministries: [{ id: '', name: '' }],
      selectedMinistries: []
    }
  },
  computed: {
    church_services_filtered() {
      let showHourChurchService = this.showHourChurchService
      let church_s = this.church_services.map((service) => ({
        ...service,
        event_name: this.getServiceNumber(service.event_date),
        event_name_color: this.getServiceTextColor(service.event_date),
        event_date: showHourChurchService == true ? service.event_date : this.getArriveDate(service.event_date),
        ministries: service.ministries.filter((ministry) => this.selectedMinistries.includes(ministry.id))
      }))
      return church_s
    },
    attendant_ministry_events() {
      let attendant_list = []
      this.church_services.forEach(({ ministries, event_date }) => {
        ministries.forEach(({ attendants, ...ministry }) => {
          attendants.forEach((attendant) => {
            let attendant_item = attendant_list.find((item) => item.id === attendant.id)
            if (!attendant_item) {
              attendant_item = { ...attendant, ministries: [], event_dates: [] }
              attendant_list.push(attendant_item)
            }

            let ministry_item = attendant_item.ministries.find((item) => item.id === ministry.id)
            if (!ministry_item) {
              ministry_item = { ...ministry, event_dates: [event_date] }
              delete ministry_item.attendants
              delete ministry_item.pivot
              attendant_item.ministries.push(ministry_item)
            } else {
              ministry_item.event_dates.push(event_date)
            }

            attendant_item.event_dates.push({ event_date, ministry_color: ministry.color })
          })
        })
      })
      return attendant_list
    },
    church_services_text() {
      let text_format = ''
      this.church_services.forEach((service) => {
        // get with moment js the format dddd DD MMM of the service.event_date in text_format
        text_format +=
          '*' +
          this.getServiceNumber(service.event_date) +
          '* ' +
          (this.showHourChurchService
            ? this.$moment(service.event_date).format('hh:mm a')
            : this.$moment(this.getArriveDate(service.event_date)).format('hh:mm a')) +
          '  ' +
          '*' +
          this.$moment(service.event_date).format('dddd DD MMMM') +
          '* ' +
          '\r\n'

        // skip if the ministry is not selectedMinistries
        if (this.selectedMinistries.length > 0) {
          let filtered_ministries = service.ministries.filter((ministry) => {
            return this.selectedMinistries.includes(ministry.id)
          })

          filtered_ministries.forEach((ministry) => {
            if (this.selectedMinistries.length != 1) text_format += '*' + ministry.name + '*\r\n'

            ministry.attendants.forEach((attendant) => {
              text_format += attendant.name + ' ' + attendant.paternal_surname + '\r\n'
            })
          })
        }

        text_format += '\r\n'
        // text_format += `${service.event_date} ${service.event_time} ${service.ministries.map((ministry) => ministry.name).join(', ')}\n`
      })
      return text_format
    }
  },
  watch: {
    range_display() {
      this.getChurchService()
    }
  },
  methods: {
    // getServiceNumber(date) {
    //   let hours = this.$moment(date).hours()
    //   let minutes = this.$moment(date).minutes()
    //   const time = `${hours}:${minutes}`

    //   switch (time) {
    //     case '9:0':
    //     case '19:30':
    //       return '1º.'
    //     case '11:30':
    //       return '2º.'
    //     case '18:0':
    //       return '3º.'
    //     default:
    //       return '0º'
    //   }
    // },
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    async share() {
      if (this.range_view == 'card') {
        this.exportImg2()
      } else if (this.range_view == 'text') {
        this.exportText()
      }
    },
    async exportText() {
      let me = this
      navigator.clipboard
        .writeText(this.church_services_text)
        .then(() => {
          console.log('Text copied to clipboard')
          me.$store.dispatch('notify', { success: 'Texto Copiado' })
        })
        .catch((err) => {
          console.error('Could not copy text: ', err)
        })
    },
    async exportImg2() {
      let me = this
      me.$store.dispatch('showLoading')

      domtoimage
        .toPng(this.captureElement, {
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
        .then(function (dataUrl) {
          var link = document.createElement('a')
          link.download = 'servicio_general.png'
          link.href = dataUrl

          link.click()

          me.$store.dispatch('notify', { success: 'Imagen descargada' })
          me.$store.dispatch('hideLoading')
        })
        .catch(function (error) {
          console.error('Error occurred:', error)
          me.$store.dispatch('hideLoading')
        })
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
