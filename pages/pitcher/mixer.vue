<template>
  <v-container class="py-8" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-4">
          <v-row align="center" no-gutters>
            <v-col>
              <h1 class="text-h5 font-weight-bold mb-2">
                Video + Background Audio Mixer v.2.4
              </h1>
              <div class="subtitle-2 grey--text">
                Replace the media URLs below with your own. Tap "Enable Audio"
                on iOS to start the mixer.
              </div>
            </v-col>
            <v-spacer />
            <v-col cols="12" md="auto" class="text-md-right mt-4 mt-md-0">
              <v-btn
                color="primary"
                class="mr-2"
                @click="toggleAudioContext"
                :disabled="audioReady"
              >
                {{ audioReady ? "Audio Enabled" : "Enable Audio" }}
              </v-btn>
              <v-btn
                color="secondary"
                @click="toggleMixer"
                :disabled="!audioReady"
              >
                {{ mixerPlaying ? "Stop Mixer" : "Start Mixer" }}
              </v-btn>
            </v-col>
          </v-row>

          <!-- TIMER SECTION -->
          <v-card class="mt-6" outlined>
            <v-card-title class="text-subtitle-1 font-weight-bold">
              Timer
            </v-card-title>
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="selectedTimerDuration"
                    :items="timerOptions"
                    label="Set Timer"
                    outlined
                    dense
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="text-center">
                  <div class="text-h4">{{ formattedTime }}</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="4"
                  class="text-center text-md-right"
                >
                  <v-btn
                    color="primary"
                    class="mr-2"
                    @click="startTimer"
                    :disabled="!selectedTimerDuration || timerRunning"
                  >
                    Start
                  </v-btn>
                  <v-btn
                    color="error"
                    @click="stopTimer"
                    :disabled="!timerRunning"
                  >
                    Stop
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- VIDEO PLAYER -->
          <v-card class="mt-6" outlined>
            <div v-if="!videoLoaded" class="pa-2">
              <v-progress-linear
                :value="videoLoading"
                color="primary"
                height="6"
                striped
                rounded
              >
                <template v-slot:default>
                  <strong>{{ videoLoading }}%</strong>
                </template>
              </v-progress-linear>
            </div>
            <v-responsive>
              <video
                ref="video"
                playsinline
                width="20%"
                webkit-playsinline
                :src="videoSrc"
                :loop="videoLoop"
                :muted="videoMuted"
                @loadedmetadata="onVideoLoaded"
                @progress="onVideoProgress"
                @canplaythrough="onVideoCanPlay"
              ></video>
            </v-responsive>
            <v-divider></v-divider>
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" sm="6" class="d-flex align-center">
                  <v-btn class="mr-2" color="primary" @click="toggleVideo">
                    {{ videoPlaying ? "Pause" : "Play" }}
                  </v-btn>
                  <v-btn class="mr-2" text @click="toggleVideoMute">
                    {{ videoMuted ? "Unmute" : "Mute" }}
                  </v-btn>
                  <v-btn text @click="videoLoop = !videoLoop">
                    {{ videoLoop ? "Loop: On" : "Loop: Off" }}
                  </v-btn>
                </v-col>
                <!-- <v-col cols="12" sm="6">
                  <div class="caption mb-1">Video Volume</div>
                  <v-slider
                    v-model="videoVolume"
                    min="0"
                    max="100"
                    step="1"
                    @change="applyVideoVolume"
                  ></v-slider>
                </v-col> -->
              </v-row>
            </v-card-text>
          </v-card>

          <!-- MIXER CONTROLS -->
          <v-card class="mt-8" outlined>
            <v-card-title class="text-subtitle-1 font-weight-bold"
              >Background Audio Mixer</v-card-title
            >
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <div class="subtitle-2 font-weight-medium mb-2">Master</div>
                  <v-slider
                    v-model="masterVolume"
                    min="0"
                    max="100"
                    step="1"
                    @input="applyMasterGain"
                  ></v-slider>
                  <v-switch
                    v-model="masterMute"
                    label="Mute"
                    @change="applyMasterMute"
                  ></v-switch>
                </v-col>

                <v-col cols="12" md="8">
                  <v-row>
                    <v-col
                      v-for="(track, idx) in tracks"
                      :key="idx"
                      cols="12"
                      sm="6"
                    >
                      <v-card outlined class="pa-3">
                        <div class="d-flex align-center mb-2">
                          <v-avatar
                            size="28"
                            class="mr-2 primary white--text"
                            >{{ idx + 1 }}</v-avatar
                          >
                          <div class="subtitle-2 font-weight-medium">
                            {{ track.name }}
                          </div>
                          <v-spacer />
                          <v-btn
                            icon
                            :title="track.playing ? 'Pause' : 'Play'"
                            @click="toggleTrack(track)"
                          >
                            <v-icon>{{
                              track.playing ? "mdi-pause" : "mdi-play"
                            }}</v-icon>
                          </v-btn>
                        </div>
                        <div class="caption mb-1">Volume</div>
                        <v-slider
                          v-model="track.volume"
                          min="0"
                          max="100"
                          step="1"
                          @input="applyTrackGain(track)"
                        ></v-slider>
                        <div class="d-flex align-center">
                          <v-switch
                            class="mr-4"
                            v-model="track.muted"
                            label="Mute"
                            @change="applyTrackMute(track)"
                          ></v-switch>
                          <v-switch
                            v-model="track.solo"
                            label="Solo"
                            @change="applySolo"
                          ></v-switch>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-alert type="info" class="mt-4" border="left" colored-border>
                <div class="mb-1 font-weight-medium">Tips</div>
                <div>
                  • Replace <code>videoSrc</code> and each track
                  <code>src</code> with your files. For remote files, ensure
                  CORS allows <code>MediaElementSource</code>.<br />
                  • iOS requires a user gesture to start audio — press "Enable
                  Audio" first.
                </div>
              </v-alert>
            </v-card-text>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MixerPage",
  data() {
    return {
      // Replace with your own assets
      videoSrc: "/videos/relax/relax_crop_min2.mp4",
      videoLoading: 0, // percent 0–100
      videoLoaded: false, // flag when ready to play
      // Initial tracks (replace URLs)
      tracks: [
        {
          name: "Rain",
          src: "/sounds/relax/calming_rain.mp3",
          // src: "https://cdn.freesound.org/previews/414/414209_5121236-lq.mp3",
          volume: 60,
          muted: false,
          solo: false,
          playing: false,
          _el: null,
          _gain: null,
          _node: null,
        },
        {
          name: "Fire",
          src: "/sounds/relax/fire_sound.mp3",
          volume: 45,
          muted: false,
          solo: false,
          playing: false,
          _el: null,
          _gain: null,
          _node: null,
        },
        {
          name: "Soft Pad",
          src: "https://cdn.pixabay.com/audio/2025/07/23/audio_63d9f37e74.mp3",
          volume: 35,
          muted: false,
          solo: false,
          playing: false,
          _el: null,
          _gain: null,
          _node: null,
        },
      ],

      // Video state
      videoPlaying: false,
      videoMuted: false,
      videoLoop: true,
      videoVolume: 100,

      // Web Audio
      audioCtx: null,
      masterGainNode: null,
      masterVolume: 80,
      masterMute: false,
      audioReady: false,
      mixerPlaying: false,

      // Timer functionality
      selectedTimerDuration: null,
      timerOptions: [
        { text: "1 minute", value: 1 },
        { text: "3 minutes", value: 3 },
        { text: "5 minutes", value: 5 },
        { text: "10 minutes", value: 10 },
      ],
      timerRunning: false,
      timeRemaining: 0,
      timerInterval: null,
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    },
  },
  mounted() {
    // Do not auto-create AudioContext to avoid iOS autoplay restrictions.
    // Wait for user to press Enable Audio (toggleAudioContext).
  },
  beforeDestroy() {
    // Clean up media & audio graph
    try {
      this.tracks.forEach((t) => {
        if (t._el) {
          t._el.pause();
          t._el.src = "";
          t._el.load();
        }
        if (t._node) {
          try {
            t._node.disconnect();
          } catch (e) {}
        }
        if (t._gain) {
          try {
            t._gain.disconnect();
          } catch (e) {}
        }
      });
      if (this.masterGainNode) {
        try {
          this.masterGainNode.disconnect();
        } catch (e) {}
      }
      if (this.audioCtx) {
        try {
          this.audioCtx.close();
        } catch (e) {}
      }
    } catch (e) {
      // ignore
    }

    // Clear timer interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
  methods: {
    onVideoLoaded() {
      this.applyVideoVolume();
    },
    onVideoProgress() {
      const video = this.$refs.video;
      if (!video || !video.duration) return;

      try {
        const buffered = video.buffered;
        if (buffered.length) {
          const end = buffered.end(buffered.length - 1);
          this.videoLoading = Math.min(
            Math.round((end / video.duration) * 100),
            100
          );
        }
      } catch (e) {
        this.videoLoading = 0;
      }
    },
    onVideoCanPlay() {
      this.videoLoaded = true;
      this.videoLoading = 100;
    },
    // --- Timer Methods ---
    startTimer() {
      if (!this.selectedTimerDuration) return;

      this.timeRemaining = this.selectedTimerDuration * 60;
      this.timerRunning = true;

      // Clear any existing interval
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }

      // Set up new interval
      this.timerInterval = setInterval(() => {
        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
          this.timerFinished();
        }
      }, 1000);
    },

    stopTimer() {
      this.timerRunning = false;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.timeRemaining = 0;
    },

    timerFinished() {
      // Stop the timer
      this.stopTimer();

      // Pause video
      if (this.$refs.video && !this.$refs.video.paused) {
        this.$refs.video.pause();
        this.videoPlaying = false;
      }

      // Pause all audio tracks
      this.tracks.forEach((track) => {
        if (track._el && !track._el.paused) {
          track._el.pause();
          track.playing = false;
        }
      });

      // Show notification
      this.$notify({
        title: "Timer Finished",
        text: "Video and audio have been paused.",
        type: "success",
      });
    },

    // --- Video ---
    onVideoLoaded() {
      this.applyVideoVolume();
    },
    toggleVideo() {
      const video = this.$refs.video;
      if (!video) return;
      if (video.paused) {
        video.play();
        this.videoPlaying = true;
      } else {
        video.pause();
        this.videoPlaying = false;
      }
    },
    toggleVideoMute() {
      this.videoMuted = !this.videoMuted;
      const video = this.$refs.video;
      if (video) video.muted = this.videoMuted;
    },
    applyVideoVolume() {
      const video = this.$refs.video;
      if (video) video.volume = this.videoVolume / 100;
    },

    // --- Audio Context lifecycle ---
    toggleAudioContext() {
      if (this.audioReady) return;
      // Lazily create audio context on user gesture
      const AC = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AC();

      this.masterGainNode = this.audioCtx.createGain();
      this.masterGainNode.gain.value = this.masterMute
        ? 0
        : this.masterVolume / 100;
      this.masterGainNode.connect(this.audioCtx.destination);

      // Build nodes for each track
      this.tracks.forEach((track) => this._setupTrack(track));

      this.audioReady = true;
    },
    _setupTrack(track) {
      // Use HTMLAudioElement with MediaElementSource for robust streaming & caching
      const el = new Audio();
      el.src = track.src;
      el.loop = true;
      el.crossOrigin = "anonymous"; // needed if using remote files with CORS
      el.preload = "auto";

      const source = this.audioCtx.createMediaElementSource(el);
      const gain = this.audioCtx.createGain();

      // Connect graph: el -> gain -> master -> destination
      source.connect(gain);
      gain.connect(this.masterGainNode);

      // Persist refs
      track._el = el;
      track._gain = gain;
      track._node = source;

      // Apply initial state
      this.applyTrackGain(track);
      this.applyTrackMute(track);
    },

    // --- Mixer controls ---
    toggleMixer() {
      if (!this.audioReady) return;
      if (this.mixerPlaying) {
        this.tracks.forEach((t) => {
          if (t._el) t._el.pause();
          t.playing = false;
        });
        this.mixerPlaying = false;
      } else {
        // Respect Solo state
        const anySolo = this.tracks.some((t) => t.solo);
        this.tracks.forEach((t) => {
          const shouldPlay = anySolo ? t.solo : true;
          if (t._el) {
            if (shouldPlay) t._el.play();
            else t._el.pause();
            t.playing = shouldPlay;
          }
        });
        this.mixerPlaying = true;
      }
    },
    toggleTrack(track) {
      if (!this.audioReady || !track._el) return;
      if (track.playing) {
        track._el.pause();
        track.playing = false;
      } else {
        track._el.play();
        track.playing = true;
      }
    },
    applyMasterGain() {
      if (!this.masterGainNode) return;
      if (this.masterMute) return; // muted overrides slider
      this.masterGainNode.gain.value = this.masterVolume / 100;
    },
    applyMasterMute() {
      if (!this.masterGainNode) return;
      this.masterGainNode.gain.value = this.masterMute
        ? 0
        : this.masterVolume / 100;
    },
    applyTrackGain(track) {
      if (!track._gain) return;
      const value = (track.volume || 0) / 100;
      // Smooth changes
      try {
        track._gain.gain.cancelScheduledValues(this.audioCtx.currentTime);
        track._gain.gain.linearRampToValueAtTime(
          value,
          this.audioCtx.currentTime + 0.05
        );
      } catch (e) {
        track._gain.gain.value = value;
      }
    },
    applyTrackMute(track) {
      if (!track._gain) return;
      track._gain.gain.value = track.muted ? 0 : track.volume / 100;
    },
    applySolo() {
      if (!this.audioReady) return;
      const anySolo = this.tracks.some((t) => t.solo);
      this.tracks.forEach((t) => {
        const shouldBeAudible = anySolo ? t.solo : !t.muted;
        if (t._gain) t._gain.gain.value = shouldBeAudible ? t.volume / 100 : 0;
        if (this.mixerPlaying && t._el) {
          if (shouldBeAudible) {
            t._el.play();
            t.playing = true;
          } else {
            t._el.pause();
            t.playing = false;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.text-h4 {
  font-family: monospace;
}
</style>
