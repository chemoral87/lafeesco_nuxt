<template>
  <v-container>
    <p class="text-h4">FELICIDADES!!</p>
    <p class="text-h5">
      Su cuenta ha sido verificada, favor de ir al login con su correo <strong>
        {{investor.email}}
      </strong> y contraseña para continuar con su contrato.

    </p>

    <v-btn @click=" loginAndClear()" color="primary">Ir a Login</v-btn>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: `Cuenta Verificada`, icon: "check", back: null, show_drawer: false, show_login: false });
  },
  computed: {
    ...mapGetters("newinvest", [
      'capital',
      'investor'
    ]),
  },
  methods: {
    loginAndClear() {
      // clear capital and investor
      this.$store.commit("newinvest/CLEAR_INVESTOR");
      this.$router.push('/login');

    }
  },
  mounted() {
    if (this.capital == null && this.investor.email == "") {
      this.$router.push('/login');
    }
  }
}
</script>
