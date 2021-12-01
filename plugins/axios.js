export default function(context) {
  // export default function({ $axios, store, redirect }) {
  context.$axios.onError(error => {
    if (error.message == "Network Error") {
      alert("Error de Red, verifique su conexión a internet. Code1");
      alert(error.response);
    }

    if (error.response)
      if (error.response.status === 422) {
        context.store.dispatch(
          "validation/setErrors",
          error.response.data.errors
        );
        // return redirect('/login')
      }

    return Promise.reject(error);
  });

  context.$axios.onRequest(() => {
    context.store.dispatch("validation/clearErrors");
  });

  context.$axios.onResponse(res => {
    if (res.data) context.store.dispatch("notify", res.data);
  });
}
