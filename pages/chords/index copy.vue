<template>
  <v-container fluid class="pa-2">
    <v-row dense>
      <v-col cols="auto">
        <v-select label="Acordes" v-model="selected_chord" :items="chords" item-value="id" item-text="name"> </v-select>
      </v-col>
      <v-col cols="12">
        <v-btn @click="getChords()" color="primary"> Generar </v-btn>
        <template v-if="frequency > 0">{{ frequency | price }} Hz</template>
        {{ note }}

        <!-- {{ last_array_notes }}
        common:
        {{ common_note }} -->
      </v-col>
      <v-col cols="12">
        <v-simple-table>
          <tbody>
            <tr v-for="(chord, ix) in chords_table" :key="ix">
              <td v-for="(not, ixs) in chord" :key="ix + 'x' + ixs" :class="{ 'bg-green-1': not.note == common_note }">
                {{ not.letter }}
              </td>
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
    // this.initi();
    return {
      chords: [
        { id: 1, name: "Acorde Mayor" },
        { id: 2, name: "Acorde Menor" },
        { id: 3, name: "Escala Mayor" },
        { id: 4, name: "Escala Menor" },
        { id: 3, name: "Escala Pentatónica Mayor" },
        { id: 4, name: "Escala Pentatónica Menor" }
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
      selected_chord: 1,
      frequency: 0,
      audioContext: null,
      analyser: null,
      note: "",

      last_array_notes: [],
      max_array_notes: 23
    };
  },
  computed: {
    // get the value in last_array_notes
    common_note() {
      let counts = {};
      if (this.last_array_notes.length == 0) {
        return "";
      }
      this.last_array_notes.forEach(x => {
        counts[x] = (counts[x] || 0) + 1;
      });
      let max = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      return max;
    }
  },
  methods: {
    updateFrequency() {
      requestAnimationFrame(() => this.updateFrequency());
      // this.analyser.getFloatTimeDomainData(new Float32Array(this.analyser.fftSize));
      var bufferLength = this.analyser.fftSize;
      var buffer = new Float32Array(bufferLength);
      this.analyser.getFloatTimeDomainData(buffer);
      const autoCorrelateValue = this.autoCorrelate(buffer, this.audioContext.sampleRate);
      this.frequency = autoCorrelateValue || 0;

      if (this.frequency == -1) {
        this.last_array_notes.push(-1);
      } else {
        let note_ = this.noteFromPitch(this.frequency) % 12;
        this.note = this.notes[note_];
        // FIFO last_array_notes
        this.last_array_notes.push(note_);
      }

      if (this.last_array_notes.length > this.max_array_notes) {
        this.last_array_notes.shift();
      }
    },
    noteFromPitch(frequency) {
      var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
      return Math.round(noteNum) + 69;
    },
    autoCorrelate(buffer, sampleRate) {
      // Perform a quick root-mean-square to see if we have enough signal
      var SIZE = buffer.length;
      var sumOfSquares = 0;
      for (var i = 0; i < SIZE; i++) {
        var val = buffer[i];
        sumOfSquares += val * val;
      }
      var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
      if (rootMeanSquare < 0.01) {
        return -1;
      }

      // Find a range in the buffer where the values are below a given threshold.
      var r1 = 0;
      var r2 = SIZE - 1;
      var threshold = 0.2;

      // Walk up for r1
      for (var i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buffer[i]) < threshold) {
          r1 = i;
          break;
        }
      }

      // Walk down for r2
      for (var i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buffer[SIZE - i]) < threshold) {
          r2 = SIZE - i;
          break;
        }
      }

      // Trim the buffer to these ranges and update SIZE.
      buffer = buffer.slice(r1, r2);
      SIZE = buffer.length;

      // Create a new array of the sums of offsets to do the autocorrelation
      var c = new Array(SIZE).fill(0);
      // For each potential offset, calculate the sum of each buffer value times its offset value
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE - i; j++) {
          c[i] = c[i] + buffer[j] * buffer[j + i];
        }
      }

      // Find the last index where that value is greater than the next one (the dip)
      var d = 0;
      while (c[d] > c[d + 1]) {
        d++;
      }

      // Iterate from that index through the end and find the maximum sum
      var maxValue = -1;
      var maxIndex = -1;
      for (var i = d; i < SIZE; i++) {
        if (c[i] > maxValue) {
          maxValue = c[i];
          maxIndex = i;
        }
      }

      var T0 = maxIndex;

      // Not as sure about this part, don't @ me
      // From the original author:
      // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
      // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
      // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
      var x1 = c[T0 - 1];
      var x2 = c[T0];
      var x3 = c[T0 + 1];

      var a = (x1 + x3 - 2 * x2) / 2;
      var b = (x3 - x1) / 2;
      if (a) {
        T0 = T0 - b / (2 * a);
      }

      return sampleRate / T0;
    },
    getChords() {
      this.audioContext.resume();
      this.chords_table = [];

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
        let a = 0;
        let b = 3;
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
      } else if (this.selected_chord == 3) {
        let a = 0;
        let b = 2;
        let c = 4;
        let d = 5;
        let e = 7;
        let f = 9;
        let g = 11;
        while (a < 12) {
          this.chords_table.push([a, b, c, d, e, f, g]);
          if (a == 11) {
            break;
          }
          a = (a + 1) % 12;
          b = (b + 1) % 12;
          c = (c + 1) % 12;
          d = (d + 1) % 12;
          e = (e + 1) % 12;
          f = (f + 1) % 12;
          g = (g + 1) % 12;
        }
      } else if (this.selected_chord == 4) {
        let a = 0;
        let b = 2;
        let c = 4;
        let d = 7;
        let e = 9;

        while (a < 12) {
          this.chords_table.push([a, b, c, d, e, f, g]);
          if (a == 11) {
            break;
          }
          a = (a + 1) % 12;
          b = (b + 1) % 12;
          c = (c + 1) % 12;
          d = (d + 1) % 12;
          e = (e + 1) % 12;
          f = (f + 1) % 12;
          g = (g + 1) % 12;
        }
      }

      this.chords_table = this.chords_table.map(chord => {
        return chord.map(note => {
          return { letter: this.notes[note], note };
        });
      });
    }
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Acordes",
      icon: "music"
    });
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
  },
  mounted() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const source = this.audioContext.createMediaStreamSource(stream);
        source.connect(this.analyser);
        // source.connect(this.audioContext.destination);
        this.updateFrequency();
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
      });
    // necesarry
    // nexttick
  }
};
</script>
<style scoped>
.bg-green-1 {
  background-color: #4caf50 !important;
}
</style>
