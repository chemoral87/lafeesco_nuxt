<template>
  <v-container class="pa-4" style="max-width: 1000px">
    <h4 class="text-left mb-4">
      <v-btn icon @click="settingsDialog = true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      Tuner
      <span>
        Frec: <strong>{{ freqDisplay }}</strong> Hz
      </span>
      | <span> ({{ dBDisplay }} dB)</span>
    </h4>

    <div class="text-center mb-3"></div>

    <v-row align="center" justify="center" dense>
      <v-col cols="auto">
        <v-btn @click="resetHistory" color="primary" class="mr-1">
          <v-icon>mdi-restart</v-icon>
          <span class="d-none d-sm-inline">Reiniciar</span>
        </v-btn>
        <v-btn @click="toggleMic" :color="isMicActive ? 'error' : 'success'">
          <v-icon>{{
            isMicActive ? "mdi-microphone-off" : "mdi-microphone"
          }}</v-icon>
          <span class="d-none d-sm-inline">
            {{ isMicActive ? "Silenciar" : "Activar mic" }}
          </span>
        </v-btn>
      </v-col>

      <v-col cols="6" sm="3" md="2">
        <v-select
          :items="currentNoteOptions"
          v-model="selectedRootNote"
          :label="latinNotation ? 'Nota Raíz' : 'Root Note'"
          dense
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" class="px-0 mx-0">
        <canvas
          ref="histogram"
          height="500px"
          :width="canvasWidth + 'px'"
          style="display: block; background-color: black"
        />
      </v-col>
    </v-row>
    <!-- Modal Dialog -->
    <v-dialog v-model="settingsDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Configuración
          <v-spacer></v-spacer>
          <v-btn icon @click="settingsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-switch
                v-model="latinNotation"
                label="Notación latina"
                hide-details
                class="mt-0 pt-0"
              ></v-switch>
            </v-col>
            <v-col cols="12" sm="6">
              <v-slider
                v-model="sensitivity"
                :min="0.001"
                :max="0.01"
                :step="0.002"
                label="Sensibilidad"
                hide-details
                thumb-label
              />
              <div class="text-center font-weight-bold">
                {{ sensitivity.toFixed(3) }}
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <v-slider
                v-model="MAX_HISTORY"
                :min="300"
                :max="800"
                :step="50"
                label="Máx Historial"
                hide-details
                thumb-label
              />
              <div class="text-center font-weight-bold">
                {{ MAX_HISTORY }}
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <v-slider
                v-model="totalNotes"
                :min="13"
                :max="25"
                :step="1"
                label="# Notas"
                hide-details
                thumb-label
              />
              <div class="text-center font-weight-bold">
                {{ totalNotes }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="settingsDialog = false"
            >Cerrar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// Se actualiza la constante COLORS con 24 colores (para cada medio tono)
const COLORS = [
  // C (Do) and intermediates
  "#FF0000", // C (bright red)
  "#FF4000", // C+
  "#FF8000", // C♯ (orange)
  "#FFB000", // C♯+

  // D (Re)
  "#FFD700", // D (gold)
  "#FFE880", // D+
  "#FFFF00", // D♯ (yellow)
  "#FFFF60", // D♯+

  // E (Mi)
  "#E0FF80", // E
  "#A0FF00", // E+

  // F (Fa)
  "#80FF00", // F (lime)
  "#40FF00", // F+
  "#00FF00", // F♯ (green)
  "#00FF80", // F♯+

  // G (Sol)
  "#00FFC0", // G (aqua)
  "#00FFFF", // G+ (cyan)
  "#00BFFF", // G♯ (sky blue)
  "#0080FF", // G♯+

  // A (La) - Now much brighter!
  "#0060FF", // A (bright blue)
  "#0040FF", // A+
  "#7F5AFF", // A♯ (lighter violet-blue) 👈 Replaced #4020FF
  "#A066FF", // A♯+

  // B (Si)
  "#CC00FF", // B (electric purple) 👈 Brighter!
  "#FF00FF", // B+ (magenta)
  "#FF20FF", // Cycle back to red (optional)
];
const COLORS_s = [
  // C (Do) y C+ (intermedio entre C y C♯)
  "#FF0000", // C
  "#FF2000", // C+ (mix: #FF0000 + #FF4000)
  "#FF4000", // C♯ (Do♯)
  "#FF6000", // C♯+ (mix: #FF4000 + #FF8000)
  "#FF8000", // D (Re)
  "#FF9F80", // D+ (mix: #FF8000 + #FFBF00)
  "#FFBF00", // D♯ (Re♯)
  "#FFDF00", // D♯+ (mix: #FFBF00 + #FFFF00)
  "#FFFF00", // E (Mi)
  "#BFFF40", // E+ (mix: #FFFF00 + #80FF00)
  "#80FF00", // F (Fa)
  "#40FF00", // F+ (mix: #80FF00 + #00FF00)
  "#00FF00", // F♯ (Fa♯)
  "#00FF80", // F♯+ (mix: #00FF00 + #00FFFF)
  "#00FFFF", // G (Sol)
  "#00A0FF", // G+ (mix: #00FFFF + #00BFFF)
  "#00BFFF", // G♯ (Sol♯)
  "#0060FF", // G♯+ (mix: #00BFFF + #0000FF)
  "#0000FF", // A (La)
  "#2000FF", // A+ (mix: #0000FF + #4000FF)
  "#4000FF", // A♯ (La♯)
  "#6000FF", // A♯+ (mix: #4000FF + #8000FF)
  "#8000FF", // B (Si)
  "#A000FF", // B+ (mix: #8000FF + #FF0000 - ciclo)
];

const NOTE_SHORT_STRINGS = [
  "C",
  "C+",
  "C♯",
  "C♯+",
  "D",
  "D+",
  "D♯",
  "D♯+",
  "E",
  "E+",
  "F",
  "F+",
  "F♯",
  "F♯+",
  "G",
  "G+",
  "G♯",
  "G♯+",
  "A",
  "A+",
  "A♯",
  "A♯+",
  "B",
  "B+",
];

const NOTE_LATIN_STRINGS = [
  "Do",
  "Do+",
  "Do♯",
  "Do♯+",
  "Re",
  "Re+",
  "Re♯",
  "Re♯+",
  "Mi",
  "Mi+",
  "Fa",
  "Fa+",
  "Fa♯",
  "Fa♯+",
  "Sol",
  "Sol+",
  "Sol♯",
  "Sol♯+",
  "La",
  "La+",
  "La♯",
  "La♯+",
  "Si",
  "Si+",
];

const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
const MIN_MIDI = 47;
//const MAX_MIDI = 61;
//const TOTAL_NOTES = this.totalNotes;
//const MAX_HISTORY = 400;
const TOLERANCE_HZ = 1.95;
const A4_FREQ = 440;
const A4_MIDI = 69;
const TEXT_WIDTH = 40;

export default {
  data() {
    return {
      settingsDialog: false,
      canvasWidth: 350,
      isMicActive: false,
      mediaStream: null,
      audioContext: null,
      analyser: null,
      buffer: null,
      history: [],
      correlationArray: [],
      freqDisplay: "--",
      noteDisplay: "--",
      dBDisplay: "--",

      lastFreq: null,
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.buffer = new Float32Array(2048);
    this.updateCanvasSize();
    window.addEventListener("resize", this.updateCanvasSize);
    this.drawHistogram();
  },
  beforeUnmount() {
    if (this.isMicActive) {
      this.cleanup();
    }
    window.removeEventListener("resize", this.updateCanvasSize);
  },
  computed: {
    selectedRootNote: {
      get() {
        return this.$store.state.pitcher_store.selectedRootNote;
      },
      set(value) {
        this.$store.commit("pitcher_store/SET_ROOT_NOTE", value);
      },
    },
    sensitivity: {
      get() {
        return this.$store.state.pitcher_store.sensitivity;
      },
      set(value) {
        this.$store.commit("pitcher_store/SET_SENSITIVITY", value);
      },
    },
    latinNotation: {
      get() {
        return this.$store.state.pitcher_store.latinNotation;
      },
      set(value) {
        this.$store.commit("pitcher_store/SET_LATIN_NOTATION", value);
      },
    },
    MAX_HISTORY: {
      get() {
        return this.$store.state.pitcher_store.maxHistory;
      },
      set(value) {
        this.$store.commit("pitcher_store/SET_MAX_HISTORY", value);
      },
    },
    totalNotes: {
      get() {
        return this.$store.state.pitcher_store.totalNotes;
      },
      set(value) {
        this.$store.commit("pitcher_store/SET_TOTAL_NOTES", value);
      },
    },
    scaleNoteIndices() {
      return this.getMajorScaleNotes(this.selectedRootNote);
    },
    currentNoteOptions() {
      return this.latinNotation
        ? [
            "Do",
            "Do♯",
            "Re",
            "Re♯",
            "Mi",
            "Fa",
            "Fa♯",
            "Sol",
            "Sol♯",
            "La",
            "La♯",
            "Si",
          ]
        : ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
    },
    convertedRootNote() {
      if (this.latinNotation) {
        const angloIndex = [
          "C",
          "C♯",
          "D",
          "D♯",
          "E",
          "F",
          "F♯",
          "G",
          "G♯",
          "A",
          "A♯",
          "B",
        ].indexOf(this.selectedRootNote);
        return angloIndex >= 0
          ? [
              "Do",
              "Do♯",
              "Re",
              "Re♯",
              "Mi",
              "Fa",
              "Fa♯",
              "Sol",
              "Sol♯",
              "La",
              "La♯",
              "Si",
            ][angloIndex]
          : "Do";
      } else {
        const latinIndex = [
          "Do",
          "Do♯",
          "Re",
          "Re♯",
          "Mi",
          "Fa",
          "Fa♯",
          "Sol",
          "Sol♯",
          "La",
          "La♯",
          "Si",
        ].indexOf(this.selectedRootNote);
        return latinIndex >= 0
          ? ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"][
              latinIndex
            ]
          : "C";
      }
    },
  },
  methods: {
    updateCanvasSize() {
      const container = this.$el.querySelector(".v-container");
      if (container) {
        this.canvasWidth = Math.min(container.clientWidth - 32, 1000);
        this.$nextTick(() => {
          this.drawHistogram();
        });
      }
    },
    midiToFreq(midi) {
      return A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12);
    },
    freqToMidi(freq) {
      if (freq <= 0) return 0;
      return 69 + 12 * Math.log2(freq / 440);
    },
    getNoteNameNum(midiNote) {
      const roundedMidi = Math.round(midiNote * 2) / 2;
      const noteIndex = Math.floor(roundedMidi) % 12;
      const isHalfStep = roundedMidi % 1 === 0.5;
      // Para obtener el índice completo dentro de NOTE_SHORT_STRINGS (y COLORS)
      const fullIndex = isHalfStep ? noteIndex * 2 + 1 : noteIndex * 2;
      const noteStrings = this.latinNotation
        ? NOTE_LATIN_STRINGS
        : NOTE_SHORT_STRINGS;
      const note = noteStrings[fullIndex];
      const octave = Math.floor(roundedMidi / 12 - 1);
      return `${note}${octave}`;
    },
    getNoteName(midiNote) {
      const noteIndex = Math.floor(midiNote) % 12;
      const isHalfStep = Math.round(midiNote * 2) % 2 === 1;
      const fullIndex = isHalfStep ? noteIndex * 2 + 1 : noteIndex * 2;
      const noteStrings = this.latinNotation
        ? NOTE_LATIN_STRINGS
        : NOTE_SHORT_STRINGS;
      return noteStrings[fullIndex];
    },
    getMajorScaleNotes(root) {
      // Convertir root a notación anglosajona si está en latín
      const rootIndex = this.latinNotation
        ? [
            "Do",
            "Do♯",
            "Re",
            "Re♯",
            "Mi",
            "Fa",
            "Fa♯",
            "Sol",
            "Sol♯",
            "La",
            "La♯",
            "Si",
          ].indexOf(root)
        : [
            "C",
            "C♯",
            "D",
            "D♯",
            "E",
            "F",
            "F♯",
            "G",
            "G♯",
            "A",
            "A♯",
            "B",
          ].indexOf(root);
      return MAJOR_STEPS.map((step) => (rootIndex + step) % 12);
    },
    resetHistory() {
      this.history = [];
      const canvas = this.$refs.histogram;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawNoteLines();
    },
    async cleanup() {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach((t) => t.stop());
        this.mediaStream = null;
      }
      if (this.audioContext && this.audioContext.state !== "closed") {
        await this.audioContext.close();
        this.audioContext = null;
      }
      this.isMicActive = false;
      this.freqDisplay = "--";
      this.noteDisplay = "--";
      this.dBDisplay = "--";
      this.history = [];
      if (this.ctx && this.$refs.histogram) {
        this.ctx.clearRect(
          0,
          0,
          this.$refs.histogram.width,
          this.$refs.histogram.height
        );
        this.drawNoteLines();
      }
    },
    async toggleMic() {
      if (!this.isMicActive) {
        try {
          this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 2048;
          this.buffer = new Float32Array(this.analyser.fftSize);

          const source = this.audioContext.createMediaStreamSource(
            this.mediaStream
          );
          source.connect(this.analyser);

          this.isMicActive = true;
          this.drawNoteLines();
          this.update();
        } catch (e) {
          alert("Error accediendo al micrófono: " + e.message);
        }
      } else {
        await this.cleanup();
      }
    },
    smoothFrequency(currentFreq) {
      if (!this.lastFreq) {
        this.lastFreq = currentFreq;
        return currentFreq;
      }

      const OCTAVE_THRESHOLD_LOW = 1.8;
      const OCTAVE_THRESHOLD_HIGH = 2.2;
      const HALF_OCTAVE_THRESHOLD_LOW = 0.45;
      const HALF_OCTAVE_THRESHOLD_HIGH = 0.55;

      const ratio = currentFreq / this.lastFreq;

      if (ratio > OCTAVE_THRESHOLD_LOW && ratio < OCTAVE_THRESHOLD_HIGH) {
        currentFreq = (currentFreq + this.lastFreq * 2) * 0.5;
      } else if (
        ratio > HALF_OCTAVE_THRESHOLD_LOW &&
        ratio < HALF_OCTAVE_THRESHOLD_HIGH
      ) {
        currentFreq = (currentFreq + this.lastFreq * 0.5) * 0.5;
      }

      const SMOOTHING_FACTOR = 0.3;
      this.lastFreq =
        this.lastFreq * (1 - SMOOTHING_FACTOR) + currentFreq * SMOOTHING_FACTOR;

      return this.lastFreq;
    },
    autoCorrelate(buf, sampleRate) {
      const SIZE = buf.length;
      const MIN_DB = 30;
      const MIN_SAMPLE_THRESHOLD = 0.01;
      const PEAK_THRESHOLD_FACTOR = 0.2;
      const WINDOW_PADDING = 10;

      let sumSquares = 0;
      let maxSample = 0;

      for (let i = 0; i < SIZE; i++) {
        const sample = buf[i];
        sumSquares += sample * sample;
        if (Math.abs(sample) > maxSample) maxSample = Math.abs(sample);
      }

      const rms = Math.sqrt(sumSquares / SIZE);
      const dB_SPL = 20 * Math.log10(rms / 0.00002);
      this.dBDisplay = Math.max(0, dB_SPL).toFixed(1);

      if (
        dB_SPL < MIN_DB ||
        rms < this.sensitivity ||
        maxSample < MIN_SAMPLE_THRESHOLD
      ) {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        return -1;
      }

      const threshold = maxSample * PEAK_THRESHOLD_FACTOR;
      let start = 0;
      let end = SIZE - 1;

      for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buf[i]) > threshold) {
          start = Math.max(0, i - WINDOW_PADDING);
          break;
        }
      }

      for (let i = SIZE - 1; i > SIZE / 2; i--) {
        if (Math.abs(buf[i]) > threshold) {
          end = Math.min(SIZE - 1, i + WINDOW_PADDING);
          break;
        }
      }

      const windowSize = end - start;
      if (windowSize <= 0) return -1;

      if (!this.correlationArray || this.correlationArray.length < windowSize) {
        this.correlationArray = new Float32Array(windowSize);
      }

      for (let lag = 0; lag < windowSize; lag++) {
        let sum = 0;
        for (let i = 0; i < windowSize - lag; i++) {
          sum += buf[start + i] * buf[start + i + lag];
        }
        this.correlationArray[lag] = sum;
      }

      let dipIndex = 0;
      while (
        dipIndex < windowSize - 1 &&
        this.correlationArray[dipIndex] > this.correlationArray[dipIndex + 1]
      ) {
        dipIndex++;
      }

      let maxVal = -Infinity;
      let peakIndex = -1;
      for (let i = dipIndex; i < windowSize; i++) {
        if (this.correlationArray[i] > maxVal) {
          maxVal = this.correlationArray[i];
          peakIndex = i;
        }
      }

      if (peakIndex <= 0) return -1;

      let freq = sampleRate / peakIndex;

      const checkHarmonic = (divisor, thresholdRatio) => {
        const subIndex = Math.floor(peakIndex / divisor);
        if (subIndex > 0 && subIndex < windowSize) {
          const subVal = this.correlationArray[subIndex];
          if (subVal > thresholdRatio * maxVal) {
            return sampleRate / subIndex;
          }
        }
        return freq;
      };

      if (freq > 0 && freq < 2000) {
        if (freq > 160 && freq < 800) {
          freq = checkHarmonic(2, 0.8);
        } else if (freq > 240 && freq < 1200) {
          freq = checkHarmonic(3, 0.7);
        }
      }

      return freq > 20 && freq < 2000 ? freq : -1;
    },
    async update() {
      if (!this.analyser) return;

      this.analyser.getFloatTimeDomainData(this.buffer);
      const rawFreq = this.autoCorrelate(
        this.buffer,
        this.audioContext.sampleRate
      );

      if (rawFreq !== -1) {
        let correctedFreq = rawFreq;

        if (rawFreq > 180 && rawFreq < 220) {
          const possibleFreq = rawFreq / 2;
          const midi = this.freqToMidi(possibleFreq);
          if (midi >= 48 && midi <= 84) {
            correctedFreq = possibleFreq;
          }
        }

        const smoothedFreq = this.smoothFrequency(correctedFreq);
        const exactFreq = parseFloat(smoothedFreq.toFixed(2));
        const midi = this.freqToMidi(exactFreq);
        const note = this.getNoteNameNum(midi);

        this.freqDisplay = exactFreq.toString();
        this.noteDisplay = note;

        this.history.unshift({ freq: exactFreq, midi });
        if (this.history.length > this.MAX_HISTORY) this.history.pop();
        this.drawHistogram();
      } else {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        this.dBDisplay = "--";
      }

      if (this.isMicActive) requestAnimationFrame(this.update);
    },
    drawHistogram() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const spacing = (width - 50) / this.MAX_HISTORY;
      const len = Math.min(this.history.length, this.MAX_HISTORY);

      ctx.clearRect(0, 0, width, height);
      this.drawNoteLines();

      const currentData = this.history[0];
      if (
        !currentData ||
        !currentData.freq ||
        currentData.freq < 20 ||
        currentData.freq > 2000
      ) {
        for (let i = 1; i < len; i++) {
          const { freq, midi } = this.history[i];
          if (!freq || freq < 20 || freq > 2000) continue;
          this.drawHistoryPoints(i, freq, midi, spacing);
        }
        return;
      }

      const { freq, midi } = currentData;
      const currentNoteName = this.getNoteNameNum(Math.round(midi * 2) / 2);
      const currentNoteBase = currentNoteName.replace(/[0-9+]/g, "");

      const staticDisplayText = `${currentNoteName} (${this.freqDisplay} Hz)`;
      ctx.font = "bold 16px sans-serif";
      const textWidth = ctx.measureText(staticDisplayText).width;

      for (let octaveOffset = -2; octaveOffset <= 4; octaveOffset++) {
        const shiftedFreq = freq * Math.pow(2, octaveOffset);
        const shiftedMidi = this.freqToMidi(shiftedFreq);
        const y =
          height - ((shiftedMidi - MIN_MIDI) / this.totalNotes) * height;
        if (y < 0 || y > height) continue;

        const x = width - TEXT_WIDTH - 5;
        const shiftedNoteName = this.getNoteName(
          Math.round(shiftedMidi * 2) / 2
        );
        const shiftedNoteBase = shiftedNoteName.replace(/[0-9+]/g, "");
        const isSameNoteFamily = shiftedNoteBase === currentNoteBase;
        // Se obtiene el índice completo (0 a 23) usando la resolución de medio tono
        const fullIndex = Math.round(shiftedMidi * 2) % 24;

        let pointColor, textColor;
        if (isSameNoteFamily) {
          pointColor = textColor = "white";
        } else {
          pointColor = textColor = COLORS[fullIndex];
        }

        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = textColor;
        ctx.fillText(staticDisplayText, x - textWidth - 10, y - 5);
      }

      for (let i = 1; i < len; i++) {
        const { freq, midi } = this.history[i];
        if (!freq || freq < 20 || freq > 2000) continue;
        this.drawHistoryPoints(i, freq, midi, spacing);
      }
    },
    drawNoteLines() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const scaleNoteIndices = this.getMajorScaleNotes(this.selectedRootNote);

      let currentNoteInfo = null;
      if (this.history.length > 0 && this.history[0].freq) {
        const currentMidi = this.freqToMidi(this.history[0].freq);
        const roundedMidi = Math.round(currentMidi * 2) / 2;
        currentNoteInfo = {
          type: roundedMidi % 1 === 0.5 ? "halfstep" : "natural",
          name: this.getNoteName(roundedMidi),
          base: this.getNoteName(roundedMidi).replace(/\+/g, ""),
          freq: this.history[0].freq,
        };
      }

      for (let i = 0; i <= this.totalNotes * 2; i++) {
        const y = height - (i / (this.totalNotes * 2)) * height;
        const midi = MIN_MIDI + i / 2;
        const noteIndex = Math.floor(midi) % 12;
        const isHalfStep = i % 2 === 1;
        // Se calcula el índice completo: si es semitono, se usa noteIndex*2+1, de lo contrario noteIndex*2.
        const fullIndex = isHalfStep ? noteIndex * 2 + 1 : noteIndex * 2;
        const noteStrings = this.latinNotation
          ? NOTE_LATIN_STRINGS
          : NOTE_SHORT_STRINGS;
        const noteName = isHalfStep
          ? noteStrings[noteIndex * 2 + 1]
          : noteStrings[noteIndex * 2];
        const noteBase = noteName.replace(/\+/g, "");
        const isInScale = scaleNoteIndices.includes(noteIndex);

        let style = {
          stroke: isHalfStep ? "green" : "gray",
          fill: isHalfStep ? "green" : "gray",
          lineWidth: 1,
        };

        if (currentNoteInfo) {
          const freqDistance = Math.abs(
            currentNoteInfo.freq - this.midiToFreq(midi)
          );
          const isExactNote = freqDistance <= TOLERANCE_HZ / 2;
          const isSameNoteType =
            isHalfStep === (currentNoteInfo.type === "halfstep");
          const isSameNoteFamily = noteBase === currentNoteInfo.base;

          if (isSameNoteFamily && isSameNoteType) {
            if (isHalfStep) {
              style.stroke = style.fill = "yellow";
            } else {
              style.stroke = style.fill = isInScale ? "red" : "orange";
            }
            style.lineWidth = isExactNote ? 2.5 : 2;
          } else if (isInScale && !isHalfStep) {
            style.stroke = style.fill = "white";
          }
        }

        ctx.strokeStyle = style.stroke;
        ctx.fillStyle = style.fill;
        ctx.lineWidth = style.lineWidth;
        ctx.beginPath();
        ctx.moveTo(5, y);
        ctx.lineTo(width - TEXT_WIDTH - 3, y);
        ctx.stroke();

        ctx.font = isHalfStep
          ? `bold ${style.lineWidth > 1 ? 11 : 10}px sans-serif`
          : `bold ${style.lineWidth > 1 ? 13 : 12}px sans-serif`;
        ctx.fillText(
          noteName,
          width - TEXT_WIDTH + (isHalfStep ? 15 : 0),
          y + 3
        );
      }

      ctx.strokeStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(width - TEXT_WIDTH - 5, 0);
      ctx.lineTo(width - TEXT_WIDTH - 5, height);
      ctx.stroke();
    },
    drawHistoryPoints(i, freq, midi, spacing) {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const baseFreq = freq;

      for (let octaveOffset = -2; octaveOffset <= 4; octaveOffset++) {
        const shiftedFreq = baseFreq * Math.pow(2, octaveOffset);
        const shiftedMidi = this.freqToMidi(shiftedFreq);
        const y =
          height - ((shiftedMidi - MIN_MIDI) / this.totalNotes) * height;

        if (y >= 0 && y <= height) {
          const x = width - i * spacing - TEXT_WIDTH - 5;
          // Calcular el índice completo (0–23) a partir del valor midi redondeado a medio tono
          const fullIndex = Math.round(shiftedMidi * 2) % 24;
          ctx.fillStyle = COLORS[fullIndex];
          ctx.beginPath();
          ctx.arc(x, y, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },
  watch: {
    selectedRootNote() {
      if (process.client) {
        localStorage.setItem("selectedRootNote", this.selectedRootNote);
      }
      this.drawHistogram();
    },
    latinNotation(newVal) {
      // Convertir la nota seleccionada al cambiar la notación
      this.selectedRootNote = this.convertedRootNote;
      this.drawHistogram();
    },
  },
};
</script>

<style scoped>
h4 {
  font-weight: 600;
}
</style>
