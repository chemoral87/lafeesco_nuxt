<template>
  <v-select v-model="selected" :items="items" label="Org" item-text="name" item-value="id" v-bind="$attrs"></v-select>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      items: [],
      selected: null
    };
  },
  watch: {
    selected(val) {
      this.$emit("input", val);
    }
  },
  methods: {},
  mounted() {
    let me = this;
    me.items = this.orgs;
    if (this.orgs.length == 1) {
      me.selected = this.orgs[0].id;
    }
  }
};
</script>
