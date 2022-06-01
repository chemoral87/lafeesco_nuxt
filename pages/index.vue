<template>

  <v-row>

    <v-col cols="12">
      REDES SOCIALES
    </v-col>
  </v-row>

</template>
<script>
export default {
  data() {
    return {
      // chartData: {
      //   datasets: [{
      //     label: 'Title',
      //     data: [45, 55, 48, 35, 12]
      //   }]
      // }
      chartData: {
        labels: ['January', 'February'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20],
            minBarLength: 10
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          },
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: process.env.APP_NAME, icon: null });
  },
  methods: {
    invest() {
      this.$router.push('/newinvest/1');
    }
  }
}
</script>

