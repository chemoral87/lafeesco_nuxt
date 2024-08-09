<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveParking_car">
      <v-row dense>
        <v-col cols="12" lg="6">
          <v-row dense>
            <v-col cols="6" md="3">
              <v-text-field
                outlined
                label="Placas"
                v-model="parking_car.plate_number"
                :rules="[v => !!v || 'Campo requerido']"
                @input="validateInput"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field
                outlined
                label="Marca"
                v-model="parking_car.brand"
                :rules="[v => !!v || 'Campo requerido']"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field
                outlined
                label="Modelo"
                v-model="parking_car.model"
                :rules="[v => !!v || 'Campo requerido']"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field
                outlined
                label="Color"
                v-model="parking_car.color"
                :rules="[v => !!v || 'Campo requerido']"
              />
            </v-col>
            <v-col cols="6" md="4">
              <organization-select
                :permission="'parking-car-index'"
                v-model="parking_car.org_id"
                outlined
                :rules="[$vrules.required]"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row dense>
            <ParkingCarContactsList :contacts.sync="contact_list" />
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-spacer />
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
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      parking_car: {},
      contact: {
        name: "",
        phonenumber: ""
      },
      contact_list: []
    };
  },
  methods: {
    addContact() {
      this.contact_list.push(this.contact);
      this.contact = {
        name: "",
        phonenumber: ""
      };
    },
    validateInput(ev) {
      this.$nextTick(() => {
        this.parking_car.plate_number = ev.replace(/[^a-zA-Z0-9]/g, "");
      });
    },
    async saveParking_car() {
      if (!this.$refs.form.validate()) return;

      this.parking_car.contacts = this.contact_list;

      await this.$repository.ParkingCar.create(this.parking_car).then(res => {
        this.$router.push("/parking-car");
      });
    },
    cancel() {
      this.$router.push("/parking-car");
    }
  },
  middleware: ["authenticated"],

  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Estacionamiento",
      icon: "car",
      back: "/parking-car"
    });
  }
};
</script>
