<template>

  <v-container style="max-width: 600;">
    <v-form>
      <v-row>
        <v-col cols="12">
          <span class="text-h5">Login - Iniciar Sesión</span>
        </v-col>
        <v-col cols="12">
          <v-text-field outlined v-model="email" label="Correo Electrónico" placeholder=" " persistent-placeholder :error-messages="errors ? errors.email : []"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field outlined v-model="password" label="Contraseña" placeholder=" " persistent-placeholder :error-messages="errors ? errors.password : []" @click:append="showned = !showned" :append-icon="showned ? 'mdi-eye' : 'mdi-eye-off'" :type="showned ? 'text' : 'password'"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn color="primary" class="mr-2 mb-8">Iniciar Sesión</v-btn>
          <v-btn outlined color="primary" class="mr-2 mb-8">¿Olvidate tu contraseña?</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>

</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      email: '',
      password: '',
      showned: false,
    }
  },
  methods: {
    submitLogin() {

    }
  },
  mounted() {
    let me = this;
  }
}
</script>