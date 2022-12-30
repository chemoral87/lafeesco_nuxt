<template>
  <v-text-field
    v-bind="{ ...$props, ...$attrs }"
    v-model="formatted"
    @input="formatNumber($event)"
    ref="myInput"
  />
</template>

<script>
export default {
  props: {
    // label: {
    //   type: String,
    //   required: true,
    // },
    value: {
      required: true,
    },
  },
  data() {
    return {
      number: 0,
      formatted: "",
    };
  },
  computed: {},
  watch: {
    formatted(neww, oldd) {
      // console.log("@watch2", val, oldd, this.formatted);
      let index = -1; // índice por defecto en caso de que las cadenas seans
      let reverse_index = -1;

      let len = neww.length - oldd.length;
      let long_ = neww.length > oldd.length ? neww : oldd;
      let short_ = neww.length > oldd.length ? oldd : neww;
      let long_r = long_.split("").reverse().join("");
      let short_r = short_.split("").reverse().join("");
      for (let i = 0; i < long_.length; i++) {
        if (long_[i] !== short_[i]) {
          index = i;
          break;
        }
      }

      for (let i = 0; i < long_r.length; i++) {
        if (long_r[i] !== short_r[i]) {
          reverse_index = i;
          break;
        }
      }
      let bodyTextArea = this.$refs.myInput.$el.querySelector("input");
      let current_selectionStart = bodyTextArea.selectionStart;
      let current_selectionEnd = bodyTextArea.selectionEnd;
      // console.log("@watch2", index, neww, oldd);
      console.log(
        "len:",
        len,
        "current_selectionStart:",
        current_selectionStart,
        "index:",
        index,
        "reverse_index:",
        reverse_index
      );

      this.$nextTick(() => {
        bodyTextArea.selectionStart = index + 1;
        bodyTextArea.selectionEnd = index + 1;
        this.$emit("input", neww);
        // if (len > 0) {
        //   bodyTextArea.selectionStart = index + len;
        //   bodyTextArea.selectionEnd = index + len;
        // } else {
        //   bodyTextArea.selectionStart = index;
        //   bodyTextArea.selectionEnd = index;
        // }
      });
    },
  },
  methods: {
    formatNumber(e) {
      console.log("@input1", e);

      // console.log("formatNumber", e);
      // e = e.toString().replace(/\d{4}/g, "$& ").trim();

      // console.log(e);
      let stg = e.replace(/\s/g, "");
      let new_formatted = stg.toString().replace(/\d{4}/g, "$& ").trim();
      console.log(new_formatted);
      this.$nextTick(() => {
        this.formatted = new_formatted;
      });

      // let code = this.$refs.myInput;
      // let bodyTextArea = this.$refs.myInput.$el.querySelector("input");
      // bodyTextArea.selectionStart = 3;
      // bodyTextArea.selectionEnd = 3;
    },
  },
  mounted() {
    this.formatted = this.value.toString().replace(/\d{4}/g, "$& ").trim();
  },
};
</script>
