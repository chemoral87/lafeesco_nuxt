<template>
  <div>
    <div v-if="enable_camera" id="reader"></div>
    <div v-else>
      <v-btn dealer-id="34" @click="enable_camera = true" color="primary"> <v-icon class="mr-1">mdi-camera</v-icon> Activar Cámara </v-btn>
    </div>
    <div>{{ content }}</div>
    <div>{{ error_interface }}</div>
  </div>
</template>
<script>
import { Html5Qrcode } from "html5-qrcode";

export default {
  data() {
    return {
      content: "",
      enable_camera: true,
    };
  },
  methods: {
    getSkyKids() {},
  },
  mounted() {
    const html5QrcodeScanner = new Html5Qrcode("reader");
    html5QrcodeScanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
        },
        (qrCodeMessage) => {
          //   console.log(`QR Code scanned! qrCodeMessage: ${qrCodeMessage}`);
          this.content = qrCodeMessage;
          this.enable_camera = false;
          this.getSkyKids();
        },
        (errorMessage) => {
          //   console.log(`QR Code scan error, errorMessage: ${errorMessage}`);
        }
      )
      .catch((err) => {
        this.error_interface = `No se pudo comenzar a escanear, error: ${err}`;
        console.log(`Unable to start scanning, error: ${err}`);
      });
  },
};
</script>
