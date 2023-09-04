<template>
  <div>
    <vue-qrcode-reader @decode="onDecode" />
    <p v-if="decodedText">{{ decodedText }}</p>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      decodedText: null,
    };
  },
  methods: {
    onDecode(decodedText) {
      this.decodedText = decodedText;
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
