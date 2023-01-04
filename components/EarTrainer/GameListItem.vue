<template>
  <v-row dense>
    <v-col cols="auto">
      <v-btn @click="play()" color="primary">
        <v-icon class="mr-1">mdi-play</v-icon>
      </v-btn>
      <v-btn
        v-if="game.resolve === 0"
        @click="$emit('delete', game.id)"
        color="error"
      >
        <v-icon class="mr-1">mdi-delete</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="3" sm="2">
      <v-text-field
        v-model="response"
        label="Respuesta"
        :disabled="game.resolve !== 0"
        hide-details
      />
    </v-col>
    <v-col cols="auto">
      <v-btn @click="verify()" color="success" v-if="game.resolve === 0">
        check
      </v-btn>
      <template v-if="game.resolve === false">
        <v-chip color="error">
          <v-icon>mdi-close</v-icon>
        </v-chip>
        {{ game.notes.join(" ") }}
      </template>

      <v-chip color="green" text-color="white" v-if="game.resolve === true">
        <v-icon>mdi-check</v-icon>
      </v-chip>
    </v-col>
  </v-row>
</template>
<script>
import { notes_map } from "/static/notes-map";
export default {
  props: ["game"],
  data() {
    return {
      response: "",
      notes: [],
    };
  },
  methods: {
    verify() {
      let response = this.response.trim().split(" ");
      let {
        game: { notes },
      } = this;

      if (this.response.trim() == "" || response.length != notes.length) {
        alert("Ingrese " + notes.length + " nota(s)");
        return;
      }
      for (let i = 0; i < notes.length; i++) {
        let a = response[i];

        let b = notes[i][0];

        if (a.toUpperCase() != b.toUpperCase()) {
          this.$emit("verify", { id: this.game.id, result: false });
          return false;
        }
      }
      this.$emit("verify", { id: this.game.id, result: true });
    },
    play() {
      this.notes.forEach((note, index) => {
        setTimeout(() => {
          let audio = new Audio(`/notes/${notes_map[note]}.mp3`); // G2
          audio.play();
        }, 850 * index);
        //           ^^^^^^^^^ delay more for each following element
      });
    },
  },
  mounted() {
    let me = this;
    me.notes = me.game.notes;
    this.play();
  },
};
</script>
