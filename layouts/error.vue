<template>
  <v-container style="max-width:800px">

    <v-card>
      <v-card-title class="text-h4">
        <v-icon color="orange" size="70">mdi-alert</v-icon> Ocurrió un problema
      </v-card-title>
      <v-card-text>
        <div class="text-h6 text--primary">
          {{errorMessage}}
          <br>
          <br>

        </div>

        <div class="text-h6 text--primary mt-12">
          Presione el botón para continuar.
        </div>
      </v-card-text>
      <v-card-actions>
        <NuxtLink v-if="!authenticated" to="/">
          <v-btn color="primary">
            Ir al Inicio
          </v-btn>
        </NuxtLink>
        <NuxtLink v-if="authenticated" to="/dashboard">
          <v-btn color="primary">
            Ir al Dashboard
          </v-btn>
        </NuxtLink>
      </v-card-actions>

    </v-card>

  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  computed: {
    errorMessage() {
      if (this.error.statusCode == 403) {
        return "No tiene los suficientes permisos para ver esta página, verifique con el administrador del sistema.";
      }
      return "Ocurrio un error inesperado."
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.error.message
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
