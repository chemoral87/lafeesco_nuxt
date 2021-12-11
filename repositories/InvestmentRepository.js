export default $axios => resource => ({
  contractReturns() {
    return $axios.$get(`${resource}/contract-returns`);
  }
});
