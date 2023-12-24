<template>
  <v-container fluid class="pa-2">
    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <MinistrySelect
          :ministries="ministries"
          v-model="selectedMinistries"
        ></MinistrySelect>
      </v-col>
      <v-col cols="6" sm="auto">
        <my-datepicker
          hide-details
          outlined
          label="Fecha Inicio"
          v-model="start_date"
        ></my-datepicker>
      </v-col>
      <v-col cols="6" sm="auto">
        <v-switch
          hide-details
          v-model="showHourChurchService"
          :label="!showHourChurchService ? 'Hra. LLegada' : 'Hra. Servicio'"
        ></v-switch>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        v-for="(service, ix) in church_services_filtered"
        :key="service.id"
      >
        <v-card :color="getServiceColor(service.event_date)">
          <v-card-text class="pa-1">
            <v-row dense>
              <v-col cols="auto" v-for="lead in myLeaders" :key="lead.id">
                <v-btn
                  :color="lead.ministry.color"
                  class="white--text"
                  small
                  @click="openChurchService(service, lead.ministry)"
                >
                  <v-icon>mdi-pencil</v-icon>
                  {{ lead.ministry.name }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <ChurchServiceCardTitle :service="service" />

          <MinistryAttendantCard :service_ministries="service.ministries" />
        </v-card>
      </v-col>
      <v-col cols="6" sm="auto"
        ><v-btn color="success" @click="newChurchService()">
          <v-icon class="mr-1">mdi-account-plus</v-icon>
          Nuevo
        </v-btn>
      </v-col>
    </v-row>

    <!-- <v-dialog v-model="modalNewChurchService" persistent width="400px">
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
    </v-dialog> -->
    <ChurchServiceMinistryDialog
      :payload="payloadAssingChurchService"
      :showHourChurchService="showHourChurchService"
      v-if="modalAssingChurchService"
      @close="modalAssingChurchService = false"
      @setChurchService="setChurchService"
    />
  </v-container>
</template>
<script>
import churchService from "~/services/church-service";
export default {
  mixins: [churchService],
  props: {},
  data() {
    return {
      modalNewChurchService: false,
      selectedMinistries: [],
      date: "2018-03-02",
      current: new Date(),
      modal2: false,
      time: null,
      church_services: [],
      church_service: {},
      myLeaders: [],
      start_date: "2020-01-01",
      showHourChurchService: false,
      modalAssingChurchService: false,
      payloadAssingChurchService: {},
      ministries: []
    };
  },
  watch: {
    start_date() {
      this.getChurchService();
    }
  },
  computed: {
    church_services_filtered() {
      return this.getChuchServiceFiltered(
        this.church_services,
        this.selectedMinistries,
        this.showHourChurchService
      );
    }
  },
  methods: {
    setChurchService(new_service) {
      this.church_services = this.church_services.map((service) =>
        service.id === new_service.id ? new_service : service
      );
    },
    async getChurchService() {
      let op = {
        sortBy: ["event_date"],
        sortDesc: [false],
        itemsPerPage: 50,
        start_date: this.start_date
      };
      this.church_services = await this.$repository.ChurchService.index(
        op
      ).catch((e) => {});
    },
    assignAttendant(service_id, ministry) {
      this.$router.push(`/church-service/assign/${service_id}/${ministry.id}`);
    },
    openChurchService(church_service, ministry) {
      this.payloadAssingChurchService = {
        church_service,
        ministry
      };
      this.modalAssingChurchService = true;
    },
    newChurchService() {
      this.$repository.ChurchService.generate();
    },
    async saveChurchService() {
      var churchService = { event_date: this.date + " " + this.time };

      await this.$repository.ChurchService.create(churchService)
        .then((res) => {
          this.modalNewChurchService = false;
        })
        .catch((e) => {});
    }
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("attendant-index")) return true;
    else throw error({ statusCode: 403 });
  },
  mounted() {
    let me = this;
    this.date = this.$moment().format("YYYY-MM-DD");
    this.current = this.$moment().format("YYYY-MM-DD");
    // this.ministry_id_combo = (this.myLeaders && this.myLeaders[0].ministry_id) || null
    this.selectedMinistries = this.myLeaders.map((x) => x.ministry_id);
    this.getChurchService();
  },
  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ["event_date"],
      sortDesc: [false],
      itemsPerPage: 30
    };
    let start_date = app.$moment().format("YYYY-MM-DD");
    const ministries = await app.$repository.Ministry.index({
      sortBy: ["name"],
      sortDesc: [false],
      itemsPerPage: 50
    });
    const myLeaders = await app.$repository.MinistryLeader.my().catch((e) => {});
    // const church_services = await app.$repository.ChurchService.index(op).catch((e) => {})
    return {
      ministries: ministries.data,
      myLeaders: myLeaders,
      options: op,
      start_date: start_date
    };
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Servicios Generales",
      icon: "church"
    });
  }
};
</script>
