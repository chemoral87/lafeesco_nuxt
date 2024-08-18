<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveParkingCar">
      <v-row dense>
        <v-col cols="12" lg="6">
          <v-row dense>
            <v-col cols="6" md="3">
              <v-text-field
                outlined
                label="Placass"
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
            <v-col cols="12" md="4" v-show="false">
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
          <v-btn @click="deleteConfirm()" color="error" outlined class="mr-1">
            <v-icon>mdi-delete</v-icon>
            <span>Eliminar</span>
          </v-btn>

          <v-btn @click.native="cancel" color="primary" outlined class="mr-1">
            <v-icon>mdi-cancel</v-icon>
            <span>Cancelar</span>
          </v-btn>

          <v-btn type="submit" color="primary" class="mr-4">
            <v-icon>mdi-check</v-icon>
            <span>Guardar</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <DialogDelete
      v-if="dialogDelete"
      :dialog="dialogDeleteProp"
      @ok="
        item => {
          deleteParkingCar(item);
          // $emit('delete', item);
        }
      "
      @close="dialogDelete = false"
    />
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      parking_car: {},
      contact_list: [],
      org_ids: [],
      dialogDelete: false
    };
  },
  methods: {
    maskAsterisk(value, length) {
      return value.replace(/.(?=.{4})/g, "*");
    },
    deleteConfirm() {
      //let plate = this.maskAsterisk(this.parking_car.plate_number);
      let plate = this.parking_car.plate_number;

      this.dialogDeleteProp = {
        text: "Desea eliminar el Auto ",
        strong: plate,
        payload: this.parking_car
      };
      this.dialogDelete = true;
    },
    deleteParkingCar() {
      this.$repository.ParkingCar.delete(this.parking_car.id)
        .then(res => {
          this.$router.push("/parking-car");
        })
        .catch(e => {
          // alert(e);
        });
    },
    validateInput(ev) {
      this.$nextTick(() => {
        this.parking_car.plate_number = ev.replace(/[^a-zA-Z0-9]/g, "");
      });
    },
    async saveParkingCar() {
      if (!this.$refs.form.validate()) return;

      this.parking_car.contacts = this.contact_list;

      await this.$repository.ParkingCar.update(this.parking_car.id, this.parking_car)
        .then(res => {
          this.$router.push("/parking-car");
        })
        .catch(e => {
          // alert(e);
        });
    },
    cancel() {
      this.$router.push("/parking-car");
    }
  },
  middleware: ["authenticated"],
  async asyncData({ $axios, app, params, store, error }) {
    let org_ids = await store.dispatch("validatePermission", { error, permission: "parking-car-update" });

    const parking_car = await app.$repository.ParkingCar.show(params.parking_car_id).catch(ev => {
      throw ev;
    });

    if (!org_ids.includes(parking_car.org_id)) {
      error({ statusCode: 403, message: "No tienes permiso para editar este Org" });
    }

    return { parking_car, id: params.parking_car_id, contact_list: parking_car.contacts, org_ids: org_ids };
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Editar ParkingCar",
      icon: "human-greeting-variant"
    });
  }
};
</script>
