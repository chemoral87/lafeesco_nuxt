<template>
  <v-layout row justify-center>
    <v-dialog v-model="value" persistent content content-class="centered-dialog">
      <v-container fill-height>
        <v-layout column justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" :color="progressColor"></v-progress-circular>
          <br>
          <span class="text-h5" v-if="message != null">{{message}}</span>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: "Loading",
  data: function () {
    return {};
  },
  props: {
    value: { type: Boolean, default: false },
    message: { type: String, default: 'Espere...' },
    progressColor: { type: String, default: 'white' },
  },
}
</script>

<style >
.dialog.centered-dialog,
.v-dialog.centered-dialog {
  background: #282c2dad;
  box-shadow: none;
  border-radius: 6px;
  width: auto;
  color: whitesmoke;
}
</style>
