export default {
  created() {
    // console.log('Mixin created')
  },
  methods: {
    isSunday(date) {
      return this.$moment(date).day() === 0
    },
    getServiceColor(date) {
      let hours = this.$moment(date).hours()
      let minutes = this.$moment(date).minutes()
      const time = `${hours}:${minutes}`
      switch (time) {
        case '19:30': // domingo 1
          return 'light-blue lighten-5'
        // case '19:30': // miercoles
        //   return 'light-blue lighten-5'
        // case '11:30':
        //   return 'orange lighten-5'
        // case '18:0':
        //   return 'red lighten-5'
        // default:
        //   return '0º'
      }
    },
    getArriveDate(date) {
      let _date = this.$moment(date)
      return _date.subtract(40, 'minutes')
    },
    allowedDates(val) {
      let day = this.$moment(val).day()
      //0 is sunday
      if ([0, 3].indexOf(day) > -1) return true
      return false
    }
    // other methods
  }
}
