export default ($axios) => (resource) => ({
  getTables(params = {}) {
    return $axios.$get(`${resource}/tables`, { params: params });
  },
  getDefinitions(params = {}) {
    return $axios.$get(`${resource}/definitions`, { params: params });
  },
});
