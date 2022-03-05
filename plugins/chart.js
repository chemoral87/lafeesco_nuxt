import Vue from "vue";
import { Line, Bar } from "vue-chartjs";
// For me, I just had to downgrade from chart.js@3.x to chart.js@2.9.4
// npm install chart.js@2.9.4
// https://gist.github.com/WesThorburn/7bcc930e9b48e002be67de4a00cc9420
Vue.component("line-chart", {
  extends: Line,
  props: ["data", "options"],
  mounted() {
    this.renderChart(this.data, this.options);
  }
});

Vue.component("bar-chart", {
  extends: Bar,
  props: ["data", "options"],
  mounted() {
    this.renderChart(this.data, this.options);
  }
});
