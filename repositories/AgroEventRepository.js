export default ($axios) => (resource) => ({
  create(payload) {
    return $axios.$post(`${resource}`, payload, {
      headers: { "content-type": "multipart/form-data" },
    });
  },
  index(params) {
    if (params) {
      return $axios.$get(`${resource}`, { params: params });
    } else {
      return $axios.$get(`${resource}`);
    }
  },
  show(id) {
    return $axios.$get(`${resource}/${id}`);
  },
});
