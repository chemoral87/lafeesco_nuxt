<template>
  <div ref="code">
    <v-btn color="primary" @click="copy()"><v-icon>mdi-content-copy</v-icon>Copiar</v-btn>
    <div ref="message" class="templ">
      protected $fillable = [
      <template v-for="(def, ix) in definitions">
        <div :key="ix" v-if="def.column_key != 'PRI' && !['created_at', 'updated_at'].includes(def.column_name)">
          '{{ def.column_name }}',
        </div>
      </template>
      ];
    </div>
  </div>
</template>
<script>
export default {
  props: ["component", "definitions"],
  data() {
    return {};
  },
  methods: {
    copy() {
      let range = document.createRange();
      range.selectNode(this.$refs.message);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);

      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      this.$store.dispatch("notify", {
        success: "Copiado al portapapeles"
      });
    }
  },
  mounted() {
    let me = this;
  }
};
</script>
