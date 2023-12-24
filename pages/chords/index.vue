<template>
  <v-container fluid class="pa-2">
    <v-row dense>
      <v-col cols="auto">
        <v-select
          label="Acordes"
          v-model="selected_chord"
          :items="chords"
          item-value="id"
          item-text="name"
        >
        </v-select>
      </v-col>
      <v-col cols="12">
        <v-btn @click="getChords()" color="primary"> Generar </v-btn>
      </v-col>
      <v-col cols="12">
        <v-simple-table>
          <tbody>
            <tr v-for="(chord, ix) in chords_table" :key="ix">
              <td v-for="(note, ixs) in chord" :key="ix + 'x' + ixs">{{ note }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <!-- {{ chords_table }} -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    this.initi();
    return {
      chords: [
        { id: 1, name: "Mayor" },
        { id: 2, name: "Menor" }
      ],
      chords_table: [],
      notes: {
        0: "C",
        1: "C# / Db",
        2: "D",
        3: "D# / Eb",
        4: "E",
        5: "F",
        6: "F# / Gb",
        7: "G",
        8: "G# / Ab",
        9: "A",
        10: "A# / Bb",
        11: "B"
      },
      item: {},
      selected_chord: 1
    };
  },
  methods: {
    getChords() {
      this.chords_table = [];
      //   console.log(this.selected_chord);
      if (this.selected_chord == 1) {
        let a = 0;
        let b = 4;
        let c = 7;
        while (a < 12) {
          this.chords_table.push([a, b, c]);
          if (a == 11) {
            break;
          }

          a = (a + 1) % 12;
          b = (b + 1) % 12;
          c = (c + 1) % 12;
        }
      } else if (this.selected_chord == 2) {
        let a = 1;
        let b = 4;
        let c = 8;
        while (a < 12) {
          this.chords_table.push([a, b, c]);
          if (a == 11) {
            break;
          }

          a = (a + 1) % 12;
          b = (b + 1) % 12;
          c = (c + 1) % 12;
        }
      }

      this.chords_table = this.chords_table.map((chord) => {
        return chord.map((note) => {
          return this.notes[note];
        });
      });
    }
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Acordes",
      icon: "music"
    });
  }
};
</script>
