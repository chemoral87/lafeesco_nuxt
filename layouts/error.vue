<template>
  <v-container style="max-width: 800px">
    <v-card>
      <v-card-title class="text-h4">
        <v-icon :color="color" size="40">mdi-alert</v-icon> Ocurrió un problema
      </v-card-title>
      <v-card-text>
        <div class="text-h5 text--primary" v-html="errorMessage">
          <br />
          <br />
        </div>
        <div class="text-h6 text--primary mt-12">
          Presione el siguiente botón.
        </div>
      </v-card-text>
      <v-card-actions>
        <NuxtLink v-if="!authenticated" to="/login">
          <v-btn color="primary"> Ir al Inicio </v-btn>
        </NuxtLink>
        <NuxtLink v-if="authenticated" to="/dashboard">
          <v-btn color="primary"> Ir al Dashboard </v-btn>
        </NuxtLink>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  layout: "default",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      color: "orange",
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  computed: {
    errorMessage() {
      if (this.error.statusCode == 403) {
        let message = this.error.message ? this.error.message : "";
        console.log(this.error);
        return `No tiene los suficientes permisos para ver esta página, verifique con el administrador del sistema. <br/><br/> ${message}`;
      } else if (this.error.statusCode == 404) {
        this.color = "red";
        return "Registro No Encontrado.";
      }
      return "Ocurrio un error inesperado.";
    },
  },
  head() {
    let title = "";
    // this.error.statusCode === 404 ? this.pageNotFound : this.error.message;

    this.error.statusCode === 404 && (title = this.pageNotFound);
    this.error.statusCode === 403 && (title = "Permisos");

    return {
      title,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
