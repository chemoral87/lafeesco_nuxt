<template></template>
<script>
export default {
  props: {},
  data() {
    return {}
  },
  methods: {},
  mounted() {
    let me = this
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Servicios Generales',
      icon: 'church'
    })
  }
}
</script>
