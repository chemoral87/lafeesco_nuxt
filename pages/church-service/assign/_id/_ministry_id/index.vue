<template>
  <v-container>
    Fecha: {{ church_service.event_date | moment('dddd DD MMMM YYYY -') }}
    <strong>{{ church_service.event_date | moment('H:mm a') }}</strong>

    <v-form ref="form" @submit.prevent="saveChurchServiceAttendant()">
      <v-row dense>
        <v-col cols="12">
          <!-- <MinistryCombobox :ministries="attendant.ministries" @modelChange="setMinistries"></MinistryCombobox> -->
          <AttendantCombobox :attendants.sync="attendants" :ministry_id="ministry_id"></AttendantCombobox>
        </v-col>
        <v-col cols="12">
          <v-list>
            <template v-for="(item, index) in attendants">
              <v-list-item :key="item.index">
                <v-list-item-action class="ma-1">
                  <v-btn :disabled="parseInt(index) == 0" icon @click="swapItem(parseInt(index) - 1, parseInt(index))"
                    ><v-icon color="green">mdi-arrow-up</v-icon></v-btn
                  >
                  <v-btn :disabled="parseInt(index) == attendants.length - 1" icon @click="swapItem(parseInt(index), parseInt(index) + 1)"
                    ><v-icon color="red">mdi-arrow-down</v-icon></v-btn
                  >
                </v-list-item-action>
                <v-list-item-avatar class="mr-1" width="45px" height="45px">
                  <v-img :src="item.photo"></v-img>
                </v-list-item-avatar>

                <v-list-item-content class="mr-1">
                  <v-list-item-title>
                    {{ item.name + ' ' + item.paternal_surname }}

                    <v-chip color="red" outlined v-if="getMinistryAssigned(item) != null">
                      {{ getMinistryAssigned(item) }}
                    </v-chip>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="index < attendants.length - 1" :key="index"></v-divider>
            </template>
          </v-list>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="auto" v-if="error_message">
          <v-alert dense outlined type="error">
            {{ error_message }}
          </v-alert>
        </v-col>
        <v-col cols="auto">
          <v-btn @click.native="cancel" color="primary" outlined class="mr-1">
            <span>Cancelar</span>
            <v-icon>mdi-cancel</v-icon>
          </v-btn>

          <v-btn type="submit" color="primary" class="mr-4">
            <span>Guardar</span>
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- {{ attendants }} -->
    <!-- {{ church_service }} -->
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      my_ministries: [],
      church_service: {},
      church_service_id: null,
      ministry_id: null,
      attendants: []
    }
  },
  methods: {
    getMinistryAssigned(item) {
      if (this.errors) {
        let church_service_attendant = this.errors.find((x) => x.attendant_id == item.id)
        return church_service_attendant?.ministry?.name || null
      }
      return null
    },
    async saveChurchServiceAttendant() {
      this.clearErrors()
      let payload = { attendant_ids: this.attendant_ids, ministry_id: this.ministry_id, church_service_id: this.church_service_id }
      await this.$repository.ChurchServiceAttendant.update(this.church_service_id, payload)
        .then((res) => {
          this.$router.push('/church-service')
        })
        .catch((e) => {
          // alert(e)
        })
    },
    cancel() {
      this.$router.push('/church-service')
    },
    swapItem(ix1, ix2) {
      if (ix1 == -1 || ix2 == this.attendants.length) return

      const temp = this.attendants[ix1]
      this.attendants[ix1] = this.attendants[ix2]
      this.attendants[ix2] = temp
      this.attendants = Object.assign([], this.attendants)
    }
  },
  mounted() {
    let me = this
  },
  computed: {
    attendant_ids() {
      return this.attendants.map((x) => x.id)
    }
  },
  async asyncData({ $axios, app, params }) {
    const my_ministries = await app.$repository.MinistryLeader.my().catch((e) => {})
    const church_service = await app.$repository.ChurchService.show(params.id).catch((e) => {})
    return { church_service: church_service, my_ministries: my_ministries, church_service_id: params.id, ministry_id: params.ministry_id }
  },
  created() {
    // if (this.myLeaders.indexOf(this.ministry_id) == -1) this.$router.push('/church-service')
    let mini = this.my_ministries.find((x) => x.ministry_id == this.ministry_id)
    if (!mini) this.$router.push('/church-service')

    let ministry = this.church_service.ministries.find((x) => x.ministry_id == this.ministry_id)
    this.attendants = ministry?.attendants || []

    this.$nuxt.$emit('setNavBar', {
      title: 'Asignar ' + mini.ministry.name,
      icon: 'church'
    })
  }
}
</script>
