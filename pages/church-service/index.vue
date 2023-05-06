<template>
  <v-container>
    <v-btn color="success" @click="newChurchService()">
      <v-icon class="mr-1">mdi-account-plus</v-icon>
      Nuevo</v-btn
    >
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
            </v-row>
          </v-card-text>
        </v-form>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" class="mr-1" outlined @click.native="dialogChurchService = false"> Cancelar </v-btn>
          <v-btn color="primary" @click.native=""> Guardar </v-btn>
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
      date: '2018-03-02'
    }
  },
  methods: {
    // allowedDates: (val) => parseInt(val.split('-')[2], 10) % 2 === 0,
    allowedDates(val) {
      let day = this.$moment(val).day()
      //0 is sunday
      if ([0, 3].indexOf(day) > -1) return true
      return false
    },
    newChurchService() {
      this.dialogChurchService = true
    }
  },
  mounted() {
    let me = this
    this.date = this.$moment().format('YYYY-MM-DD')
    this.current = this.$moment().format('YYYY-MM-DD')
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Servicios Generales',
      icon: 'church'
    })
  }
}
</script>
