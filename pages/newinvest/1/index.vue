<template>
  <v-form>
    <v-container>

      <!-- <v-row>
        <v-col cols="12">
          <span class="text-h5">Paso 1 - Monto de Inversión</span>
        </v-col>
      </v-row> -->
      <v-row>
        <v-col cols="auto">
          <div>
            <span class="text-h6">TABLA DE RENDIMIENTOS</span>
            <v-simple-table dense>
              <template v-slot:default>
                <thead class="zebraheader">
                  <tr>
                    <th>
                      <strong>INVERSIÓN</strong>
                    </th>
                    <th>
                      <strong>RENDIMIENTO</strong>

                    </th>
                  </tr>
                </thead>
                <tbody class="zebra">
                  <tr v-for="item in contractReturns" :key="item.id">
                    <td>{{ item.label }}</td>
                    <td class="d-flex justify-center">{{ parseInt(item.yield)  }} %</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <MyMoney :anOptions="{decimalPlaces: 0}" persistent-placeholder placeholder="Ingrese monto a invertir" label="Monto a Invertir" ref="field" v-model="capital_" :error-messages="errors ? errors.capital : []" outlined></MyMoney>
          <!-- <v-text-field label="Monto a Invertir" ref="field" v-model="capital" :error-messages="errors ? errors.capital : []" outlined placeholder="Ingrese el monto a invertir"></v-text-field> -->
        </v-col>
      </v-row>

      <v-btn color="error" @click="cancelInvest">
        <v-icon class="mr-1">mdi-cancel</v-icon> Cancelar
      </v-btn>
      <v-btn color="primary" @click="nextStep()">
        <v-icon class="mr-1">mdi-chevron-right</v-icon> Siguiente
      </v-btn>
    </v-container>
  </v-form>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: `Paso 1: Monto Inversión`, icon: null, back: "/", show_drawer: false, show_login: false });
  },
  props: {
  },
  computed: {
    ...mapGetters("newinvest", [
      'capital',
    ])
    // ...mapGetters([
    //   'persistedStates',
    // ])
  },
  async asyncData({ $axios, app, params }) {
    const res = await app.$repository.Investment.contractReturns()
      .catch(e => { });
    return { contractReturns: res };
  },
  data() {
    return {
      contractReturns: [],
      capital_: null,
      // money: {},
      //   prefix: '$ ',
      //   suffix: ' #',
      //   precision: 2,
      //   masked: false /* doesn't work with directive */
      // }
    };
  },

  methods: {
    cancelInvest() {
      this.$store.commit("newinvest/SET_CAPITAL", 0);
      this.$router.push('/');
    },
    nextStep() {
      if (this.validateCapital()) {
        this.$store.commit("newinvest/SET_CAPITAL", this.capital_);
        this.$router.push('/newinvest/2');
        // this.$store.commit("SET_STATE", this.capital_);
      } else {
        this.$store.commit("newinvest/SET_CAPITAL", 0);
      }
    },
    validateCapital() {
      let error = {};
      if (this.capital_ < 10000) {
        error.capital = "El monto mínimo es de $ 10,000 pesos mexicanos";
      }

      this.$store.dispatch("validation/setErrors", error);
      if (Object.keys(error).length > 0) {
        return false;
      }
      return true;

    },

  },

  mounted() {
    let me = this;
    this.capital_ = this.capital;
  }
}
</script>
<style>
.zebraheader {
  background-color: #ffe082;
}

.zebra tr:nth-child(odd) {
  background-color: #f2f2f2;
  color: black;
}
</style>