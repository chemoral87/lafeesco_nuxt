<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="7" md="3" lg="3">
        <v-text-field
          v-model="filter"
          label="Filtrar (4 últ. digitos)"
          append-icon="mdi-magnify"
          @keypress.enter="filterCarParking()"
          @click:append="filterCarParking()"
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="filterCarParking()"> Buscar </v-btn>
      </v-col>
      <v-col>
        <v-btn color="primary" @click="newCarParking()">Nuevo Auto</v-btn>
      </v-col>
    </v-row>
    <v-row dense v-if="parkingCars">
      <div style="overflow-x: auto">
        <v-simple-table dense style="min-width: 600px">
          <thead>
            <tr>
              <th>Placas</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="parkingCars.length == 0">
              <td colspan="5">
                <v-alert class="text-left mb-0" dense text type="warning"> No se encontraron registros. </v-alert>
              </td>
            </tr>
            <tr v-for="(item, index) in parkingCars">
              <td>{{ maskAsterisk(item.plate_number, 4) }}</td>
              <td>{{ item.brand }}</td>
              <td>{{ item.model }}</td>
              <td>{{ item.color }}</td>

              <td>
                <v-btn @click="getParkingCarContacts(item)" color="success" class="mb-1"> Contacto </v-btn>
                <v-btn @click="editParkingCar(item)" color="info" class="mb-1">
                  <!-- <v-icon class="mr-1">mdi-pencil </v-icon> -->
                  Editar
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
    </v-row>
    <v-dialog v-model="dialogContact" persistent width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Contactos</span>
          <v-spacer />
          <v-icon @click.native="dialogContact = false"> $delete </v-icon>
        </v-card-title>
        <v-list>
          <v-list-item class="py-0 my-0" v-for="(item, index) in parkingCarContacts" :key="index">
            <v-list-item-content class="py-0 my-0">
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.phone }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn fab color="success" @click="callContact(item.phone)">
                <v-icon>mdi-phone</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer />

          <v-btn color="primary" class="mr-1" outlined @click="dialogContact = false"> Cancelar </v-btn>
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
      parkingCars: null,
      parkingCarContacts: [],
      filter: "",
      options: {
        sortBy: ["plate_number"],
        sortDesc: [false],
        itemsPerPage: 10,
        page: 1
      },
      dialogContact: false
    };
  },
  methods: {
    maskAsterisk(value, length) {
      return value.replace(/.(?=.{4})/g, "*");
    },
    getMobileOperatingSystem() {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;

      // Windows Phone must come first because its UA also contains "Android"
      if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
      }

      if (/android/i.test(userAgent)) {
        return "Android";
      }

      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
      }

      return "unknown";
    },
    callContact(phone) {
      location.href = "tel:" + phone;
      // if (this.getMobileOperatingSystem() == "iOS") {
      //   location.href = "tel:" + phone;
      // } else {
      //   location.href = "tel:" + phone;
      // }
    },
    async getParkingCarContacts(item) {
      // this.$router.push("/parking-car-contacts/" + item.id);
      this.parkingCarContacts = await this.$repository.ParkingCarContact.index(item.id);
      this.dialogContact = true;
    },
    editParkingCar(item) {
      this.$router.push("/parking-car/" + item.id);
    },
    async filterCarParking() {
      this.parkingCars = await this.$repository.ParkingCar.filter({ filter: this.filter });
    },

    newCarParking() {
      this.$router.push("/parking-car/new");
    }
  },
  mounted() {
    let me = this;
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Estacionamiento",
      icon: "car"
    });
  },
  async asyncData({ $axios, app, store, error }) {
    // validatePermission is a vuex action
    store.dispatch("validatePermission", { error, permission: "parking-car-index" });
  }
};
</script>
