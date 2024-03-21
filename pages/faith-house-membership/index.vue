<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filterFaithHouse"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <FaithHouseMembershipTable
          @sorting="index"
          :options="options"
          :response="response"
          @edit=""
          @editContext=""
          @delete="deleteItem"
          @focus="focusItem"
          :dialogDelete.sync="dialogDelete"
        />
      </v-col>
    </v-row>
    <v-dialog class="mx-1" v-model="modal" max-width="600px" persistent>
      <v-card>
        <v-card-title
          >Casas de Fe
          <v-spacer />
          <v-icon @click="modal = false">$delete</v-icon>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6" v-for="(faith_house, ix) in faith_houses" :key="faith_house.id + 'pxr'">
              <v-card class="fill-height">
                <v-card-title class="py-2 mb-1 d-flex justify-center primary white--text">
                  {{ faith_house.name }}
                </v-card-title>
                <v-card-text class="py-1 list-subtitle">
                  <v-icon>mdi-map-marker</v-icon>
                  Col. {{ faith_house.neighborhood }}, {{ faith_house.municipality }}
                </v-card-text>
                <!-- <v-card-text class="py-1 list-subtitle">
              <v-icon>mdi-map-marker</v-icon>
              {{ faith_house.address }}
            </v-card-text> -->
                <v-card-text class="py-1 list-subtitle">
                  <v-icon>mdi-clock</v-icon>
                  {{ faith_house.schedule }}
                </v-card-text>

                <v-card-text class="py-1 list-subtitle">
                  <v-icon>mdi-vector-line</v-icon>
                  {{ faith_house.pivot.distance }} km
                </v-card-text>

                <v-row dense v-for="contact in faith_house.contacts" :key="contact.id">
                  <v-col cols="8">
                    <v-card-text class="py-1">
                      <strong>{{ contact.role }}</strong>
                    </v-card-text>
                    <v-card-text class="py-1 list-subtitle">
                      <v-icon>mdi-account</v-icon>
                      {{ contact.name }} {{ contact.paternal_surname }}
                    </v-card-text>
                    <v-card-text class="py-1" v-if="contact.phone">
                      <v-btn class="green white--text" fab x-small>
                        <v-icon @click="sendWhatsapp(contact.phone)"> mdi-phone </v-icon>
                      </v-btn>

                      {{ contact.phone }}
                    </v-card-text>
                  </v-col>
                  <v-col cols="4">
                    <img class="image-cropper" style="width: 90%" :src="contact.photo" />
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" class="mr-2" outlined @click="modal = false"> Cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  async asyncData({ $axios, app, store, error }) {
    store.dispatch("validatePermission", { error, permission: "casas-fe-index" });

    let active_faith_house = true;
    let options = {
      sortBy: ["created_at"],
      sortDesc: [true],
      itemsPerPage: 10,
      active_faith_house
    };
    const response = await app.$repository.FaithHouseMembership.index(options).catch(e => {});
    return { response, options, active_faith_house };
  },
  watch: {
    async filterFaithHouse(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.FaithHouseMembership.index(op).catch(e => {});
    },
    active_faith_house: async function (val) {
      this.options.active_faith_house = val;
      this.response = await this.$repository.FaithHouse.index(this.options).catch(e => {});
    }
  },

  methods: {
    sendWhatsapp(to_number) {
      // remove hypens
      to_number = to_number.replace(/-/g, "");

      const { name, age, street_address, house_number, neighborhood, municipality, phone, marital_status } =
        this.faith_house_membership;
      // include a text to api and add membership information in the text
      let string = `Registro Casa de Fe QR. Nombre: *${name}*, Edad:  *${age} años*, Domicilio: *${street_address} ${house_number}, Col. ${neighborhood}, ${municipality}*, Estado Civil: *${marital_status}*, Teléfono: *${phone}*. Favor de contactar y dar informes de Horario y Domicilio`;
      let url = `https://api.whatsapp.com/send?phone=52${to_number}&text=${string}`;

      //let url = `https://api.whatsapp.com/send?phone=52${number}&text=Hola, estoy interesado en tu casa de fe`;

      //let url = `https://api.whatsapp.com/send?phone=52${number}`;
      window.open(url, "_blank");
    },

    async index(options) {
      if (options) {
        this.options = options;
      }
      let op = Object.assign({ filter: this.filter }, this.options);
      this.response = await this.$repository.FaithHouseMembership.index(op);
    },

    async deleteItem(item) {
      await this.$repository.FaithHouseMembership.delete(item.id)
        .then(res => {
          this.dialogDelete = false;
          this.index();
        })
        .catch(e => {});
    },
    focusItem(item) {
      this.modal = true;

      this.faith_houses = item.faith_houses;
      this.faith_house_membership = item;
      // this.center = { lat: parseFloat(item.lat), lng: parseFloat(item.lng) };
      // this.zoom = 17;
    }
  },
  data() {
    return {
      modal: false,
      filterFaithHouse: "",
      dialogDelete: false,
      response: {},
      options: {},
      dialogDeleteProp: {},
      faith_houses: [],
      faith_house_membership: {}
    };
  },
  middleware: ["authenticated"],

  created() {
    this.$nuxt.$emit("setNavBar", { title: "CF Membresías", icon: "home" });
  }
};
</script>
