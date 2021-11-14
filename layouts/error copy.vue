<template>
  <v-container>
    <!-- {{error}} -->
    <h1 class="text-h1">Error al ingresar a la páginas</h1>
    <h3 class="text-h3"> {{error.message}} </h3>
    <NuxtLink v-if="!authenticated" to="/">
      Ir al inicio
    </NuxtLink>
    <NuxtLink v-if="authenticated" to="/dashboard">
      Ir al Dashboard
    </NuxtLink>
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
