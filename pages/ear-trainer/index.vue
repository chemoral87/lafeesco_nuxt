<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <EarTrainerNotes
          @remove="removeNoteList($event)"
          :notes="playNotesList"
        ></EarTrainerNotes>
      </v-col>
      <v-col cols="1">
        <v-text-field v-model="tone" label="Nota" hide-details></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="addPlayNoteList()" color="primary"> Agregar </v-btn>

        <v-btn @click="playNote()" color="info"> Test Note </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="1">
        <v-text-field
          v-model="max_tones"
          label="#Notas"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="play()" color="primary"> Jugar </v-btn>
      </v-col>
      <v-col cols="12">
        <EarTrainerGameList
          @deleteItem="deleteItem($event)"
          @verify="verify($event)"
          :games="games"
        ></EarTrainerGameList>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { notes_map } from "/static/notes-map";
export default {
  data() {
    return {
      playNotesList: ["G2", "A2", "B2", "C3"],
      tone: "",
      max_tones: 2,
      games: [],
    };
  },
  methods: {
    verify(payload) {
      let game = this.games.find((x) => x.id == payload.id);
      console.log("verify", payload, game);
      this.$set(game, "resolve", payload.result);
      // this.$set(item, "value", ev)
    },
    removeNoteList(note) {
      this.playNotesList = this.playNotesList.filter((x) => x != note);
    },
    deleteItem(guid) {
      this.games = this.games.filter((x) => x.id != guid);
    },
    playNote() {
      let audio = new Audio(`/notes/${notes_map["G2"]}.mp3`); // G2
      audio.play();
    },
    play() {
      let game = { notes: [], resolve: 0, id: this.uuidv4() };
      let NoteList = Object.assign([], this.playNotesList);
      let n = 0;
      while (n < this.max_tones) {
        let note = NoteList.splice(
          Math.floor(Math.random() * NoteList.length),
          1
        );
        n++;
        game.notes.push(note[0]);
      }

      this.games.unshift(game);
    },
    addPlayNoteList() {
      this.tone = this.tone.trim();
      if (this.tone != "") {
        this.playNotesList.push(this.tone.toUpperCase());
        this.tone = "";
      }
    },
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Ear Trainer",
      icon: "ear-hearing",
    });
  },
};
</script>
