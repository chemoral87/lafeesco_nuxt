<template>
  <v-card-text class="pt-1 pb-0 text--primary">
    <span class="mr-2">{{ service.event_date | moment('dddd DD MMM') }}</span>
    <strong class="text--red" :class="getServiceColor(service.event_date)">{{ getServiceNumber(service.event_date) }}</strong>
    <strong v-if="showChurchServiceHour"> {{ service.event_date | moment('hh:mm a') }}</strong>
    <strong v-else> {{ getArriveDate(service.event_date) | moment('hh:mm a') }}</strong>

    <v-chip v-if="showDiffHumanize" small outlined :color="getDayDiffClass(service.event_date)">
      <strong v-if="getDayDiff(service.event_date) == 0"> HOY </strong>
      <strong v-else> {{ service.event_date | humanize }} </strong>
    </v-chip>
  </v-card-text>
</template>
<script>
export default {
  props: ['service', 'showChurchServiceHour', 'showDiffHumanize'],
  data() {
    return {}
  },
  methods: {
    getDayDiffClass(date) {
      const dayDiff = this.$options.filters.daysDiffFromNow(date)
      if (dayDiff > 0) {
        return 'orange'
      } else if (dayDiff === 0) {
        return 'red'
      } else {
        return 'blue'
      }
    },
    getDayDiff(date) {
      return this.$options.filters.daysDiffFromNow(date)
    },
    getServiceColor(date) {
      let hours = this.$moment(date).hours()
      let minutes = this.$moment(date).minutes()
      const time = `${hours}:${minutes}`

      switch (time) {
        case '9:0':
        case '19:30':
          return 'blue--text'
        case '11:30':
          return 'red--text'
        case '18:0':
          return 'green--text'
        default:
          return '0º'
      }
    },
    getServiceNumber(date) {
      let hours = this.$moment(date).hours()
      let minutes = this.$moment(date).minutes()
      const time = `${hours}:${minutes}`

      switch (time) {
        case '9:0':
        case '19:30':
          return '1º'
        case '11:30':
          return '2º'
        case '18:0':
          return '3º'
        default:
          return '0º'
      }
    },
    getArriveDate(date) {
      let _date = this.$moment(date)
      return _date.subtract(40, 'minutes')
    }
  },
  mounted() {
    let me = this
  }
}
</script>
