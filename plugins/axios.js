export default function (context) {
  // export default function({ $axios, store, redirect }) {
  context.$axios.onError((error) => {
    if (error.message == 'Network Error') {
      alert('Error de conexión, verifique sus datos a Internet.')
      // alert(JSON.stringify(error));
    }

    if (error.response) {
      console.log(error.response.data)
      if (error.response.status === 422 || error.response.status === 401) {
        context.store.dispatch(
          'validation/setErrors',
          error.response.data

          // error.response.data.errors
        )
      }
    }
    context.store.dispatch('hideLoading')
    return Promise.reject(error)
  })

  context.$axios.onRequest((req) => {
    context.store.dispatch('validation/clearErrors')
    if (context.store.getters.hideNextLoading) {
      context.store.dispatch('showNextLoading')
    } else {
      context.store.dispatch('showLoading')
    }
  })

  context.$axios.onResponse((res) => {
    context.store.dispatch('hideLoading')
    if (res.data) context.store.dispatch('notify', res.data)
  })
}
