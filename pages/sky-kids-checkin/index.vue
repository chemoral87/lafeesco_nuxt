<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12"> Escanee el código QR de la credencial de SkyKids </v-col>
      <v-col cols="12">
        <div v-show="enable_camera" id="reader"></div>
        <div v-if="!enable_camera">
          <v-btn dealer-id="34" @click="enableCamera()" color="primary">
            <v-icon class="mr-1">mdi-camera</v-icon> Activar Scanner
          </v-btn>
        </div>
        <div>{{ content }}</div>
        <div>{{ error_interface }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { Html5Qrcode } from "html5-qrcode";
import en from "vuetify/es5/locale/en";

export default {
  data() {
    return {
      content: "",
      enable_camera: true,
      registration: {},
      error_interface: "",
      html5QrcodeScanner: null
    };
  },
  methods: {
    async getSkyKids() {
      if (this.enable_camera == false) return;
      await this.$repository.SkyRegistration.show(this.content)
        .then(res => {
          this.registration = res.data;
        })
        .catch(e => {
          alert(e);
        });
    },
    enableCamera() {
      this.content = "";
      this.html5QrcodeScanner.resume();
      this.enable_camera = true;
    }
  },
  mounted() {
    this.html5QrcodeScanner = new Html5Qrcode("reader");
    this.html5QrcodeScanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 }
        },
        qrCodeMessage => {
          this.html5QrcodeScanner.pause();
          this.content = qrCodeMessage;
          this.getSkyKids();
          this.enable_camera = false;
        },
        errorMessage => {}
      )
      .catch(err => {
        this.error_interface = `No se pudo comenzar a escanear, error: ${err}`;
      });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "SkyKids CheckIn",
      icon: "qrcode-scan"
    });
  }
};
</script>
