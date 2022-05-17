<template>
  <v-container>
    <v-row dense no-gutters>
      <v-col cols="12">

        <!-- <v-card class=" d-flex align-end ">
          <v-card-text>

          </v-card-text>
        </v-card> -->
      </v-col>

      <v-col cols="12">
        REDES SOCIALES
      </v-col>
    </v-row>

  </v-container>
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
<style scoped>
.rc_desarrolladora {
  /* background: black; */
  background: url("/fondo.jpg") no-repeat center top;
  /* background-repeat: no-repeat; */
  background-size: cover;

  min-height: 60vh;
  /* min-height: 600px; */
}
</style>
