export default function(context) {
  // export default function({ $axios, store, redirect }) {
  context.$axios.onError(error => {
    if (error.message == "Network Error") {
      alert("Error de Red, verifique su conexión a internet. Code1");
      alert(JSON.stringify(error));
    }

    if (error.response)
      if (error.response.status === 422 || error.response.status === 401) {
        context.store.dispatch(
          "validation/setErrors",
          error.response.data.errors
        );
      }
    context.store.dispatch("hideLoading");
    return Promise.reject(error);
  });

  context.$axios.onRequest(req => {
    context.store.dispatch("validation/clearErrors");
    if (!(req.headers.loading == false)) {
      context.store.dispatch("showLoading");
    }
  });

  context.$axios.onResponse(res => {
    context.store.dispatch("hideLoading");
    if (res.data) context.store.dispatch("notify", res.data);
  });
}
