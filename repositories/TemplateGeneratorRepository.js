export default ($axios) => (resource) => ({
  getTables(params = {}) {
    return $axios.$get(`${resource}/tables`, { params: params });
  },
});
