import Vue from "vue";
Vue.filter("currency", function(value) {
  // tanks @li-x for his simple formating function
  return value.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  // return value.toLocaleString("en-UK", { style: "currency", currency: "EUR" });
  // you can add something like .replace(/,/g, ' ') after toLocaleString method to customize your formatted number
});
