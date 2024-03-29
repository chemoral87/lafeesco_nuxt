<template>
  <!-- <v-dialog max-width="450px" :value="true" class="ma-1 my-dialog" scrollable persistent> -->
  <v-dialog
    :value="true"
    class="ma-1"
    :fullscreen="canFullScreen"
    :max-width="dialogMaxWidth"
    persistent
    scrollable
  >
    <v-card :max-width="600">
      <v-card-title class="px-2 py-0 text-subtitle-1 text--primary">
        {{ church_service.event_date | moment("ddd DD MMM YYYY") }} &nbsp;
        <strong :class="church_service.event_name_color">{{
          church_service.event_name
        }}</strong>
        <strong>{{ church_service.event_date | moment("hh:mma") }}</strong>

        <v-spacer></v-spacer>
        <v-icon @click.native="close">$delete</v-icon>
      </v-card-title>
      <v-card-title class="px-2 py-0 text-subtitle-2 text--primary">
        {{ ministry_name }}
      </v-card-title>

      <v-card-title class="px-2 py-0">
        <AttendantCombobox
          :attendants.sync="attendants"
          :ministry_id="ministry_id"
        ></AttendantCombobox>
      </v-card-title>
      <v-card-text class="px-2 py-0">
        <v-row dense>
          <v-col cols="12" class="my-dialog">
            <v-list class="py-0">
              <template v-for="(item, index) in attendants">
                <v-list-item :key="item.index" class="py-0 px-0">
                  <v-list-item-action class="ma-0">
                    <v-btn
                      small
                      :disabled="parseInt(index) == 0"
                      icon
                      @click="swapItem(parseInt(index) - 1, parseInt(index))"
                      ><v-icon color="green">mdi-arrow-up</v-icon></v-btn
                    >
                    <v-btn
                      small
                      :disabled="parseInt(index) == attendants.length - 1"
                      icon
                      @click="swapItem(parseInt(index), parseInt(index) + 1)"
                      ><v-icon color="red">mdi-arrow-down</v-icon></v-btn
                    >
                  </v-list-item-action>
                  <v-list-item-avatar class="mr-1" width="39px" height="39px">
                    <v-img :src="item.photo"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content class="mr-1">
                    <v-list-item-title>
                      {{ item.name + " " + item.paternal_surname }}

                      <v-chip
                        color="red"
                        outlined
                        v-if="getMinistryAssigned(item) != null"
                      >
                        {{ getMinistryAssigned(item) }}
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="ma-0">
                    <v-btn small icon @click="deleteItem(index)"
                      ><v-icon color="error">mdi-delete</v-icon></v-btn
                    >
                  </v-list-item-action>
                </v-list-item>
                <v-divider v-if="index < attendants.length - 1" :key="index"></v-divider>
              </template>
            </v-list>
          </v-col>
        </v-row>
        <v-row dense>
          <v-alert v-if="error_message" class="mr-2" dense outlined type="error">
            {{ error_message }}
          </v-alert>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn color="primary" class="mr-1" outlined @click.native="close">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="saveChurchServiceAttendant"> Guardar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ["payload", "showHourChurchService"],
  data() {
    return {
      church_service: {
        event_date: null
      },
      attendants: [],
      item: {},
      ministry_id: null,
      ministry_name: null,
      church_service_id: null
    };
  },
  methods: {
    getArriveDate(date) {
      let _date = this.$moment(date);
      return _date.subtract(40, "minutes");
    },
    async saveChurchServiceAttendant() {
      this.clearErrors();
      let payload = {
        attendant_ids: this.attendant_ids,
        ministry_id: this.ministry_id,
        church_service_id: this.church_service_id
      };
      await this.$repository.ChurchServiceAttendant.update(
        this.church_service_id,
        payload
      )
        .then((res) => {
          this.$emit("setChurchService", res.church_service);

          this.close();
          // this.$router.push('/church-service')
        })
        .catch((e) => {
          // alert(e)
        });
    },
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save", this.item);
    },
    swapItem(ix1, ix2) {
      if (ix1 == -1 || ix2 == this.attendants.length) return;

      const temp = this.attendants[ix1];
      this.attendants[ix1] = this.attendants[ix2];
      this.attendants[ix2] = temp;
      this.attendants = Object.assign([], this.attendants);
    },
    deleteItem(ix) {
      if (ix < 0 || ix >= this.attendants.length) return;
      this.attendants.splice(ix, 1);
      this.attendants = [...this.attendants];
    },
    getMinistryAssigned(item) {
      if (this.errors) {
        let church_service_attendant = this.errors?.find(
          (x) => x.attendant_id == item.id
        );
        return church_service_attendant?.ministry?.name || null;
      }
      return null;
    }
  },
  computed: {
    attendant_ids() {
      return this.attendants.map((x) => x.id);
    },
    canFullScreen() {
      if (this.$vuetify.breakpoint.mdAndUp) return false;
      return true;
    },
    dialogMaxWidth() {
      // If the screen size is greater than or equal to the size of "md"
      if (this.$vuetify.breakpoint.mdAndUp) {
        // for larger screens, set max-width to 600px
        return "600px";
      } else {
        // for smaller screens, set max-width to 90% of the viewport width
        return "";
      }
    }
  },
  mounted() {
    let me = this;

    let church_service = this.payload.church_service;
    this.church_service_id = church_service.id;
    this.ministry_id = this.payload.ministry.id;
    this.ministry_name = this.payload.ministry.name;
    this.$repository.ChurchService.show(church_service.id)
      .then((res) => {
        this.church_service = {
          ...res,
          event_name: church_service.event_name,
          event_name_color: church_service.event_name_color,
          event_date: church_service.event_date
        };
        let ministry = this.church_service.ministries.find(
          (x) => x.id == this.ministry_id
        );
        this.attendants = ministry?.attendants || [];
      })

      .catch((e) => {});
  }
};
</script>
<style scoped></style>
