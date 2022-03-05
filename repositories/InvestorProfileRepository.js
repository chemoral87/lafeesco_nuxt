export default $axios => resource => ({
  myIndex() {
    return $axios.$get(`${resource}/my`);
  },
  myUpdate(investorProfile) {
    const config = { headers: { "content-type": "multipart/form-data" } };
    return $axios.$post(`${resource}/my`, investorProfile, config);
  }
});
