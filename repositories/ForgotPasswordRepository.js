export default ($axios) => (resource) => ({
  sendResetCode(payload) {
    return $axios.$post(`${resource}/sendResetCode`, payload)
  },
  resetPassword(payload) {
    return $axios.$post(`${resource}/resetPassword`, payload)
  }
})
