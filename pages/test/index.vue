<template>
  <div>REVERSE NUMBER {{ reverseNumber(1234) }}</div>
</template>
<script>
export default {
  props: {},
  data() {
    return {}
  },
  methods: {
    reverseNumber(number) {
      let str_number = number.toString()
      let reverse_number = ''
      for (var i = str_number.length - 1; i >= 0; i--) {
        reverse_number += str_number[i]
      }
      return reverse_number
    }
  },
  mounted() {
    let me = this
  }
}
</script>
