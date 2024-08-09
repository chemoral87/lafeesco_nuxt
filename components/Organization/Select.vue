<template>
  <v-select v-model="selected" :items="items" label="Org" item-text="name" item-value="id" v-bind="$attrs"></v-select>
</template>
<script>
export default {
  props: ["permission"],
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
    let org_ids = this.permissions[this.permission];

    let filter_orgs = this.orgs.filter(org => org_ids.includes(org.id));

    me.items = filter_orgs;

    // select if only one
    if (filter_orgs.length == 1) {
      me.selected = filter_orgs[0].id;
    }
  }
};
</script>
