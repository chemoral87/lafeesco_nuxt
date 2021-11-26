export default $axios => resource => ({
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

  filter(params) {
    return $axios.$get(`${resource}/filter`, { params: params });
  },

  create(payload) {
    return $axios.$post(`${resource}`, payload);
  },

  update(id, payload) {
    return $axios.$put(`${resource}/${id}`, payload);
  },

  delete(id) {
    return $axios.$delete(`${resource}/${id}`);
  }
});
