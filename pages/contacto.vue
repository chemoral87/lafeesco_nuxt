<template>
  <v-container class="m-0 p-0">
    <v-card class="elevation-0 mt-0">
      <v-img style="background:black" height="230px" class="white--text align-end" contain :src="'/contacto.jpg'">
        <v-card-title class="text-h3">Contacto</v-card-title>
      </v-img>
    </v-card>

    <div class="text-h6 my-2">Escribenos a través del siguiente formulario</div>
    <v-form @submit.prevent="sendMessageContact()">
      <v-row dense>
        <v-col cols="12" sm="4">
          <v-text-field v-model="form.name" label="Nombre" outlined hide-details="true"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="form.email" label="E-Mail*" outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field v-model="form.celular" label="Celular" outlined hide-details="true"></v-text-field>
        </v-col>
        <v-col cols="12" sm="8">
          <v-textarea :counter="250" v-model="form.message" label="Mensaje*" outlined></v-textarea>
        </v-col>
        <v-col cols="4">
          <p>*
            Se aplica nuestra <nuxt-link to="/aviso-privacidad">Política de privacidad</nuxt-link>
          </p>
          <v-btn big color="primary">
            <v-icon class="mr-1">mdi-send</v-icon> Enviar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Contacto", icon: "account-voice", show_login: false });
  },
  props: {
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        celular: '',
        message: ''
      }
    };
  },
  methods: {
    sendMessageContact() {
      alert("mensaje enviado");
    }
  },
  mounted() {
    let me = this;
  }
}
</script>
