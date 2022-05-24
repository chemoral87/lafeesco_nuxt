<template>
  <div>
  </div>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('consolidador-index'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Consolidar", icon: "account-plus" });
  },
  props: {
  },
  data() {
    return {};
  },
  methods: {
  },
  mounted() {
    let me = this;
  }
}
</script>
