<template>
  <v-container class="mt-3" style="max-width: 600px;">
    <v-form @submit.prevent="submitLogin">
      <v-row>
        <v-col cols="12">
          <span class="text-h5">Login</span>
        </v-col>
        <v-col cols="12">
          <v-text-field outlined v-model="email" label="Correo Electrónico" placeholder=" " persistent-placeholder :error-messages="errors ? errors.email : []"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field outlined v-model="password" label="Contraseña" placeholder=" " persistent-placeholder :error-messages="errors ? errors.password : []" @click:append="showned = !showned" :append-icon="showned ? 'mdi-eye' : 'mdi-eye-off'" :type="showned ? 'text' : 'password'"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn type="submit" color="primary" class="mr-2 mb-8">Iniciar Sesión</v-btn>
          <v-btn outlined color="primary" class="mr-2 mb-8">¿Olvidate tu contraseña?</v-btn>
        </v-col>
      </v-row>

    </v-form>
    <v-btn @click="getCoordinates()">Corr {{name_secret}}</v-btn>
  </v-container>

</template>
<script>
export default {
  middleware: ['guest'],
  created() {
    this.$nuxt.$emit("setNavBar", { title: `Login`, icon: "lock" });
  },
  data() {
    return {
      email: '',
      password: '',
      showned: false, // mostrar password
      name_secret: ""
    };
  },
  methods: {
    async submitLogin() {
      try {

        let credentials = {
          email: this.email,
          password: this.password
        };

        await this.$auth.loginWith("laravelJWT", { data: credentials });
        this.$router.push({
          path: this.$route.query.redirect || "/dashboard"
        });

      } catch (e) {

      }
    },
    async getCoordinates() {
      alert("tomasin");
      const coordinates = await this.$CapacitorGeolocation.getCurrentPosition();
      alert(JSON.stringify(coordinates));
    }
  },
  mounted() {
    let me = this;

    this.name_secret = process.env.BASE_URL;
    // this.name_secret = process.env.NAME_SECRET;
  }
}
</script>