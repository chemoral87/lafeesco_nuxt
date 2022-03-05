export default $axios => resource => ({
  contractReturns() {
    return $axios.$get(`${resource}/contract-returns`);
  },
  myIndex(params) {
    return $axios.$get(`${resource}/my-index`, { params: params });
  },
  myProfile(params) {
    return $axios.$get(`${resource}/my-profile`, { params: params });
  }
});
