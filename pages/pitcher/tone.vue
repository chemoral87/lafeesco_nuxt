<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" md="8" lg="6">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Voice Frequency Analyzer</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-chip :color="isRecording ? 'red' : 'grey'" dark>
                  {{ isRecording ? "RECORDING" : "IDLE" }}
                </v-chip>
              </v-toolbar>

              <v-card-text>
                <v-row class="text-center">
                  <v-col cols="12">
                    <div class="display-3 mb-4">
                      {{ currentFrequency.toFixed(2) }} Hz
                    </div>
                    <v-progress-linear
                      :value="frequencyPercentage"
                      height="25"
                      color="light-blue"
                      rounded
                    >
                      <strong>{{ frequencyPercentage.toFixed(0) }}%</strong>
                    </v-progress-linear>
                  </v-col>
                </v-row>

                <v-row class="mt-8">
                  <v-col cols="12">
                    <v-btn
                      block
                      x-large
                      :color="isRecording ? 'error' : 'primary'"
                      @click="toggleRecording"
                      :loading="loading"
                      :disabled="loading"
                    >
                      <v-icon left>{{
                        isRecording ? "mdi-stop" : "mdi-microphone"
                      }}</v-icon>
                      {{ isRecording ? "Stop Recording" : "Start Recording" }}
                    </v-btn>
                  </v-col>
                </v-row>

                <v-row v-if="history.length > 0" class="mt-8">
                  <v-col cols="12">
                    <h3 class="headline mb-4">
                      Frequency History (Last {{ history.length }} records)
                    </h3>
                    <div class="history-chart">
                      <svg
                        :width="chartWidth"
                        :height="chartHeight"
                        class="chart-svg"
                      >
                        <polyline
                          fill="none"
                          stroke="#1976d2"
                          stroke-width="2"
                          :points="chartPoints"
                        />
                        <g v-for="(point, index) in chartData" :key="index">
                          <circle
                            :cx="point.x"
                            :cy="point.y"
                            r="3"
                            fill="#1976d2"
                            @mouseover="showTooltip($event, point.frequency)"
                          />
                        </g>
                        <text x="10" y="20" font-size="12" fill="#666">
                          Max: {{ maxFrequency.toFixed(2) }} Hz
                        </text>
                        <text x="10" y="40" font-size="12" fill="#666">
                          Min: {{ minFrequency.toFixed(2) }} Hz
                        </text>
                      </svg>
                      <div
                        v-if="tooltip.visible"
                        class="tooltip"
                        :style="{
                          left: tooltip.x + 'px',
                          top: tooltip.y + 'px',
                        }"
                      >
                        {{ tooltip.frequency }} Hz
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import * as Tone from "tone";

export default {
  name: "VoiceAnalyzer",
  data() {
    return {
      isRecording: false,
      loading: false,
      currentFrequency: 0,
      history: [],
      maxHistorySize: 400,
      analyser: null,
      meter: null,
      mic: null,
      interval: null,
      maxFrequency: 0,
      minFrequency: 0,
      tooltip: {
        visible: false,
        x: 0,
        y: 0,
        frequency: 0,
      },
      chartWidth: 0,
    };
  },
  computed: {
    frequencyPercentage() {
      // rango de voz humana hasta 2000 Hz
      const maxDisplayFreq = 2000;
      return Math.min((this.currentFrequency / maxDisplayFreq) * 100, 100);
    },
    chartHeight() {
      return 200;
    },
    chartData() {
      if (this.history.length === 0) return [];

      this.maxFrequency = Math.max(...this.history);
      this.minFrequency = Math.min(...this.history);

      const range = Math.max(this.maxFrequency - this.minFrequency, 1);
      const padding = 20;

      return this.history.map((frequency, index) => {
        const x =
          (index / (this.history.length - 1)) *
            (this.chartWidth - padding * 2) +
          padding;
        const y =
          this.chartHeight -
          padding -
          ((frequency - this.minFrequency) / range) *
            (this.chartHeight - padding * 2);
        return { x, y, frequency };
      });
    },
    chartPoints() {
      return this.chartData.map((point) => `${point.x},${point.y}`).join(" ");
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.chartWidth = this.$el ? this.$el.clientWidth - 48 : 500;
    });
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
    if (this.mic && this.mic.state === "started") {
      this.mic.close().catch(() => {});
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.chartWidth = this.$el ? this.$el.clientWidth - 48 : 500;
    },
    async toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        await this.startRecording();
      }
    },
    async startRecording() {
      this.loading = true;

      try {
        await Tone.start();

        this.meter = new Tone.Meter();
        // usamos waveform para autocorrelación
        this.analyser = new Tone.Analyser("waveform", 2048);
        this.mic = new Tone.UserMedia();

        await this.mic.open();
        this.mic.connect(this.analyser);
        this.mic.connect(this.meter);

        this.isRecording = true;

        this.interval = setInterval(() => {
          const values = this.analyser.getValue();
          const frequency = this.getDominantFrequency(values);
          this.currentFrequency = frequency;

          // guardar historial
          this.history.push(frequency);
          if (this.history.length > this.maxHistorySize) {
            this.history.shift();
          }

          this.$emit("frequency-update", frequency);
        }, 100);
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert(
          "Could not access microphone. Please check your browser permissions."
        );
      } finally {
        this.loading = false;
      }
    },
    stopRecording() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      if (this.mic && this.mic.state === "started") {
        this.mic.close().catch(() => {});
      }
      this.isRecording = false;
    },

    // --- Método con autocorrelación ---
    getDominantFrequency(buffer) {
      if (!buffer || buffer.length === 0) return 0;

      const SIZE = buffer.length;
      let rms = 0;

      for (let i = 0; i < SIZE; i++) {
        rms += buffer[i] * buffer[i];
      }
      rms = Math.sqrt(rms / SIZE);
      if (rms < 0.01) return 0; // demasiado silencio

      let bestOffset = -1;
      let bestCorrelation = 0;
      let lastCorrelation = 1;

      for (let offset = 2; offset < SIZE / 2; offset++) {
        let correlation = 0;

        for (let i = 0; i < SIZE - offset; i++) {
          correlation += buffer[i] * buffer[i + offset];
        }

        correlation = correlation / (SIZE - offset);

        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }

        lastCorrelation = correlation;
      }

      if (bestOffset > -1) {
        return Tone.context.sampleRate / bestOffset;
      }

      return 0;
    },

    showTooltip(event, frequency) {
      this.tooltip = {
        visible: true,
        x: event.clientX,
        y: event.clientY - 30,
        frequency: frequency.toFixed(2),
      };

      setTimeout(() => {
        this.tooltip.visible = false;
      }, 2000);
    },
  },
};
</script>

<style scoped>
.chart-svg {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #fafafa;
}

.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 100;
}

.history-chart {
  position: relative;
}
</style>
