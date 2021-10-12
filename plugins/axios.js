export default function ({ $axios, store, redirect }) {
  $axios.onError((error) => {
    if (error.message == 'Network Error') {
      alert('Error de Red, verifique su conexión a internet')
    }

    if (error.response)
      if (error.response.status === 422) {
        store.dispatch('validation/setErrors', error.response.data.errors)
        // return redirect('/login')
      }

    return Promise.reject(error)
  })

  $axios.onRequest(() => {
    store.dispatch('validation/clearErrors')
  })
}
