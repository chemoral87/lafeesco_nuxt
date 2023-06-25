export default ($axios) => (resource) => ({
  my() {
    return $axios.$get(`${resource}/my`, {})
  }
})
