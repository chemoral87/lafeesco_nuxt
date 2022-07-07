export default $axios => resource => ({
  getMaritalStatuses(params = {}) {
    return $axios.$get(`${resource}/marital-statuses`, { params: params });
  },
  getMemberCategories(params = {}) {
    return $axios.$get(`${resource}/member-categories`, { params: params });
  },
  getMemberSources(params = {}) {
    return $axios.$get(`${resource}/member-sources`, { params: params });
  },
  indexMyNoAddress() {
    return $axios.$get(`${resource}/my-no-address`);
  },
  indexMy(params) {
    return $axios.$get(`${resource}/my`, { params: params });
  },
  indexToCall(params) {
    return $axios.$get(`${resource}/to-call`, { params: params });
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
