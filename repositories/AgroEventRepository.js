let multipart = {
  headers: { "content-type": "multipart/form-data" },
};
export default ($axios) => (resource) => ({
  create(payload) {
    return $axios.$post(`${resource}`, payload, multipart);
  },
  update(id, payload) {
    return $axios.$post(`${resource}/${id}`, payload, multipart);
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
