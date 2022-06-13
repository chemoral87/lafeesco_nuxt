export default $axios => resource => ({
  indexByMember(id, params = {}) {
    return $axios.$get(`${resource}/by-member/${id}`, { params: params });
  },
  getCallTypes() {
    return $axios.$get(`${resource}/call-types`);
  },
  create(payload) {
    return $axios.$post(`${resource}`, payload);
  },
  update(id, payload) {
    return $axios.$put(`${resource}/${id}`, payload);
  },
  delete(id) {
    return $axios.$delete(`${resource}/${id}`);
  },
  show(id) {
    return $axios.$get(`${resource}/${id}`);
  }
});
