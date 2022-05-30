export default $axios => resource => ({
  initialCatalog(params = {}) {
    return $axios.$get(`${resource}/initialCatalog`, { params: params });
  },
  myMembersNoAddress() {
    return $axios.$get(`${resource}/my-members-no-address`);
  },
  create(payload) {
    return $axios.$post(`${resource}`, payload);
  },
  delete(id) {
    return $axios.$delete(`${resource}/${id}`);
  }
});
