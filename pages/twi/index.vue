<template>
  <v-container>
    //form to send textmessage to a number
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="item.number" label="Number" required></v-text-field>

      <v-text-field
        v-model="item.text"
        :counter="160"
        :rules="rules"
        label="Text"
        required
      ></v-text-field>
      <v-btn :disabled="!valid" color="primary" @click="sendText">Send</v-btn>
    </v-form>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      item: {
        number: "",
        text: ""
      },
      valid: false,
      rules: [
        (v) => !!v || "Requerido",
        (v) => (v && v.length <= 160) || "Text must be less than 160 characters"
      ]
    };
  },
  methods: {
    sendText() {
      this.$repository.TextMessage.send(this.item).then((response) => {
        console.log("sendText", response);
      });
    }
  },
  mounted() {
    let me = this;
  }
};
</script>
