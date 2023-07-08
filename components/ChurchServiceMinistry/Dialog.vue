<template>
  <!-- <v-dialog max-width="450px" :value="true" class="ma-1 my-dialog" scrollable persistent> -->
  <v-dialog max-width="450px" :value="true" class="ma-1 my-dialog" fullscreen hide-overlay>
    <v-card>
      <v-card-title class="pa-2 text-title text--primary">
        <!-- {{ church_service }} -->
        {{ church_service.event_date | moment('ddd DD MMM YYYY -') }}
        <strong>{{ church_service.event_date | moment('H:mm a') }}</strong>
        <v-spacer></v-spacer>
        <v-icon @click.native="close">$delete</v-icon>
      </v-card-title>
      <v-card-title class="px-2 py-0">
        <AttendantCombobox :attendants.sync="attendants" :ministry_id="ministry_id"></AttendantCombobox>
      </v-card-title>
      <v-card-text class="px-2 py-0">
        <v-row dense>
          <v-col cols="12" class="my-dialog">
            <v-list class="py-0">
              <template v-for="(item, index) in attendants">
                <v-list-item :key="item.index" class="py-0">
                  <v-list-item-action class="ma-0">
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
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-alert v-if="error_message" class="mr-2" dense outlined type="error">
          {{ error_message }}
        </v-alert>
        <v-btn color="primary" class="mr-1" outlined @click.native="close"> Cancelar </v-btn>
        <v-btn color="primary" @click="saveChurchServiceAttendant"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ['payload'],
  data() {
    return {
      church_service: {
        event_date: null
      },
      attendants: [],
      item: {},
      ministry_id: null,
      church_service_id: null
    }
  },
  methods: {
    async saveChurchServiceAttendant() {
      this.clearErrors()
      let payload = { attendant_ids: this.attendant_ids, ministry_id: this.ministry_id, church_service_id: this.church_service_id }
      await this.$repository.ChurchServiceAttendant.update(this.church_service_id, payload)
        .then((res) => {
          this.$emit('setChurchService', res.church_service)

          this.close()
          // this.$router.push('/church-service')
        })
        .catch((e) => {
          // alert(e)
        })
    },
    close() {
      this.$emit('close')
    },
    save() {
      this.$emit('save', this.item)
    },
    swapItem(ix1, ix2) {
      if (ix1 == -1 || ix2 == this.attendants.length) return

      const temp = this.attendants[ix1]
      this.attendants[ix1] = this.attendants[ix2]
      this.attendants[ix2] = temp
      this.attendants = Object.assign([], this.attendants)
    },
    getMinistryAssigned(item) {
      if (this.errors) {
        let church_service_attendant = this.errors?.find((x) => x.attendant_id == item.id)
        return church_service_attendant?.ministry?.name || null
      }
      return null
    }
  },
  computed: {
    attendant_ids() {
      return this.attendants.map((x) => x.id)
    }
  },
  mounted() {
    let me = this

    this.church_service_id = this.payload.church_service_id
    this.ministry_id = this.payload.ministry_id
    this.$repository.ChurchService.show(this.church_service_id)
      .then((res) => {
        this.church_service = res
        let ministry = this.church_service.ministries.find((x) => x.ministry_id == this.ministry_id)
        this.attendants = ministry?.attendants || []
      })

      .catch((e) => {})
  }
}
</script>
<style scoped>
.my-dialog {
  min-height: 52vh; /* set the value as you need */
}
</style>
