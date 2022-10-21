let multipart = {
  accept: "application/json",
  headers: { "Content-Type": "multipart/form-data" },
};
// https://www.appsloveworld.com/react-native/100/7/request-formdata-to-api-gets-network-error-in-axios-while-uploading-image
export default ($axios) => (resource) => ({
  create(payload) {
    return $axios.$post(`${resource}`, payload, multipart);
  },
  update(id, payload) {
    return $axios.$post(`${resource}/${id}`, payload, multipart);
  },
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
  delete(id) {
    return $axios.$delete(`${resource}/${id}`);
  },
});
