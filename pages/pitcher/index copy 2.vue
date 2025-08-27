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
              <v-switch
                v-model="showMicrotones"
                :label="
                  latinNotation ? 'Mostrar microtonos' : 'Show microtones'
                "
                hide-details
                class="mt-0 pt-0"
              ></v-switch>
            </v-col>
            <v-col cols="12" sm="6">
              <v-switch
                v-model="adaptiveSensitivity"
                :label="
                  latinNotation
                    ? 'Sensibilidad adaptativa'
                    : 'Adaptive sensitivity'
                "
                hide-details
                class="mt-0 pt-0"
              ></v-switch>
            </v-col>
            <v-col cols="12" sm="6">
              <v-slider
                v-model="amplificationFactor"
                :min="1.0"
                :max="5.0"
                :step="0.5"
                :label="latinNotation ? 'Amplificación' : 'Amplification'"
                hide-details
                thumb-label
              />
              <div class="text-center font-weight-bold">
                {{ amplificationFactor.toFixed(1) }}x
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <v-slider
                v-model="sensitivity"
                :min="0.0001"
                :max="0.05"
                :step="0.0005"
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
                v-model="maxHistory"
                :min="300"
                :max="800"
                :step="50"
                label="Máx Historial"
                hide-details
                thumb-label
              />
              <div class="text-center font-weight-bold">
                {{ maxHistory }}
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
// Constants moved outside component for better performance
const COLORS = [
  "#FF0000",
  "#FF4000",
  "#FF8000",
  "#FFB000",
  "#FFD700",
  "#FFE880",
  "#FFFF00",
  "#FFFF60",
  "#E0FF80",
  "#A0FF00",
  "#80FF00",
  "#40FF00",
  "#00FF00",
  "#00FF80",
  "#00FFC0",
  "#00FFFF",
  "#00BFFF",
  "#0080FF",
  "#0060FF",
  "#0040FF",
  "#7F5AFF",
  "#A066FF",
  "#CC00FF",
  "#FF00FF",
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
const TOLERANCE_HZ = 1.95;
const A4_FREQ = 440;
const A4_MIDI = 69;
const TEXT_WIDTH = 40;

// Precompute MIDI to frequency conversion table
const midiToFreqTable = new Float32Array(128);
for (let i = 0; i < 128; i++) {
  midiToFreqTable[i] = A4_FREQ * Math.pow(2, (i - A4_MIDI) / 12);
}

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
      correlationArray: null,
      freqDisplay: "--",
      noteDisplay: "--",
      dBDisplay: "--",
      lastFreq: null,
      adaptiveSensitivity: true,
      amplificationFactor: 2.0,
      minSensitivity: 0.0001,
      maxSensitivity: 0.01,
      noiseFloor: 0.0005,
      signalAverage: 0,
      animationFrameId: null,
      currentNoteOptions: null,
      noteNameCache: new Map(),
      noteNameNumCache: new Map(),
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.buffer = new Float32Array(4096);
    this.updateCanvasSize();
    window.addEventListener("resize", this.updateCanvasSize);
    this.drawHistogram();

    // Precompute note options
    this.currentNoteOptions = this.latinNotation
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
  beforeUnmount() {
    if (this.isMicActive) {
      this.cleanup();
    }
    window.removeEventListener("resize", this.updateCanvasSize);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
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
    showMicrotones: {
      get() {
        return this.$store.state.pitcher_store.showMicrotones;
      },
      set(value) {
        this.$store.commit("pitcher_store/SET_SHOW_MICROTONES", value);
      },
    },
    maxHistory: {
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
      // Use precomputed table for faster conversion
      const roundedMidi = Math.round(midi);
      return roundedMidi >= 0 && roundedMidi < 128
        ? midiToFreqTable[roundedMidi]
        : A4_FREQ * Math.pow(2, (midi - A4_MIDI) / 12);
    },
    freqToMidi(freq) {
      if (freq <= 0) return 0;
      return 69 + 12 * Math.log2(freq / 440);
    },
    getNoteNameNum(midiNote) {
      // Use caching for better performance
      const cacheKey = `${midiNote}|${this.latinNotation}`;
      if (this.noteNameNumCache.has(cacheKey)) {
        return this.noteNameNumCache.get(cacheKey);
      }

      const roundedMidi = Math.round(midiNote * 2) / 2;
      const noteIndex = Math.floor(roundedMidi) % 12;
      const isHalfStep = roundedMidi % 1 === 0.5;
      const fullIndex = isHalfStep ? noteIndex * 2 + 1 : noteIndex * 2;
      const noteStrings = this.latinNotation
        ? NOTE_LATIN_STRINGS
        : NOTE_SHORT_STRINGS;
      const note = noteStrings[fullIndex];
      const octave = Math.floor(roundedMidi / 12 - 1);
      const result = `${note}${octave}`;

      this.noteNameNumCache.set(cacheKey, result);
      return result;
    },
    getNoteName(midiNote) {
      // Use caching for better performance
      const cacheKey = `${midiNote}|${this.latinNotation}`;
      if (this.noteNameCache.has(cacheKey)) {
        return this.noteNameCache.get(cacheKey);
      }

      const noteIndex = Math.floor(midiNote) % 12;
      const isHalfStep = Math.round(midiNote * 2) % 2 === 1;
      const fullIndex = isHalfStep ? noteIndex * 2 + 1 : noteIndex * 2;
      const noteStrings = this.latinNotation
        ? NOTE_LATIN_STRINGS
        : NOTE_SHORT_STRINGS;
      const result = noteStrings[fullIndex];

      this.noteNameCache.set(cacheKey, result);
      return result;
    },
    getMajorScaleNotes(root) {
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
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.isMicActive = false;
      this.freqDisplay = "--";
      this.noteDisplay = "--";
      this.dBDisplay = "--";
      this.history = [];
      this.signalAverage = 0;
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
          this.analyser.fftSize = 4096;
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
      const MIN_DB = 20;
      const MIN_SAMPLE_THRESHOLD = 0.005;
      const PEAK_THRESHOLD_FACTOR = 0.15;
      const WINDOW_PADDING = 10;

      let sumSquares = 0;
      let maxSample = 0;

      // Use a single loop for multiple calculations
      for (let i = 0; i < SIZE; i++) {
        const sample = buf[i];
        sumSquares += sample * sample;
        if (Math.abs(sample) > maxSample) maxSample = Math.abs(sample);
      }

      const rms = Math.sqrt(sumSquares / SIZE);
      const dB_SPL = 20 * Math.log10(rms / 0.00002);
      this.dBDisplay = Math.max(0, dB_SPL).toFixed(1);

      // Update moving average of signal
      this.signalAverage = 0.95 * this.signalAverage + 0.05 * rms;

      // Apply adaptive sensitivity
      let currentSensitivity = this.sensitivity;
      if (this.adaptiveSensitivity) {
        const strengthFactor = Math.min(1.0, rms / 0.1);
        currentSensitivity =
          this.minSensitivity +
          (this.maxSensitivity - this.minSensitivity) * (1.0 - strengthFactor);
      }

      // Apply noise gate and sensitivity threshold
      if (
        this.signalAverage < this.noiseFloor ||
        dB_SPL < MIN_DB ||
        rms < currentSensitivity ||
        maxSample < MIN_SAMPLE_THRESHOLD
      ) {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        return -1;
      }

      const threshold = maxSample * PEAK_THRESHOLD_FACTOR;
      let start = 0;
      let end = SIZE - 1;

      // Find window start
      for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buf[i]) > threshold) {
          start = Math.max(0, i - WINDOW_PADDING);
          break;
        }
      }

      // Find window end
      for (let i = SIZE - 1; i > SIZE / 2; i--) {
        if (Math.abs(buf[i]) > threshold) {
          end = Math.min(SIZE - 1, i + WINDOW_PADDING);
          break;
        }
      }

      const windowSize = end - start;
      if (windowSize <= 0) return -1;

      // Reuse correlation array if possible
      if (!this.correlationArray || this.correlationArray.length < windowSize) {
        this.correlationArray = new Float32Array(windowSize);
      }

      // Optimized correlation calculation
      for (let lag = 0; lag < windowSize; lag++) {
        let sum = 0;
        const bufStart = start;
        for (let i = 0; i < windowSize - lag; i++) {
          sum += buf[bufStart + i] * buf[bufStart + i + lag];
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

      // Enhanced harmonic detection
      if (freq > 0 && freq < 2000) {
        // Check for sub-harmonics (octave below)
        if (freq > 80 && freq < 400) {
          freq = checkHarmonic(2, 0.6);
        }
        // Check for third harmonic
        if (freq > 120 && freq < 600) {
          freq = checkHarmonic(3, 0.5);
        }
        // Check for fourth harmonic
        if (freq > 160 && freq < 800) {
          freq = checkHarmonic(4, 0.4);
        }
      }

      return freq > 20 && freq < 2000 ? freq : -1;
    },
    update() {
      if (!this.analyser) return;

      this.analyser.getFloatTimeDomainData(this.buffer);

      // Signal amplification with clamping
      const amplification = this.amplificationFactor;
      for (let i = 0; i < this.buffer.length; i++) {
        this.buffer[i] = Math.max(
          -1.0,
          Math.min(1.0, this.buffer[i] * amplification)
        );
      }

      // Pre-emphasis filter to boost high frequencies
      const preEmphasis = 0.97;
      for (let i = 1; i < this.buffer.length; i++) {
        this.buffer[i] = this.buffer[i] - preEmphasis * this.buffer[i - 1];
      }

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
        if (this.history.length > this.maxHistory) this.history.pop();

        // Only redraw if frequency has changed significantly
        if (
          this.history.length < 2 ||
          Math.abs(this.history[0].freq - this.history[1].freq) > 0.5
        ) {
          this.drawHistogram();
        }
      } else {
        this.freqDisplay = "--";
        this.noteDisplay = "--";
        this.dBDisplay = "--";
      }

      if (this.isMicActive) {
        this.animationFrameId = requestAnimationFrame(this.update);
      }
    },
    drawHistogram() {
      const canvas = this.$refs.histogram;
      const ctx = this.ctx;
      const height = canvas.height;
      const width = canvas.width;
      const spacing = (width - 50) / this.maxHistory;
      const len = Math.min(this.history.length, this.maxHistory);

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

      // Precompute values for the loop
      const octaveOffsets = [-2, -1, 0, 1, 2, 3, 4];

      for (const octaveOffset of octaveOffsets) {
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

      // Precompute values for the loop
      const totalLines = this.totalNotes * 2;

      for (let i = 0; i <= totalLines; i++) {
        const y = height - (i / totalLines) * height;
        const midi = MIN_MIDI + i / 2;
        const noteIndex = Math.floor(midi) % 12;
        const isHalfStep = i % 2 === 1;
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

        if ((this.showMicrotones && isHalfStep) || !isHalfStep) {
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

      // Precompute octave offsets
      const octaveOffsets = [-2, -1, 0, 1, 2, 3, 4];

      for (const octaveOffset of octaveOffsets) {
        const shiftedFreq = baseFreq * Math.pow(2, octaveOffset);
        const shiftedMidi = this.freqToMidi(shiftedFreq);
        const y =
          height - ((shiftedMidi - MIN_MIDI) / this.totalNotes) * height;

        if (y >= 0 && y <= height) {
          const x = width - i * spacing - TEXT_WIDTH - 5;
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
      // Update note options when notation changes
      this.currentNoteOptions = newVal
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

      // Clear caches when notation changes
      this.noteNameCache.clear();
      this.noteNameNumCache.clear();

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
