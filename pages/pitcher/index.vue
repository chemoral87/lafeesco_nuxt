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
        ></v-slider>
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
        ></v-select>
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
// Import Tone.js
import * as Tone from "tone";

const NOTE_STRINGS = [
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
];
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
  "#FF2E2E", // Do - Rojo brillante/neón
  "#FF6F00", // Do♯/Re♭ - Naranja neón brillante
  "#FFD800", // Re - Amarillo neón intenso
  "#BFFF00", // Re♯/Mi♭ - Amarillo verdoso brillante
  "#00FF00", // Mi - Verde neón
  "#00FFD7", // Fa - Verde azulado neón brillante
  "#00BFFF", // Fa♯/Sol♭ - Azul celeste brillante
  "#1E90FF", // Sol - Azul neón brillante
  "#7B00FF", // Sol♯/La♭ - Índigo neón
  "#BB00FF", // La - Violeta neón brillante
  "#FF00AA", // La♯/Si♭ - Rosa fuerte/neón
  "#FF1493", // Si - Rosa intenso/neón
];
const COLORSs = [
  "#FF0000", // Do (Rojo)
  "#FF7F00", // Do♯/Re♭ (Naranja)
  "#FFFF00", // Re (Amarillo)
  "#BFFF00", // Re♯/Mi♭ (Amarillo verdoso)
  "#00FF00", // Mi (Verde)
  "#00FF7F", // Fa (Verde azulado)
  "#00BFFF", // Fa♯/Sol♭ (Azul claro)
  "#0000FF", // Sol (Azul)
  "#4B0082", // Sol♯/La♭ (Índigo)
  "#8B00FF", // La (Violeta)
  "#C71585", // La♯/Si♭ (Violeta rosado)
  "#FF1493", // Si (Rosa intenso)
];
const COLORSx = [
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
const TEXT_WIDTH = 40;
const MAX_HISTORY = 1500;
const TOLERANCE_HZ = 1.77;
const MIN_RMS = 0.000001;
const A4_FREQ = 440;
const A4_MIDI = 69;

export default {
  name: "NoteDetector",
  data() {
    return {
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
      sensitivity: 0.005,
      selectedRootNote: "C",
      noteOptions: NOTE_SHORT_STRINGS,
      hasScrolledToFirst: false,
      toneSynth: null,
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;

    this.buffer = new Float32Array(2048);
    this.populateNoteSelector();
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
    aWeightingCorrection(freq) {
      const f2 = freq * freq;
      const num = f2 * f2 * 12200 ** 2;
      const den =
        (f2 + 20.6 ** 2) *
        Math.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2)) *
        (f2 + 12200 ** 2);
      return 20 * Math.log10(num / den);
    },
    getAWeightedDb(rms, freq) {
      const adjustedRMS = Math.max(rms, MIN_RMS);
      let dB = 20 * Math.log10(adjustedRMS);
      if (freq !== -1 && freq >= 40 && freq <= 20000) {
        dB += this.aWeightingCorrection(freq);
      }
      return dB + 110; // empirical adjustment
    },
    resetHistory() {
      this.history = [];
      this.ctx.clearRect(
        0,
        0,
        this.$refs.histogram.width,
        this.$refs.histogram.height
      );
      this.drawNoteLines();
    },
    autoCorrelate(buf, sampleRate) {
      const SIZE = buf.length;
      let rms = 0;

      for (let i = 0; i < SIZE; i++) {
        rms += buf[i] * buf[i];
      }
      rms = Math.sqrt(rms / SIZE);
      if (rms < this.sensitivity) return -1;

      let r1 = 0,
        r2 = SIZE - 1,
        thres = 0.2;
      for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buf[i]) < thres) {
          r1 = i;
          break;
        }
      }
      for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buf[SIZE - i]) < thres) {
          r2 = SIZE - i;
          break;
        }
      }

      const newSize = r2 - r1;
      if (newSize <= 0) return -1;

      if (this.correlationArray.length < newSize) {
        this.correlationArray = new Array(newSize);
      }
      this.correlationArray.fill(0);

      for (let i = 0; i < newSize; i++) {
        const offset = r1 + i;
        let sum = 0;
        for (let j = 0; j < newSize - i; j++) {
          sum += buf[r1 + j] * buf[offset + j];
        }
        this.correlationArray[i] = sum;
      }

      let d = 0;
      while (this.correlationArray[d] > this.correlationArray[d + 1]) d++;

      let maxval = -1,
        maxpos = -1;
      for (let i = d; i < newSize; i++) {
        if (this.correlationArray[i] > maxval) {
          maxval = this.correlationArray[i];
          maxpos = i;
        }
      }

      return maxpos > 0 ? sampleRate / maxpos : -1;
    },
    drawNoteLines() {
      const scaleNoteIndices = this.selectedRootNote
        ? this.getMajorScaleNotes(this.selectedRootNote)
        : [];
      const recentFrequencies = this.history.slice(0, 2).map((h) => h.freq);

      this.ctx.font = "16px sans-serif";

      for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi++) {
        const y =
          this.$refs.histogram.height -
          ((midi - MIN_MIDI) / TOTAL_NOTES) * this.$refs.histogram.height;
        const noteName = this.getNoteName(midi);
        const noteIndex = midi % 12;
        const freq = this.midiToFreq(midi);

        const isRecentNearby = recentFrequencies.some(
          (recentFreq) => Math.abs(recentFreq - freq) <= TOLERANCE_HZ
        );
        const isInScale =
          this.selectedRootNote && scaleNoteIndices.includes(noteIndex);

        if (isRecentNearby && isInScale) {
          this.ctx.strokeStyle = "red";
          this.ctx.fillStyle = "red";
          this.ctx.lineWidth = 3;
        } else if (this.selectedRootNote && isInScale) {
          this.ctx.strokeStyle = "#aaa";
          this.ctx.fillStyle = "white";
          this.ctx.lineWidth = 2.5;
        } else {
          this.ctx.strokeStyle = "#555";
          this.ctx.fillStyle = "white";
          this.ctx.lineWidth = 1.5;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(5, y);
        this.ctx.lineTo(this.$refs.histogram.width - TEXT_WIDTH - 3, y);
        this.ctx.stroke();
        this.ctx.fillText(
          noteName,
          this.$refs.histogram.width - TEXT_WIDTH,
          y + 3
        );
      }
    },
    drawHistogram() {
      this.ctx.clearRect(
        0,
        0,
        this.$refs.histogram.width,
        this.$refs.histogram.height
      );
      this.drawNoteLines();

      const pointSpacing = (this.$refs.histogram.width - 5) / MAX_HISTORY;
      const historyLength = Math.min(this.history.length, MAX_HISTORY);

      for (let i = 0; i < historyLength; i++) {
        const { freq, midi } = this.history[i];
        if (!freq || freq < 20 || freq > 2000) continue;

        const y =
          this.$refs.histogram.height -
          ((midi - MIN_MIDI) / TOTAL_NOTES) * this.$refs.histogram.height;
        const x =
          this.$refs.histogram.width - i * pointSpacing - TEXT_WIDTH - 5;

        this.ctx.fillStyle = i < 2 ? "white" : COLORS[Math.round(midi) % 12];
        this.ctx.beginPath();
        this.ctx.arc(x, y, i < 2 ? 2 : 1.3, 0, Math.PI * 2);
        this.ctx.fill();

        if (i < 1) {
          this.ctx.fillStyle = "white";
          this.ctx.font = "12px sans-serif";
          this.ctx.fillText(freq.toFixed(0) + "Hz", x - 30, y - 10);
        }
      }
    },
    async update() {
      if (!this.analyser) return;

      this.analyser.getFloatTimeDomainData(this.buffer);
      const freq = this.autoCorrelate(
        this.buffer,
        this.audioContext.sampleRate
      );

      if (freq !== -1) {
        const rms = Math.sqrt(
          this.buffer.reduce((sum, val) => sum + val * val, 0) /
            this.buffer.length
        );
        const dB = Math.round(this.getAWeightedDb(rms, freq));
        const midi = this.freqToMidi(freq.toFixed(1));
        const note = this.getNoteName(Math.round(midi));

        this.freqDisplay = freq.toFixed(0);
        this.noteDisplay = note;
        this.dBDisplay = dB;

        // Agregar nota al historial
        this.history.unshift({ freq, midi });
        if (this.history.length > MAX_HISTORY) this.history.pop();

        this.drawHistogram();

        // Reproducir nota con Tone.js (puedes ajustar la octava o duración)
        if (this.toneSynth && !this.toneSynth.isPlaying) {
          const toneNote = note.replace("♯", "#"); // Formato compatible con Tone.js
          this.toneSynth.triggerAttackRelease(toneNote + "4", "8n");
        }

        const y =
          this.$refs.histogram.height -
          ((midi - MIN_MIDI) / TOTAL_NOTES) * this.$refs.histogram.height;

        // if (!this.hasScrolledToFirst) {
        //   this.$refs.scrollContainer.scrollTo({
        //     top: y - this.$refs.scrollContainer.clientHeight / 2,
        //     behavior: "auto",
        //   });
        //   this.hasScrolledToFirst = true;
        // } else {
        //   this.$refs.scrollContainer.scrollTo({
        //     top: y - this.$refs.scrollContainer.clientHeight / 5,
        //     behavior: "smooth",
        //   });
        // }
      } else {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        this.dBDisplay = "--";
      }

      if (this.isMicActive) {
        requestAnimationFrame(this.update);
      }
    },
    populateNoteSelector() {
      // Ya está manejado con v-select, no hace falta
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

          // Crear sintetizador Tone.js
          this.toneSynth = new Tone.Synth().toDestination();

          this.drawNoteLines();
          this.hasScrolledToFirst = false;
          this.isMicActive = true;
          this.update();
        } catch (e) {
          alert("Error accediendo al micrófono: " + e);
        }
      } else {
        // Parar audio y mic
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
        }
        if (this.audioContext && this.audioContext.state !== "closed") {
          await this.audioContext.close();
        }
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

        if (this.toneSynth) {
          this.toneSynth.dispose();
          this.toneSynth = null;
        }
      }
    },
  },
  watch: {
    sensitivity() {
      // Cuando cambia sensibilidad, limpiar historial
      this.resetHistory();
    },
    selectedRootNote() {
      this.drawHistogram();
    },
  },
};
</script>

<style scoped>
/* Puedes ajustar estilos adicionales aquí */
</style>
