<template>
  <v-container class="pa-4" style="max-width: 1000px">
    <h4 class="text-center mb-4">Detección de Nota Musical</h4>

    <div class="text-center mb-3">
      <span
        >Frecuencia: <strong>{{ freqDisplay }}</strong> Hz</span
      >
      |
      <span>
        Nota: <strong>{{ noteDisplay }}</strong>
        <span v-if="isNoteInScale"> (Escala)</span>
        ({{ dBDisplay }} dB)
      </span>
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
        height: 500px;
        margin: 20px auto 0;
        border: 1px solid #ccc;

        background-color: black;
      "
    >
      <canvas
        ref="histogram"
        width="900"
        height="700"
        style="display: block; margin: auto; background-color: black"
      ></canvas>
    </div>
  </v-container>
</template>

<script>
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
const MIN_MIDI = 47;
const MAX_MIDI = 61;
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
      correlationArray: [],
      freqDisplay: "--",
      noteDisplay: "--",
      dBDisplay: "--",
      sensitivity: 0.005,
      selectedRootNote: "C",
      noteOptions: [
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
      ],
      hasScrolledToFirst: false,
      lastFreq: null,
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.buffer = new Float32Array(2048);
    this.drawNoteLines();
  },
  computed: {
    isNoteInScale() {
      const note = this.noteDisplay.replace(/[0-9+]/g, "");
      const noteIndex = this.noteOptions.indexOf(note);
      return this.getMajorScaleNotes(this.selectedRootNote).includes(noteIndex);
    },
  },
  methods: {
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
      const note = isHalfStep
        ? NOTE_SHORT_STRINGS[noteIndex * 2 + 1]
        : NOTE_SHORT_STRINGS[noteIndex * 2];
      const octave = Math.floor(roundedMidi / 12 - 1);
      return `${note}${octave}`;
    },
    getNoteName(midiNote) {
      const noteIndex = Math.floor(midiNote) % 12;
      const isHalfStep = Math.round(midiNote * 2) % 2 === 1;
      return isHalfStep
        ? NOTE_SHORT_STRINGS[noteIndex * 2 + 1]
        : NOTE_SHORT_STRINGS[noteIndex * 2];
    },
    getMajorScaleNotes(root) {
      const rootIndex = this.noteOptions.indexOf(root);
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
    lightenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = ((num >> 8) & 0x00ff) + amt;
      const B = (num & 0x0000ff) + amt;
      return (
        "#" +
        (
          0x1000000 +
          (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
          (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
          (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
          .toString(16)
          .slice(1)
      );
    },
    maybeAutoScroll(y) {
      const container = this.$refs.scrollContainer;
      const canvasHeight = this.$refs.histogram.height;
      const zoneTop = canvasHeight / 9;
      const zoneBottom = (canvasHeight * 8) / 9;
      if (y < zoneTop || y > zoneBottom) {
        container.scrollTop = y - container.clientHeight / 2;
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

          this.hasScrolledToFirst = false;
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
      let maxSample = 0;

      for (let i = 0; i < SIZE; i++) {
        const val = buf[i];
        rms += val * val;
        if (Math.abs(val) > maxSample) {
          maxSample = Math.abs(val);
        }
      }
      rms = Math.sqrt(rms / SIZE);
      const dB_SPL = 20 * Math.log10(rms / 0.00002);
      this.dBDisplay = Math.max(0, dB_SPL).toFixed(1);

      if (dB_SPL < 30 || rms < this.sensitivity || maxSample < 0.01) {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        return -1;
      }

      let r1 = 0,
        r2 = SIZE - 1;
      const threshold = maxSample * 0.2;
      for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buf[i]) > threshold) {
          r1 = Math.max(0, i - 10);
          break;
        }
      }
      for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buf[SIZE - i]) > threshold) {
          r2 = Math.min(SIZE - 1, SIZE - i + 10);
          break;
        }
      }

      const newSize = r2 - r1;
      if (newSize <= 0) return -1;

      if (this.correlationArray.length < newSize)
        this.correlationArray = new Array(newSize);
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

      let freq = maxpos > 0 ? sampleRate / maxpos : -1;

      // Corrección de octava para evitar mostrar armónicos como fundamentales
      if (freq < 100) {
        const possibleFreq = freq * 2;
        const midi = this.freqToMidi(possibleFreq);
        if (midi >= 40) {
          // Solo corregir si es una nota musical válida
          freq = possibleFreq;
        }
      }

      return freq > 20 && freq < 2000 ? freq : -1;
    },
    smoothFrequency(currentFreq) {
      if (!this.lastFreq) {
        this.lastFreq = currentFreq;
        return currentFreq;
      }

      const smoothingFactor = 0.3;
      const smoothed =
        this.lastFreq * (1 - smoothingFactor) + currentFreq * smoothingFactor;
      this.lastFreq = smoothed;
      return smoothed;
    },
    async update() {
      if (!this.analyser) return;

      this.analyser.getFloatTimeDomainData(this.buffer);
      const rawFreq = this.autoCorrelate(
        this.buffer,
        this.audioContext.sampleRate
      );

      if (rawFreq !== -1) {
        const smoothedFreq = this.smoothFrequency(rawFreq);
        const exactFreq = parseFloat(smoothedFreq.toFixed(1));
        const midi = this.freqToMidi(exactFreq);
        const note = this.getNoteNameNum(midi);

        this.freqDisplay = exactFreq.toString();
        this.noteDisplay = note;

        this.history.unshift({ freq: exactFreq, midi });
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
      const scaleNoteIndices = this.getMajorScaleNotes(this.selectedRootNote);

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
          this.drawHistoryPoints(i, freq, midi, spacing, scaleNoteIndices);
        }
        return;
      }

      const { freq, midi } = currentData;
      const currentNoteName = this.getNoteNameNum(Math.round(midi * 2) / 2);
      const currentNoteBase = currentNoteName.replace(/[0-9+]/g, "");
      const currentNoteIndex = Math.round(midi) % 12;
      const isCurrentInScale = scaleNoteIndices.includes(currentNoteIndex);

      const staticDisplayText = `${currentNoteName} (${this.freqDisplay} Hz)`;
      ctx.font = "bold 16px sans-serif";
      const textWidth = ctx.measureText(staticDisplayText).width;

      for (let octaveOffset = -2; octaveOffset <= 4; octaveOffset++) {
        const shiftedFreq = freq * Math.pow(2, octaveOffset);
        const shiftedMidi = this.freqToMidi(shiftedFreq);
        const y = height - ((shiftedMidi - MIN_MIDI) / TOTAL_NOTES) * height;
        if (y < 0 || y > height) continue;

        const x = width - TEXT_WIDTH - 5;
        const shiftedNoteName = this.getNoteName(
          Math.round(shiftedMidi * 2) / 2
        );
        const shiftedNoteBase = shiftedNoteName.replace(/[0-9+]/g, "");
        const isSameNoteFamily = shiftedNoteBase === currentNoteBase;
        const shiftedNoteIndex = Math.round(shiftedMidi) % 12;

        let pointColor, textColor;
        if (isSameNoteFamily) {
          pointColor = textColor = "white";
        } else {
          pointColor = textColor = COLORS[shiftedNoteIndex];
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
        this.drawHistoryPoints(i, freq, midi, spacing, scaleNoteIndices);
      }
    },
    drawNoteLines() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const scaleNoteIndices = this.getMajorScaleNotes(this.selectedRootNote);
      const recentFreqs = this.history.slice(0, 2).map((h) => h.freq);

      let currentNote = "";
      let currentNoteType = "";
      let currentFreq = 0;
      if (recentFreqs.length > 0 && recentFreqs[0]) {
        currentFreq = recentFreqs[0];
        const currentMidi = this.freqToMidi(currentFreq);
        const roundedMidi = Math.round(currentMidi * 2) / 2;
        currentNoteType = roundedMidi % 1 === 0.5 ? "halfstep" : "natural";
        currentNote = this.getNoteName(roundedMidi);
      }

      for (let i = 0; i <= (MAX_MIDI - MIN_MIDI) * 2; i++) {
        const y = height - (i / (TOTAL_NOTES * 2)) * height;
        const midi = MIN_MIDI + i / 2;
        const noteIndex = Math.floor(midi) % 12;
        const isHalfStep = i % 2 === 1;
        const noteName = isHalfStep
          ? NOTE_SHORT_STRINGS[noteIndex * 2 + 1]
          : NOTE_SHORT_STRINGS[noteIndex * 2];
        const noteBase = noteName.replace(/\+/g, "");
        const freq = this.midiToFreq(midi);

        const freqDistance = currentFreq
          ? Math.abs(currentFreq - freq)
          : Infinity;
        const isExactNote = freqDistance <= TOLERANCE_HZ / 2;
        const isSameNoteType =
          currentNote &&
          ((isHalfStep && currentNoteType === "halfstep") ||
            (!isHalfStep && currentNoteType === "natural"));
        const isSameNoteFamily =
          currentNote && noteBase === currentNote.replace(/\+/g, "");

        if (isSameNoteFamily && isSameNoteType) {
          if (isHalfStep) {
            ctx.strokeStyle = "#FFEE99";
            ctx.fillStyle = "#FFEE99";
          } else {
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
          }
          ctx.lineWidth = isExactNote ? 2.5 : 2;
        } else if (isHalfStep) {
          ctx.strokeStyle = "#888";
          ctx.fillStyle = "#888";
          ctx.lineWidth = 1;
        } else {
          ctx.strokeStyle = "#555";
          ctx.fillStyle = "#aaa";
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(5, y);
        ctx.lineTo(width - TEXT_WIDTH - 3, y);
        ctx.stroke();

        const isActive = isSameNoteFamily && isSameNoteType;
        if (isHalfStep) {
          ctx.font = isActive ? "bold 11px sans-serif" : "10px sans-serif";
          ctx.fillText(noteName, width - TEXT_WIDTH + 15, y + 3);
        } else {
          ctx.font = isActive ? "bold 13px sans-serif" : "12px sans-serif";
          ctx.fillText(noteName, width - TEXT_WIDTH, y + 3);
        }
      }

      ctx.strokeStyle = "#444";
      ctx.beginPath();
      ctx.moveTo(width - TEXT_WIDTH - 5, 0);
      ctx.lineTo(width - TEXT_WIDTH - 5, height);
      ctx.stroke();
    },
    drawHistoryPoints(i, freq, midi, spacing, scaleNoteIndices) {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;

      const noteIndex = Math.round(midi) % 12;
      const baseFreq = freq;

      for (let octaveOffset = -2; octaveOffset <= 4; octaveOffset++) {
        const shiftedFreq = baseFreq * Math.pow(2, octaveOffset);
        const shiftedMidi = this.freqToMidi(shiftedFreq);
        const y = height - ((shiftedMidi - MIN_MIDI) / TOTAL_NOTES) * height;
        if (y < 0 || y > height) continue;

        const x = width - i * spacing - TEXT_WIDTH - 5;
        const shiftedNoteIndex = Math.round(shiftedMidi) % 12;

        const color = COLORS[shiftedNoteIndex];
        const fadedColor = this.lightenColor(color, 50);

        ctx.fillStyle = fadedColor;
        ctx.beginPath();
        ctx.arc(x, y, 1.7, 0, 3 * Math.PI);
        ctx.fill();
      }
    },
  },
  watch: {
    selectedRootNote() {
      this.drawHistogram();
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
