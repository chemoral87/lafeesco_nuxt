<template>
  <v-container class="pa-0" style="max-width:1400px">
    <v-row dense justify="center" align="center">
      <v-col cols="12">

        <v-card class=" d-flex align-end rc_desarrolladora">
          <v-card-text>
            <v-btn @click="invest()" class="ml-5 mb-5" x-large color="success">
              <v-icon class="mr-1">mdi-sprout</v-icon> Quiero invertir
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <NuxtLogo />
        <VuetifyLogo />
      </v-card>
      <v-card>
        <v-card-title class="headline">
          Welcome to the Otro + Nuxt.js template
        </v-card-title>
        <v-card-text>
          <p>Vuetify is a progressive Material Design component framework for Vue.js. It was designed to empower developers to create amazing applications.</p>
          <p>
            For more information on Vuetify, check out the <a href="https://vuetifyjs.com" target="_blank" rel="noopener noreferrer">
              documentation
            </a>.
          </p>
          <p>
            If you have questions, please join the official <a href="https://chat.vuetifyjs.com/" target="_blank" rel="noopener noreferrer" title="chat">
              discord
            </a>.
          </p>
          <p>
            Find a bug? Report it on the github <a href="https://github.com/vuetifyjs/vuetify/issues" target="_blank" rel="noopener noreferrer" title="contribute">
              issue board
            </a>.
          </p>
          <p>Thank you for developing with Vuetify and I look forward to bringing more exciting features in the future.</p>
          <div class="text-xs-right">
            <em><small>&mdash; John Leider</small></em>
          </div>
          <hr class="my-3">
          <a href="https://nuxtjs.org/" target="_blank" rel="noopener noreferrer">
            Nuxt Documentation
          </a>
          <br>
          <a href="https://github.com/nuxt/nuxt.js" target="_blank" rel="noopener noreferrer">
            Nuxt GitHub
          </a>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col> -->
      <v-col cols="12">
        ULTIMOS PROYECTOS
        <div style="width:50%">
          <!-- <bar-chart :data="chartData" :options="options"></bar-chart> -->

        </div>

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
