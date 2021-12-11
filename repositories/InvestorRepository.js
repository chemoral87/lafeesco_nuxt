export default $axios => resource => ({
  newinvest(investorDTO) {
    return $axios.$post(`${resource}/newinvest`, investorDTO);
  }
});
