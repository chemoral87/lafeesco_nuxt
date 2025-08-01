<template>
  <v-container class="pa-4" style="max-width: 1000px">
    <h4 class="text-left mb-4">
      Tuner
      <span>
        Frec: <strong>{{ freqDisplay }}</strong> Hz
      </span>
      | <span> ({{ dBDisplay }} dB)</span> {{ history.length }}
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

      <v-col cols="6">
        <v-select
          :items="noteOptions"
          v-model="selectedRootNote"
          label="Escala Mayor"
          dense
          outlined
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="4">
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
    </v-row>
    <v-row dense>
      <v-col cols="12" class="px-0 mx-0">
        <canvas
          ref="histogram"
          height="400px"
          :width="canvasWidth + 'px'"
          style="display: block; background-color: black"
        />
      </v-col>
    </v-row>
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
const MAX_HISTORY = 400;
const TOLERANCE_HZ = 1.95;
const A4_FREQ = 440;
const A4_MIDI = 69;
const TEXT_WIDTH = 40;

export default {
  data() {
    return {
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
      sensitivity: 0.003,
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
      lastFreq: null,
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.buffer = new Float32Array(2048);
    this.updateCanvasSize();
    window.addEventListener("resize", this.updateCanvasSize);
  },
  beforeUnmount() {
    if (this.isMicActive) {
      this.cleanup();
    }
    window.removeEventListener("resize", this.updateCanvasSize);
  },
  computed: {
    scaleNoteIndices() {
      return this.getMajorScaleNotes(this.selectedRootNote);
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

      // Calculate RMS and dB SPL
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

      // Early exit for silent/noisy signals
      if (
        dB_SPL < MIN_DB ||
        rms < this.sensitivity ||
        maxSample < MIN_SAMPLE_THRESHOLD
      ) {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        return -1;
      }

      // Find the first and last points where the signal is above the threshold
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

      // Initialize or resize correlation array if needed
      if (!this.correlationArray || this.correlationArray.length < windowSize) {
        this.correlationArray = new Float32Array(windowSize);
      }

      // Perform autocorrelation
      for (let lag = 0; lag < windowSize; lag++) {
        let sum = 0;
        for (let i = 0; i < windowSize - lag; i++) {
          sum += buf[start + i] * buf[start + i + lag];
        }
        this.correlationArray[lag] = sum;
      }

      // Find the first dip (skip the direct current component)
      let dipIndex = 0;
      while (
        dipIndex < windowSize - 1 &&
        this.correlationArray[dipIndex] > this.correlationArray[dipIndex + 1]
      ) {
        dipIndex++;
      }

      // Find the main peak after the dip
      let maxVal = -Infinity;
      let peakIndex = -1;
      for (let i = dipIndex; i < windowSize; i++) {
        if (this.correlationArray[i] > maxVal) {
          maxVal = this.correlationArray[i];
          peakIndex = i;
        }
      }

      if (peakIndex <= 0) return -1;

      // Calculate frequency from peak index
      let freq = sampleRate / peakIndex;

      // Harmonic correction
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

      // Check for common harmonics in voice range
      if (freq > 0 && freq < 2000) {
        if (freq > 160 && freq < 800) {
          // Possible 2nd harmonic
          freq = checkHarmonic(2, 0.8);
        } else if (freq > 240 && freq < 1200) {
          // Possible 3rd harmonic
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
      const spacing = (width - 50) / MAX_HISTORY;
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
      const currentNoteName = this.getNoteNameNum(Math.round(midi * 2) / 2);
      const currentNoteBase = currentNoteName.replace(/[0-9+]/g, "");

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
        this.drawHistoryPoints(i, freq, midi, spacing);
      }
    },
    drawNoteLines() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const scaleNoteIndices = this.getMajorScaleNotes(this.selectedRootNote);

      // Precalcular información de la nota actual
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

      // Dibujar líneas de notas
      for (let i = 0; i <= (MAX_MIDI - MIN_MIDI) * 2; i++) {
        const y = height - (i / (TOTAL_NOTES * 2)) * height;
        const midi = MIN_MIDI + i / 2;
        const noteIndex = Math.floor(midi) % 12;
        const isHalfStep = i % 2 === 1;
        const noteName = isHalfStep
          ? NOTE_SHORT_STRINGS[noteIndex * 2 + 1]
          : NOTE_SHORT_STRINGS[noteIndex * 2];
        const noteBase = noteName.replace(/\+/g, "");
        const isInScale = scaleNoteIndices.includes(noteIndex);

        // Determinar estilo basado en condiciones
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

        // Dibujar línea
        ctx.strokeStyle = style.stroke;
        ctx.fillStyle = style.fill;
        ctx.lineWidth = style.lineWidth;
        ctx.beginPath();
        ctx.moveTo(5, y);
        ctx.lineTo(width - TEXT_WIDTH - 3, y);
        ctx.stroke();

        // Dibujar texto
        ctx.font = isHalfStep
          ? `bold ${style.lineWidth > 1 ? 11 : 10}px sans-serif`
          : `bold ${style.lineWidth > 1 ? 13 : 12}px sans-serif`;
        ctx.fillText(
          noteName,
          width - TEXT_WIDTH + (isHalfStep ? 15 : 0),
          y + 3
        );
      }

      // Línea vertical
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
        const y = height - ((shiftedMidi - MIN_MIDI) / TOTAL_NOTES) * height;

        if (y >= 0 && y <= height) {
          const x = width - i * spacing - TEXT_WIDTH - 5;
          const shiftedNoteIndex = Math.round(shiftedMidi) % 12;

          ctx.fillStyle = COLORS[shiftedNoteIndex];
          ctx.beginPath();
          ctx.arc(x, y, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
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
