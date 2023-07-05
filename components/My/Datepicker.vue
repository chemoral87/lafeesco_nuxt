<template>
  <v-menu v-model="menu_picker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="{ ...$props, ...$attrs }"
        :value="formated_value"
        @click:clear="clearPicker"
        clearable
        @click.native="menu_picker = true"
        @click:append="menu_picker = true"
        append-icon="mdi-calendar"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker no-title scrollable v-model="date_value" @input="menu_picker = false" locale="es">
      <v-spacer></v-spacer>
      <v-btn text color="error" @click="menu_picker = false">Cerrar</v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: ['value'],
  data() {
    return {
      menu_picker: null,
      date_value: null
    }
  },
  watch: {
    date_value() {
      this.$emit('input', this.date_value)
    },
    value(val) {
      console.log(val, 'ingresa')
      this.date_value = val
    }
  },
  computed: {
    formated_value() {
      return this.date_value ? this.$moment(this.date_value).format('DD-MMM-YYYY') : ''
    }
  },
  methods: {
    clearPicker() {
      this.date_value = null
    }
  },
  mounted() {
    let me = this
    this.date_value = this.value
  }
}
</script>
