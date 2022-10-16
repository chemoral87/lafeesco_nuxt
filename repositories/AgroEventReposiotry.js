export default ($axios) => (resource) => ({
  create(payload) {
    return $axios.$post(`${resource}`, payload, {
      headers: { "content-type": "multipart/form-data" },
    });
  },
});
