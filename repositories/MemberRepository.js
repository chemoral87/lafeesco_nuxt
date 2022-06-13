export default $axios => resource => ({
  initialCatalog(params = {}) {
    return $axios.$get(`${resource}/initialCatalog`, { params: params });
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
