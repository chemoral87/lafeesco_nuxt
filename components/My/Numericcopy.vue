<template>
  <v-text-field v-model="formattedValue" @input="onInput" ref="input" />
</template>

<script>
import { VTextField } from 'vuetify/lib'

export default {
  extends: VTextField,
  data() {
    return {
      rawValue: null
    }
  },
  computed: {
    formattedValue: {
      get() {
        // Format the raw value for display
        if (this.rawValue == null) return ''
        if ((this.rawValue * 100) % 100 == 0) return `${this.rawValue}`
        return `${this.rawValue.toFixed(2)}`
      },
      set(value) {
        // Parse the formatted value and store the raw value
        if (value == null || value === '') {
          this.rawValue = null
        } else {
          // const regex = /^\$\s(\d+(\.\d{0,2})?)$/; // Original regular expression
          const regex = /^(\d+(\.\d{0,2})?)$/
          //const regex = /^\$\s(\d+(\.\d{0,2})?)?$/; // Modified regular expression
          const matches = regex.exec(value)
          if (matches) {
            this.rawValue = parseFloat(matches[1])
          }
        }
      }
    }
  },
  methods: {
    onInput() {
      this.$emit('input', this.rawValue)
    }
  },
  watch: {
    value() {
      this.rawValue = this.value
    }
  }
}
</script>
