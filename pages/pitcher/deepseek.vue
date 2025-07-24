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
      <v-col cols="12" sm="6">
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
    </v-row>

    <div
      ref="scrollContainer"
      style="
        width: 920px;
        height: 500px;
        margin: 20px auto 0;
        border: 1px solid #ccc;
        background-color: black;
      "
    >
      <canvas
        ref="histogram"
        width="900"
        height="500"
        style="display: block; margin: auto; background-color: black"
      ></canvas>
    </div>
  </v-container>
</template>

<script>
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
const MAX_HISTORY = 700;
const A4_FREQ = 440;
const A4_MIDI = 69;

export default {
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
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.buffer = new Float32Array(2048);
    this.drawNoteLines();
  },
  methods: {
    freqToMidi(freq) {
      return A4_MIDI + 12 * Math.log2(freq / A4_FREQ);
    },
    getNoteName(midiNote) {
      return NOTE_SHORT_STRINGS[midiNote % 12];
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
    autoCorrelate(buf, sampleRate) {
      const SIZE = buf.length;
      let rms = 0;
      for (let i = 0; i < SIZE; i++) {
        rms += buf[i] * buf[i];
      }
      rms = Math.sqrt(rms / SIZE);
      const dB_SPL = 20 * Math.log10(rms / 0.00002);
      this.dBDisplay = Math.max(0, dB_SPL).toFixed(1);

      if (dB_SPL < 30 || rms < this.sensitivity) {
        return -1;
      }

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
    async update() {
      if (!this.analyser) return;

      this.analyser.getFloatTimeDomainData(this.buffer);
      const freq = this.autoCorrelate(
        this.buffer,
        this.audioContext.sampleRate
      );

      if (freq !== -1) {
        const midi = this.freqToMidi(freq);
        const note = this.getNoteName(Math.round(midi));
        this.freqDisplay = freq.toFixed(0);
        this.noteDisplay = note;
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
    drawHistogram() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const spacing = (width - 5) / MAX_HISTORY;
      const len = Math.min(this.history.length, MAX_HISTORY);

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
      const currentNoteName = this.getNoteName(Math.round(midi));

      const staticDisplayText = `${currentNoteName} (${freq.toFixed(0)} Hz)`;
      ctx.font = "bold 16px sans-serif";
      const textWidth = ctx.measureText(staticDisplayText).width;

      for (let octaveOffset = -2; octaveOffset <= 4; octaveOffset++) {
        const shiftedFreq = freq * Math.pow(2, octaveOffset);
        const shiftedMidi = this.freqToMidi(shiftedFreq);
        const y = height - (shiftedMidi % 12) * (height / 12);

        const x = width - 45;
        const shiftedNoteName = this.getNoteName(Math.round(shiftedMidi));
        const shiftedNoteIndex = Math.round(shiftedMidi) % 12;

        ctx.fillStyle = COLORS[shiftedNoteIndex];
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = COLORS[shiftedNoteIndex];
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
      const recentFreqs = this.history.slice(0, 2).map((h) => h.freq);

      for (let noteIndex = 0; noteIndex < 12; noteIndex++) {
        const y = height - noteIndex * (height / 12);
        const noteName = NOTE_SHORT_STRINGS[noteIndex];
        const isNearby = recentFreqs.some((f) => {
          if (!f) return false;
          const midi = this.freqToMidi(f);
          return Math.round(midi) % 12 === noteIndex;
        });

        ctx.font = isNearby ? "18px sans-serif" : "16px sans-serif";
        ctx.lineWidth = isNearby ? 3 : 1.5;
        ctx.strokeStyle = isNearby ? COLORS[noteIndex] : "#555";
        ctx.fillStyle = isNearby ? COLORS[noteIndex] : "white";

        ctx.beginPath();
        ctx.moveTo(5, y);
        ctx.lineTo(width - 45, y);
        ctx.stroke();

        ctx.fillText(noteName, width - 40, y + 3);
      }
    },
    drawHistoryPoints(i, freq, midi, spacing) {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;

      const noteIndex = Math.round(midi) % 12;
      const baseFreq = freq;

      for (let octaveOffset = -2; octaveOffset <= 4; octaveOffset++) {
        const shiftedFreq = baseFreq * Math.pow(2, octaveOffset);
        const shiftedMidi = this.freqToMidi(shiftedFreq);
        const y = height - (shiftedMidi % 12) * (height / 12);

        const x = width - i * spacing - 45;
        const shiftedNoteIndex = Math.round(shiftedMidi) % 12;

        ctx.fillStyle = COLORS[shiftedNoteIndex];
        ctx.beginPath();
        ctx.arc(x, y, 1.3, 0, 2 * Math.PI);
        ctx.fill();
      }
    },
  },
  beforeUnmount() {
    if (this.isMicActive) {
      this.cleanup();
    }
  },
};
</script>

<style scoped>
h4 {
  font-weight: 600;
}
</style>
