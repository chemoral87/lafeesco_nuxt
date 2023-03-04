<template>
  <div>
    protected $fillable = [
    <template v-for="(def, ix) in definitions">
      <div
        :key="ix"
        v-if="
          def.column_key != 'PRI' &&
          !['created_at', 'updated_at'].includes(def.column_name)
        "
      >
        '{{ def.column_name }}',
      </div>
    </template>
    ];
  </div>
</template>
<script>
export default {
  props: ["component", "definitions"],
  data() {
    return {};
  },
  methods: {},
  mounted() {
    let me = this;
  },
};
</script>
