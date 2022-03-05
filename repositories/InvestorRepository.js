export default $axios => resource => ({
  newinvest(investorDTO) {
    return $axios.$post(`${resource}/newinvest`, investorDTO);
  },
  sendVerificationCode(investorDTO) {
    return $axios.$post(`${resource}/sendVerificationCode`, investorDTO);
  },
  verifyCode(investorDTO) {
    return $axios.$post(`${resource}/verifyCode`, investorDTO);
  },
  saveMyProfile(investorProfile) {
    const config = { headers: { "content-type": "multipart/form-data" } };
    return $axios.$post(`${resource}/my-profile`, investorProfile, config);
  }
});
