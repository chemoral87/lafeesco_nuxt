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
        height="500"
        style="display: block; margin: auto; background-color: black"
      ></canvas>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      freq: 0,
      currentNoteName: "",
      audioContext: null,
      analyser: null,
      dataArray: null,
      canvas: null,
      ctx: null,
      NOTE_STRINGS: [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
      ],
      NOTE_SHORT_STRINGS: [],
      MIN_MIDI: 36,
      MAX_MIDI: 84,
    };
  },
  computed: {
    freqDisplay() {
      return this.freq.toFixed(1);
    },
  },
  mounted() {
    this.initCanvas();
    this.generateNoteStrings();
    this.startMic();
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    },
    generateNoteStrings() {
      this.NOTE_SHORT_STRINGS = [];
      for (let midi = this.MIN_MIDI; midi <= this.MAX_MIDI; midi++) {
        const note = this.NOTE_STRINGS[midi % 12];
        const octave = Math.floor(midi / 12) - 1;
        this.NOTE_SHORT_STRINGS.push(`${note}${octave}`);
      }
    },
    startMic() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        source.connect(this.analyser);
        this.analyser.fftSize = 2048;
        const bufferLength = this.analyser.fftSize;
        const dataArray = new Float32Array(bufferLength);
        this.dataArray = dataArray;
        this.detectPitch();
      });
    },
    detectPitch() {
      requestAnimationFrame(this.detectPitch);
      this.analyser.getFloatTimeDomainData(this.dataArray);
      const freq = this.autoCorrelate(
        this.dataArray,
        this.audioContext.sampleRate
      );
      if (freq !== -1) {
        this.freq = freq;
        const midi = Math.floor(69 + 12 * Math.log2(freq / 440)); // CORREGIDO: Math.floor
        const note = this.NOTE_STRINGS[midi % 12];
        const octave = Math.floor(midi / 12) - 1;
        this.currentNoteName = `${note}${octave}`;
        this.drawCanvas(midi);
      }
    },
    autoCorrelate(buffer, sampleRate) {
      let SIZE = buffer.length;
      let MAX_SAMPLES = Math.floor(SIZE / 2);
      let bestOffset = -1;
      let bestCorrelation = 0;
      let rms = 0;

      for (let i = 0; i < SIZE; i++) {
        const val = buffer[i];
        rms += val * val;
      }
      rms = Math.sqrt(rms / SIZE);
      if (rms < 0.01) return -1;

      let correlations = new Array(MAX_SAMPLES);
      for (let offset = 0; offset < MAX_SAMPLES; offset++) {
        let correlation = 0;
        for (let i = 0; i < MAX_SAMPLES; i++) {
          correlation += buffer[i] * buffer[i + offset];
        }
        correlations[offset] = correlation;
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      }

      if (bestCorrelation > 0.01) {
        const fundamentalFreq = sampleRate / bestOffset;
        return fundamentalFreq;
      }
      return -1;
    },
    drawCanvas(currentMidi) {
      const ctx = this.ctx;
      const width = this.canvas.width;
      const height = this.canvas.height;
      ctx.clearRect(0, 0, width, height);

      const totalNotes = this.NOTE_SHORT_STRINGS.length;
      const noteHeight = height / totalNotes;

      for (let i = 0; i < totalNotes; i++) {
        const midi = this.MIN_MIDI + i;
        const y = i * noteHeight;
        const label = this.NOTE_SHORT_STRINGS[i];
        if (!label) continue;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = midi === currentMidi ? "#FF0000" : "#ccc";
        ctx.lineWidth = midi === currentMidi ? 2 : 1;
        ctx.stroke();

        ctx.fillStyle = midi === currentMidi ? "#FF0000" : "#000";
        ctx.font = "12px sans-serif";
        ctx.fillText(label, width - 40, y + 10);
      }
    },
  },
};
</script>

<style scoped>
h4 {
  font-weight: 600;
}
</style>
