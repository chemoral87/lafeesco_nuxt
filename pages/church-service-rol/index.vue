<template>
  <v-container fluid class="pa-2">
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <MinistrySelect :ministries="ministries" v-model="selectedMinistries"></MinistrySelect>
      </v-col>
      <v-col cols="6" sm="3" md="2">
        <v-select :items="range_items" item-text="text" item-value="value" label="Rango" v-model="range_display"></v-select>
      </v-col>
      <v-col cols="6" sm="3" md="2">
        <v-select :items="range_views" item-text="text" item-value="value" label="Vista" v-model="range_view"></v-select>
      </v-col>

      <v-col cols="6" sm="auto">
        <v-switch
          hide-details
          v-model="showHourChurchService"
          :label="!showHourChurchService ? 'Hra. LLegada' : 'Hra. Servicio'"
        ></v-switch>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="share()" fab color="primary">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense ref="captureElement" v-if="range_view == 'service'">
      <v-col cols="12" sm="6" md="4" lg="3" class="px-1" v-for="service in church_services_filtered" :key="service.id">
        <v-card :color="isSunday(service.event_date) == false ? 'light-blue lighten-5' : ''">
          <ChurchServiceCardTitle :service="service" />

          <MinistryAttendantCard :service_ministries="service.ministries" />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense ref="captureElement" v-else-if="range_view == 'text'">
      <v-col cols="12">
        <v-textarea rows="15" outlined readonly v-model="church_services_text" class="text-body-2"> </v-textarea>
      </v-col>
    </v-row>

    <v-row dense ref="captureElement" v-else-if="range_view == 'attendant'">
      <v-col cols="12" sm="6" md="4" v-for="person in attendant_ministry_events" :key="person.id + 'attx'">
        <v-card class="pa-1">
          <v-card-title class="pa-1 text-body-2">
            <v-avatar size="29" class="mr-1">
              <img :src="person.photo" :alt="`${person.name} ${person.paternal_surname}`" />
            </v-avatar>
            {{ person.name }} {{ person.paternal_surname }}
            <span class="px-2" v-if="person.ministries && person.ministries.length">
              <v-chip
                x-small
                v-for="ministry in person.ministries"
                :key="ministry.id + 'minx'"
                :color="ministry.color"
                outlined
                class="mr-1 mb-1"
              >
                <strong> {{ ministry.name }}</strong>
              </v-chip>
            </span>
          </v-card-title>
          <v-card-text class="pa-1">
            <v-chip
              class="mr-1 mb-1 text--black black--text"
              outlined
              v-for="(event_date_item, ix) in person.events"
              :key="ix + '-' + event_date_item.event_date"
              :color="event_date_item.ministry_color"
            >
              {{ event_date_item.event_date | moment('ddd DD MMM') }} &nbsp;

              <strong :class="event_date_item.event_name_color">{{ event_date_item.event_name }}</strong>
              <strong> {{ event_date_item.event_date | moment('hh:mma') }}</strong>
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
      return this.getChuchServiceFiltered(this.church_services, this.selectedMinistries, this.showHourChurchService)
    },
    attendant_ministry_events() {
      let attendant_list = []
      this.church_services_filtered.forEach(({ ministries, event_date, event_name, event_name_color }) => {
        ministries.forEach(({ attendants, ...ministry }) => {
          attendants.forEach((attendant) => {
            let attendant_item = attendant_list.find((item) => item.id === attendant.id)
            if (!attendant_item) {
              attendant_item = { ...attendant, ministries: [], events: [] }
              attendant_list.push(attendant_item)
            }

            let ministry_item = attendant_item.ministries.find((item) => item.id === ministry.id)
            if (!ministry_item) {
              ministry_item = {
                ...ministry,
                events: [
                  {
                    event_date,
                    event_name,
                    event_name_color
                  }
                ]
              }
              delete ministry_item.attendants
              delete ministry_item.pivot
              attendant_item.ministries.push(ministry_item)
            } else {
              ministry_item.events.push({ event_date, event_name, event_name_color })
            }

            attendant_item.events.push({
              event_date,
              event_name,
              event_name_color,
              ministry_color: ministry.color
            })
          })
        })
      })

      // sort by name and paternal_surname
      attendant_list.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        if (a.paternal_surname < b.paternal_surname) return -1
        if (a.paternal_surname > b.paternal_surname) return 1
        return 0
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
    isMobile() {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    async share() {
      if (['attendant', 'service'].includes(this.range_view)) {
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
  },
  middleware: ['authenticated'],
  validate({ store, error }) {
    if (store.getters.permissions.includes('attendant-index')) return true
    else throw error({ statusCode: 403 })
  }
}
</script>
