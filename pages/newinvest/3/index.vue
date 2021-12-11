<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <p class="text-h5">
          Estimado {{investor.name}} {{investor.last_name}}:
          <!-- {{capital}} -->
        </p>
        <p class="text-h6">
          Le hemos enviado un código a su correo
          <strong> {{investor.email}}</strong>
          para activar su cuenta y continuar con su inversión de {{ capital | currency }}

        </p>
        <!-- {{investor}} -->
      </v-col>
      <v-col cols="8" sm="4" md="3">
        <v-text-field outlined v-model="verification_code" label="Código de verificación" :error-messages="errors ? errors.verification_code : []"></v-text-field>
      </v-col>
      <v-col cols="12">
        <!-- <v-btn color="primary" @click="$router.push('/newinvest/2')">
          <v-icon class="mr-1">mdi-chevron-left</v-icon> Regresar
        </v-btn> -->
        <v-btn color="success">
          <v-icon class="mr-1">mdi-check</v-icon> Validar código
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: `Paso 3: Verificación`, icon: null, back: "/newinvest/2", show_drawer: false, show_login: false });
  },
  props: {
  },
  data() {
    return {
      verification_code: ""
    };
  },
  methods: {
    async sendVerificationCode() {
      await this.$repository.Investor.sendVerificationCode(this.investor);
    }
  },
  computed: {
    ...mapGetters("newinvest", [
      'capital',
      'investor'
    ]),
  },
  mounted() {
    let me = this;
    this.sendVerificationCode();
  }
}
</script>