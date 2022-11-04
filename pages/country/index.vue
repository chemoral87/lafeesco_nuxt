<template>
  <div>
    hola country

    <v-data-table
      :headers="headers"
      :items="countries"
      :items-per-page="50"
      class="elevation-1"
    >
      <template v-slot:[`item.popuarea`]="{ item }">
        {{ parseFloat(item.population) / parseFloat(item.area) }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { countries } from "@/pages/country/country";
export default {
  props: {},
  data() {
    return {
      countries: countries,
      headers: [
        { text: "Name", value: "name" },
        { text: "Area", value: "area" },
        { text: "Population", value: "population" },
        { text: "P / area", value: "popuarea" },
      ],
    };
  },
  methods: {},
  mounted() {
    let me = this;
  },
};
</script>
