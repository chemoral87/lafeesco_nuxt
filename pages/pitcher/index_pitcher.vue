<template>
  <v-container class="pa-4" style="max-width: 1000px">
    <h4 class="text-center mb-4">Detección de Nota Musical</h4>

    <div class="text-center mb-3">
      <span
        >Frecuencia: <strong>{{ freqDisplay }}</strong> Hz</span
      >
      |
      <span
        >Nota: <strong>{{ noteDisplay }}</strong> ({{ dBDisplay }} dB)</span
      >
    </div>

    <v-row justify="center" class="mb-4" align="center" dense>
      <v-btn @click="resetHistory" color="primary" class="mr-3"
        >Reiniciar</v-btn
      >
      <v-btn @click="toggleMic" :color="isMicActive ? 'error' : 'success'">
        {{ isMicActive ? "Desactivar micrófono" : "Activar micrófono" }}
      </v-btn>
    </v-row>

    <v-row align="center" justify="center" dense>
      <v-col cols="12" sm="6" md="4">
        <v-slider
          v-model="sensitivity"
          :min="0.001"
          :max="0.02"
          :step="0.001"
          label="Sensibilidad (RMS mínima)"
          hide-details
          thumb-label
        />
        <div class="text-center font-weight-bold">
          {{ sensitivity.toFixed(3) }}
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-select
          :items="noteOptions"
          v-model="selectedRootNote"
          label="Selecciona una nota"
          dense
          outlined
        />
      </v-col>
    </v-row>

    <div
      ref="scrollContainer"
      style="
        width: 920px;
        height: 600px;
        margin: 20px auto 0;
        border: 1px solid #ccc;
        overflow-y: auto;
        scroll-behavior: smooth;
        background-color: black;
      "
    >
      <canvas
        ref="histogram"
        width="900"
        height="1000"
        style="display: block; margin: auto; background-color: black"
      ></canvas>
    </div>
  </v-container>
</template>

<script>
import { YIN } from "pitchfinder";

const NOTE_SHORT_STRINGS = [
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
];
const COLORS = [
  "#FF0000",
  "#FF4000",
  "#FF8000",
  "#FFBF00",
  "#FFFF00",
  "#80FF00",
  "#00FF00",
  "#00FFFF",
  "#00BFFF",
  "#0000FF",
  "#4000FF",
  "#8000FF",
];
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];

const MIN_MIDI = 40;
const MAX_MIDI = 84;
const TOTAL_NOTES = MAX_MIDI - MIN_MIDI;
const MAX_HISTORY = 700;
const TOLERANCE_HZ = 1.95;
const A4_FREQ = 440;
const A4_MIDI = 69;
const TEXT_WIDTH = 40;

export default {
  data() {
    return {
      isMicActive: false,
      mediaStream: null,
      audioContext: null,
      analyser: null,
      buffer: null,
      history: [],
      pitchDetector: null,
      freqDisplay: "--",
      noteDisplay: "--",
      dBDisplay: "--",
      sensitivity: 0.005,
      selectedRootNote: "C",
      noteOptions: NOTE_SHORT_STRINGS,
      hasScrolledToFirst: false,
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.buffer = new Float32Array(2048);
    this.drawNoteLines();
  },
  methods: {
    midiToFreq(midi) {
      return A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12);
    },
    freqToMidi(freq) {
      return A4_MIDI + 12 * Math.log2(freq / A4_FREQ);
    },
    getNoteName(midiNote) {
      return NOTE_SHORT_STRINGS[midiNote % 12] + Math.floor(midiNote / 12 - 1);
    },
    getMajorScaleNotes(root) {
      const rootIndex = NOTE_SHORT_STRINGS.indexOf(root);
      return MAJOR_STEPS.map((step) => (rootIndex + step) % 12);
    },
    resetHistory() {
      this.history = [];
      const canvas = this.$refs.histogram;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawNoteLines();
    },
    drawNoteLines() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const scaleNoteIndices = this.getMajorScaleNotes(this.selectedRootNote);
      const recentFreqs = this.history.slice(0, 2).map((h) => h.freq);

      ctx.clearRect(0, 0, width, height);

      for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi++) {
        const y = height - ((midi - MIN_MIDI) / TOTAL_NOTES) * height;
        const noteName = this.getNoteName(midi);
        const noteIndex = midi % 12;
        const freq = this.midiToFreq(midi);

        const isNearby = recentFreqs.some(
          (f) => Math.abs(f - freq) <= TOLERANCE_HZ
        );
        const isInScale = scaleNoteIndices.includes(noteIndex);

        ctx.font =
          isNearby && isInScale ? "18px sans-serif" : "16px sans-serif";
        ctx.lineWidth = isNearby ? 3 : isInScale ? 2.5 : 1.5;
        ctx.strokeStyle = isNearby
          ? isInScale
            ? "red"
            : "#ADD8E6"
          : isInScale
          ? "#aaa"
          : "#555";
        ctx.fillStyle = isNearby && isInScale ? "red" : "white";

        ctx.beginPath();
        ctx.moveTo(5, y);
        ctx.lineTo(width - TEXT_WIDTH - 3, y);
        ctx.stroke();
        ctx.fillText(noteName, width - TEXT_WIDTH, y + 3);
      }
    },
    drawHistogram() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const spacing = (width - 5) / MAX_HISTORY;
      const len = Math.min(this.history.length, MAX_HISTORY);

      ctx.clearRect(0, 0, width, height);
      this.drawNoteLines();

      for (let i = 0; i < len; i++) {
        const { freq, midi } = this.history[i];
        if (!freq || freq < 20 || freq > 2000) continue;

        const y = height - ((midi - MIN_MIDI) / TOTAL_NOTES) * height;
        const x = width - i * spacing - TEXT_WIDTH - 5;

        ctx.fillStyle = i < 2 ? "white" : COLORS[Math.round(midi) % 12];
        ctx.beginPath();
        ctx.arc(x, y, i < 2 ? 2 : 1.3, 0, 2 * Math.PI);
        ctx.fill();

        if (i === 0) {
          ctx.fillStyle = "white";
          ctx.font = "12px sans-serif";
          ctx.fillText(freq.toFixed(0) + "Hz", x - 30, y - 10);
        }
      }
    },
    async update() {
      if (!this.analyser) return;
      this.analyser.getFloatTimeDomainData(this.buffer);

      // Usar pitchfinder para detectar pitch
      const freq = this.pitchDetector(this.buffer);

      if (freq && freq >= 20 && freq <= 2000) {
        const midi = this.freqToMidi(freq);
        const note = this.getNoteName(Math.round(midi));

        this.freqDisplay = freq.toFixed(0);
        this.noteDisplay = note;
        this.dBDisplay = "-";

        this.history.unshift({ freq, midi });
        if (this.history.length > MAX_HISTORY) this.history.pop();
        this.drawHistogram();
      } else {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        this.dBDisplay = "--";
      }

      if (this.isMicActive) requestAnimationFrame(this.update);
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

          this.pitchDetector = YIN({
            sampleRate: this.audioContext.sampleRate,
            threshold: 0.01,
          });

          this.hasScrolledToFirst = false;
          this.isMicActive = true;
          this.drawNoteLines();
          this.update();
        } catch (e) {
          alert("Error accediendo al micrófono: " + e.message);
        }
      } else {
        if (this.mediaStream)
          this.mediaStream.getTracks().forEach((t) => t.stop());
        if (this.audioContext && this.audioContext.state !== "closed")
          await this.audioContext.close();

        this.isMicActive = false;
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        this.dBDisplay = "--";
        this.history = [];
        this.ctx.clearRect(
          0,
          0,
          this.$refs.histogram.width,
          this.$refs.histogram.height
        );
        this.drawNoteLines();
      }
    },
  },
  watch: {
    selectedRootNote() {
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
