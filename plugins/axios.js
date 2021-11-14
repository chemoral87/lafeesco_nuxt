export default function({ $axios, store, redirect }) {
  $axios.onError(error => {
    console.log("axios error");
    if (error.message == "Network Error") {
      alert("Error de Red, verifique su conexión a internet");
    }

    if (error.response)
      if (error.response.status === 422) {
        store.dispatch("validation/setErrors", error.response.data.errors);
        // return redirect('/login')
      }

    return Promise.reject(error);
  });

  $axios.onRequest(() => {
    console.log("axios clear error");
    store.dispatch("validation/clearErrors");
  });
}
