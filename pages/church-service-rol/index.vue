<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" md="4" v-for="service in church_services" :key="service.id">
        <v-card>
          <v-card-title class="py-1">
            {{ service.event_date | moment('dddd DD MMMM YYYY H:mm a') }}
          </v-card-title>
          <v-card-text>
            <v-row dense v-for="ministry in service.ministries" :key="ministry.id">
              <v-col cols="12"
                >{{ ministry.name }}

                <v-row dense>
                  <v-col
                    class="py-0 my-0 text--primary d-flex align-center"
                    cols="6"
                    v-for="attendant in ministry.attendants"
                    :key="attendant.id"
                  >
                    <img class="image-cropper mr-1" width="40px" :src="attendant.photo" /> {{ attendant.name }}
                    {{ attendant.paternal_surname }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    servicios
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
export default {
  props: {},
  data() {
    return {
      dialogChurchService: false,
      date: '2018-03-02',
      current: new Date(),
      modal2: false,
      time: null,
      church_services: [],
      myLeaders: []
    }
  },
  methods: {
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
      console.log(churchService)
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
    this.date = this.$moment().format('YYYY-MM-DD')
    this.current = this.$moment().format('YYYY-MM-DD')
  },
  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ['event_date'],
      sortDesc: [false],
      itemsPerPage: 30
    }
    const myLeaders = await app.$repository.MinistryLeader.my().catch((e) => {})
    const church_services = await app.$repository.ChurchService.index(op).catch((e) => {})
    return { myLeaders: myLeaders, church_services: church_services, options: op }
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
.image-cropper {
  border-radius: 50%;
  display: inline;
}
</style>