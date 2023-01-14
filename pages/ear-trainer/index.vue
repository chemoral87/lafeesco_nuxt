<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <EarTrainerNotes
          @remove="removeNoteList($event)"
          :notes="playNotesList"
        ></EarTrainerNotes>
      </v-col>
      <v-col cols="2" sm="1">
        <v-text-field v-model="tone" label="Nota" hide-details></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="addPlayNoteList()" color="primary"> Agregar </v-btn>

        <!-- <v-btn @click="playNote()" color="info"> Test Note </v-btn> -->
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="2" sm="1">
        <v-text-field
          v-model="max_tones"
          label="#Notas"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="play()" color="primary"> Jugar </v-btn>
        {{ marcator }}
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
      playNotesList: ["G3", "A3", "B3", "C4"],
      tone: "",
      max_tones: 2,
      games: [],
    };
  },
  computed: {
    marcator() {
      let goods = this.games.filter((x) => x.resolve === true).length;
      let total_games = this.games.length - 1;
      if (total_games < 0) return "";
      return `Marcador ${goods}/${total_games}`;
    },
  },
  methods: {
    verify(payload) {
      let game = this.games.find((x) => x.id == payload.id);

      this.$set(game, "resolve", payload.result);
      // create new game
      this.play();
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

      let notes = this.getRandomNotes();
      let max_tries = 2;
      let n = 0;
      while (
        n < max_tries &&
        this.games[0] &&
        JSON.stringify(this.games[0].notes) == JSON.stringify(notes)
      ) {
        notes = this.getRandomNotes();
        n++;
      }

      if (this.games[0]) {
        console.log(JSON.parse(JSON.stringify(this.games[0].notes)), notes);
      }
      // if (this.games[0] && this.games[0].notes == notes) {
      //   notes = this.getRandomNotes();
      // }
      // if (this.games[0] && this.games[0].notes == notes) {
      //   notes = this.getRandomNotes();
      // }
      game.notes = notes;

      this.games.unshift(game);
    },
    getRandomNotes() {
      let NoteList = Object.assign([], this.playNotesList);
      let notes = [];
      let n = 0;
      while (n < this.max_tones) {
        let note = NoteList.splice(
          Math.floor(Math.random() * NoteList.length),
          1
        );
        n++;
        notes.push(note[0]);
      }
      console.log(notes);
      return notes;
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
