<template>
  <v-row dense>
    <v-col cols="auto" v-for="(note, ix) in notes" :key="ix">
      <v-chip large @click="play(note)">
        {{ note }}
        <v-icon small class="ml-7" color="red" @click="$emit('remove', note)"
          >mdi-close-box</v-icon
        >
      </v-chip>
    </v-col>
  </v-row>
</template>
<script>
import { notes_map } from "/static/notes-map";
export default {
  props: ["notes"],
  data() {
    return {};
  },
  methods: {
    play(note) {
      let audio = new Audio(`/notes/${notes_map[note]}.mp3`); // G2
      audio.play();
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
