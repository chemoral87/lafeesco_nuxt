<template>
  <v-container fluid>
    <v-row v-for="game in games" :key="game.id">
      <EarTrainerGameListItem
        @delete="deleteItem($event)"
        @verify="verify($event)"
        :game="game"
      ></EarTrainerGameListItem>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: ["games"],
  data() {
    return {};
  },
  methods: {
    deleteItem(guid) {
      this.$emit("deleteItem", guid);
    },
    verify(result) {
      this.$emit("verify", result);
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
