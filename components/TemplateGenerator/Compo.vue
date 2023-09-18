<template>
  <component class="templ" :is="'TemplateGenerator' + component" :definitions="definitions" :table_name="table_name"
    :variable_name="variable_name">
  </component>
</template>
<script>
// import List from 'list/';
// import components from "./list";
export default {
  props: ["component", "definitions", "table_name", "variable_name"],
};
</script>
<style scoped>
.templ {
  background-color: rgba(255, 191, 0, 0.3);
}
</style>
