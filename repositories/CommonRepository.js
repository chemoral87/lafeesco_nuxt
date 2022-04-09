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

  filter(params, headers) {
    return $axios.$get(`${resource}/filter`, {
      params: params,
      headers
    });
  },

  create(payload) {
    return $axios.$post(`${resource}`, payload);
  },

  update(id, payload) {
    return $axios.$put(`${resource}/${id}`, payload);
  },

  // belongsToMany
  children(id, payload) {
    return $axios.$put(`${resource}/${id}/children`, payload);
  },

  delete(id) {
    return $axios.$delete(`${resource}/${id}`);
  }
});
