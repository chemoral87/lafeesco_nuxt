<template>
  <v-container fluid class="pa-2">
    <v-row dense>
      <v-col cols="6" sm="3">
        <MinistrySelect :ministries="ministries" v-model="selectedMinistries"></MinistrySelect>
      </v-col>
      <v-col cols="6" sm="auto">
        <my-datepicker hide-details outlined label="Fecha Inicio" v-model="start_date"></my-datepicker>
      </v-col>
      <v-col cols="6" sm="auto">
        <v-switch hide-details v-model="showChurchService" :label="!showChurchService ? 'Hra. LLegada' : 'Hra. Servicio'"></v-switch>
      </v-col>
      <v-col cols="6" sm="auto"
        ><v-btn color="success" @click="newChurchService()">
          <v-icon class="mr-1">mdi-account-plus</v-icon>
          Nuevo
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" sm="6" md="4" lg="3" v-for="(service, ix) in church_services" :key="service.id">
        <v-card :color="isSunday(service.event_date) == false ? 'light-blue lighten-5' : ''">
          <v-card-text class="pa-1">
            <v-row dense>
              <v-col cols="auto" v-for="lead in myLeaders" :key="lead.id">
                <v-btn :color="lead.ministry.color" class="white--text" small @click="openChurchService(service.id, lead.ministry)">
                  <v-icon>mdi-pencil</v-icon>
                  {{ lead.ministry.name }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-text class="pt-1 pb-0 text--primary">
            <strong>{{ getServiceNumber(service.event_date) }}</strong>
            {{ service.event_date | moment('dddd DD MMM YYYY') }}
            <strong v-if="showChurchService"> {{ service.event_date | moment('h:mm a') }}</strong>
            <strong v-else> {{ getArriveDate(service.event_date) | moment('h:mm a') }}</strong>
          </v-card-text>
          <MinistryAttendantCard :selectedMinistries="selectedMinistries" :service_ministries="service.ministries" />
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="modalNewChurchService" persistent width="400px">
      <v-card>
        <v-card-title> Nuevo Servicio <v-spacer /> <v-icon @click.native="modalNewChurchService = false"> $delete </v-icon> </v-card-title>
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
          <v-btn color="primary" class="mr-1" outlined @click.native="modalNewChurchService = false"> Cancelar </v-btn>
          <v-btn color="primary" @click="saveChurchService()"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ChurchServiceMinistryDialog
      :payload="payloadAssingChurchService"
      :showChurchService="showChurchService"
      v-if="modalAssingChurchService"
      @close="modalAssingChurchService = false"
      @setChurchService="setChurchService"
    />
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      modalNewChurchService: false,
      selectedMinistries: [],
      date: '2018-03-02',
      current: new Date(),
      modal2: false,
      time: null,
      church_services: [],
      church_service: {},
      myLeaders: [],
      start_date: '2020-01-01',
      showChurchService: false,
      modalAssingChurchService: false,
      payloadAssingChurchService: {},
      ministries: []
    }
  },
  watch: {
    start_date() {
      this.getChurchService()
    }
  },
  methods: {
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
    getArriveDate(date) {
      let _date = this.$moment(date)
      return _date.subtract(40, 'minutes')
    },
    setChurchService(item) {
      let _church_service = this.church_services.find((x) => x.id == item.id)
      _church_service.ministries = item?.ministries || []
      this.church_services.splice(this.church_services.indexOf(_church_service), 1, _church_service)
    },
    async getChurchService() {
      let op = {
        sortBy: ['event_date'],
        sortDesc: [false],
        itemsPerPage: 50,
        start_date: this.start_date
      }
      this.church_services = await this.$repository.ChurchService.index(op).catch((e) => {})
    },
    assignAttendant(service_id, ministry) {
      this.$router.push(`/church-service/assign/${service_id}/${ministry.id}`)
    },
    openChurchService(church_service_id, ministry) {
      this.payloadAssingChurchService = { church_service_id: church_service_id, ministry: ministry }
      this.modalAssingChurchService = true
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
      this.modalNewChurchService = true
    },
    async saveChurchService() {
      var churchService = { event_date: this.date + ' ' + this.time }

      await this.$repository.ChurchService.create(churchService)
        .then((res) => {
          // this.$router.push('/church-service')
          this.modalNewChurchService = false
        })
        .catch((e) => {})
    }
  },

  mounted() {
    let me = this
    this.date = this.$moment().format('YYYY-MM-DD')
    this.current = this.$moment().format('YYYY-MM-DD')
    // this.ministry_id_combo = (this.myLeaders && this.myLeaders[0].ministry_id) || null
    this.selectedMinistries = this.myLeaders.map((x) => x.ministry_id)
    this.getChurchService()
  },
  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ['event_date'],
      sortDesc: [false],
      itemsPerPage: 30
    }
    let start_date = app.$moment().format('YYYY-MM-DD')
    const ministries = await app.$repository.Ministry.index({
      sortBy: ['name'],
      sortDesc: [false],
      itemsPerPage: 50
    })
    const myLeaders = await app.$repository.MinistryLeader.my().catch((e) => {})
    // const church_services = await app.$repository.ChurchService.index(op).catch((e) => {})
    return { ministries: ministries.data, myLeaders: myLeaders, options: op, start_date: start_date }
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Servicios Generales',
      icon: 'church'
    })
  }
}
</script>
