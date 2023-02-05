<template>
  <v-container>
    <v-form
      ref="formCredit"
      lazy-validation
      @submit.prevent="getAmortizationTable"
    >
      <v-row>
        <v-col cols="12" sm="3" md="3">
          <!-- <v-text-field v-model="capital" label="Capital Prestado"></v-text-field> -->
          <my-money v-model="capital" label="Capital Prestado"></my-money>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <!-- <v-text-field v-model="rate" prefix="" label="Interés %"></v-text-field> -->
          <my-money v-model="rate" prefix="" label="Interés %"></my-money>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <my-money
            :anOptions="{ decimalPlaces: 0 }"
            prefix=""
            v-model="total_payments"
            label="# Pagos"
          ></my-money>
        </v-col>
      </v-row>
      <v-row>
        <v-btn type="submit"> Guardar </v-btn>
      </v-row>
      <v-row>
        <v-simple-table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Erogación</th>
              <th>Interés</th>
              <th>IVA</th>
              <th>Capital</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rec, index) in amortization_table" :key="index">
              <td>{{ index }}</td>
              <td>{{ (rec.interes + rec.iva + rec.capital) | price }}</td>
              <td class="text-right">{{ rec.interes | price }}</td>
              <td class="text-right">{{ rec.iva | price }}</td>
              <td class="text-right">{{ rec.capital | price }}</td>
              <td class="text-right">{{ rec.saldo | price }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("credit-index")) return true;
    else throw error({ statusCode: 403 });
  },
  props: {},
  data() {
    return {
      capital: 120000,
      rate: 23.81,
      total_payments: 60,
      amortization_table: [],
    };
  },
  methods: {
    async getAmortizationTable() {
      let creditDTO = {
        capital: this.capital,
        rate: this.rate,
        total_payments: this.total_payments,
      };
      await this.$repository.Credit.getAmortizationTable(creditDTO)
        .then((res) => {
          this.amortization_table = res.table;
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
