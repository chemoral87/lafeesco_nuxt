<template>
  <div>
    <div id="reader"></div>
    <div>{{ content }}</div>
  </div>
</template>
<script>
import { Html5Qrcode } from "html5-qrcode";

export default {
  data() {
    return {
      content: "",
    };
  },
  mounted() {
    const html5QrcodeScanner = new Html5Qrcode("reader");
    html5QrcodeScanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (qrCodeMessage) => {
          console.log(`QR Code scanned! qrCodeMessage: ${qrCodeMessage}`);
          this.content = qrCodeMessage;
        },
        (errorMessage) => {
          console.log(`QR Code scan error, errorMessage: ${errorMessage}`);
        }
      )
      .catch((err) => {
        console.log(`Unable to start scanning, error: ${err}`);
      });
  },
};
</script>
