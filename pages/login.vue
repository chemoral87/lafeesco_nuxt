<template>
  <v-container class="mt-3" style="max-width: 600px;">
    <v-form @submit.prevent="submitLogin">
      <v-row>
        <v-col cols="12">
          <span class="text-h5">Inicio Sesión</span>
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

  </v-container>

</template>
<script>
export default {
  middleware: ['guest'],
  created() {
    this.$nuxt.$emit("setNavBar", { title: `Inicio Sesión`, icon: "lock", show_login: false });
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

  },
  mounted() {
    let me = this;

    this.name_secret = process.env.BASE_URL;
    // this.name_secret = process.env.NAME_SECRET;
  }
}
</script>
