<template>
  <v-container fluid>
    <div>
      <h1>dashboard</h1>
      {{authenticated}}
      {{user}} <br><br> a
      {{permissions}}
    </div>
  </v-container>

</template>
<script>
export default {
  props: {
  },
  data() {
    return {}
  },
  methods: {
  },
  mounted() {
    let me = this;
  }
}
</script>