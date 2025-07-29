<template>
  <v-container class="pa-4" style="max-width: 1000px">
    <h4 class="text-left mb-4">
      Tuner
      <span>
        Frec: <strong>{{ freqDisplay }}</strong> Hz
      </span>
      | <span> ({{ dBDisplay }} dB)</span>
      <!-- <span>
        Nota: <strong>{{ noteDisplay }}</strong>
        <span v-if="isNoteInScale"> (Escala)</span>
        
      </span> -->
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
const MAX_HISTORY = 700;
const TOLERANCE_HZ = 1.95;
const A4_FREQ = 440;
const A4_MIDI = 69;
const TEXT_WIDTH = 40;

export default {
  data() {
    return {
      canvasWidth: 800,
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
      hasScrolledToFirst: false,
      lastFreq: null,
    };
  },
  mounted() {
    this.ctx = this.$refs.histogram.getContext("2d");
    this.ctx.lineWidth = 0.5;
    this.buffer = new Float32Array(2048);
    this.updateCanvasSize(); // Initial size calculation
    window.addEventListener("resize", this.updateCanvasSize);
  },
  beforeUnmount() {
    if (this.isMicActive) {
      this.cleanup();
    }
    window.removeEventListener("resize", this.updateCanvasSize);
  },
  computed: {
    isNoteInScale() {
      const note = this.noteDisplay.replace(/[0-9+]/g, "");
      const noteIndex = this.noteOptions.indexOf(note);
      return this.getMajorScaleNotes(this.selectedRootNote).includes(noteIndex);
    },
    scaleNoteIndices() {
      return this.getMajorScaleNotes(this.selectedRootNote);
    },
  },
  methods: {
    updateCanvasSize() {
      const container = this.$el.querySelector(".v-container");
      if (container) {
        // Subtract some padding to account for margins
        this.canvasWidth = Math.min(container.clientWidth - 32, 1000);
        // Force Vue to update the DOM
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
    /**
     * Smooths frequency transitions and corrects octave jumps
     * @param {number} currentFreq - The current raw frequency in Hz
     * @returns {number} The smoothed frequency
     */
    smoothFrequency(currentFreq) {
      if (!this.lastFreq) {
        this.lastFreq = currentFreq;
        return currentFreq;
      }

      // Define octave jump thresholds and correction factors
      const OCTAVE_THRESHOLD_LOW = 1.8;
      const OCTAVE_THRESHOLD_HIGH = 2.2;
      const HALF_OCTAVE_THRESHOLD_LOW = 0.45;
      const HALF_OCTAVE_THRESHOLD_HIGH = 0.55;

      const ratio = currentFreq / this.lastFreq;

      // Octave correction with weighted average
      if (ratio > OCTAVE_THRESHOLD_LOW && ratio < OCTAVE_THRESHOLD_HIGH) {
        currentFreq = (currentFreq + this.lastFreq * 2) * 0.5;
      } else if (
        ratio > HALF_OCTAVE_THRESHOLD_LOW &&
        ratio < HALF_OCTAVE_THRESHOLD_HIGH
      ) {
        currentFreq = (currentFreq + this.lastFreq * 0.5) * 0.5;
      }

      // Apply exponential smoothing
      const SMOOTHING_FACTOR = 0.3;
      this.lastFreq =
        this.lastFreq * (1 - SMOOTHING_FACTOR) + currentFreq * SMOOTHING_FACTOR;

      return this.lastFreq;
    },

    /**
     * Performs autocorrelation pitch detection on audio buffer
     * @param {Float32Array} buf - The audio buffer to analyze
     * @param {number} sampleRate - The sample rate in Hz
     * @returns {number} The detected frequency in Hz or -1 if none detected
     */
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
        if (sample > maxSample) maxSample = sample;
        if (-sample > maxSample) maxSample = -sample;
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

      // Detect active region with hysteresis
      const threshold = maxSample * PEAK_THRESHOLD_FACTOR;
      let start = 0;
      let end = SIZE - 1;

      for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buf[i]) > threshold) {
          start = Math.max(0, i - WINDOW_PADDING);
          break;
        }
      }

      for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buf[SIZE - i]) > threshold) {
          end = Math.min(SIZE - 1, SIZE - i + WINDOW_PADDING);
          break;
        }
      }

      const windowSize = end - start;
      if (windowSize <= 0) return -1;

      // Initialize or resize correlation array if needed
      if (!this.correlationArray || this.correlationArray.length < windowSize) {
        this.correlationArray = new Float32Array(windowSize);
      } else {
        this.correlationArray.fill(0);
      }

      // Optimized autocorrelation with pre-calculated values
      for (let lag = 0; lag < windowSize; lag++) {
        let sum = 0;
        const limit = windowSize - lag;
        for (let i = 0; i < limit; i++) {
          sum += buf[start + i] * buf[start + i + lag];
        }
        this.correlationArray[lag] = sum;
      }

      // Find initial dip (skip direct current component)
      let dipIndex = 0;
      while (
        dipIndex < windowSize - 1 &&
        this.correlationArray[dipIndex] > this.correlationArray[dipIndex + 1]
      ) {
        dipIndex++;
      }

      // Find main peak after dip
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

      // Harmonic correction helper
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

        // Special handling for problematic range (180-220Hz)
        if (rawFreq > 180 && rawFreq < 220) {
          const possibleFreq = rawFreq / 2;
          const midi = this.freqToMidi(possibleFreq);
          // Only correct if it results in a valid musical note
          if (midi >= 48 && midi <= 84) {
            // C3 to C6 range
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
        const scaleNotes = this.getMajorScaleNotes(this.selectedRootNote);
        const currentNoteIndex = Math.floor(midi) % 12;
        const isInScale = scaleNotes.includes(currentNoteIndex);

        if (isSameNoteFamily && isSameNoteType) {
          // Nota actualmente detectada
          if (isHalfStep) {
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "yellow";
          } else {
            if (!isInScale) {
              ctx.strokeStyle = "orange";
              ctx.fillStyle = "orange";
            } else {
              ctx.strokeStyle = "red";
              ctx.fillStyle = "red";
            }
          }
          ctx.lineWidth = isExactNote ? 2.5 : 2;
        } else if (isInScale) {
          // Notas de la escala actual
          if (isHalfStep) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
          } else {
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";
          }
          ctx.lineWidth = 1;
        } else {
          // Notas fuera de la escala
          if (isHalfStep) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
          } else {
            ctx.strokeStyle = "gray";
            ctx.fillStyle = "gray";
          }
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
