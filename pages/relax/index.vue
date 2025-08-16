<template>
  <div class="video-wrapper">
    <video
      muted
      playsinline
      class="background-video"
      @timeupdate="handleTimeUpdate"
      @ended="handleMediaEnd"
      ref="videoPlayer"
      loop
      aria-label="Relaxing background video"
    >
      <source src="/videos/relax/relax_crop.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <audio
      ref="audioPlayer"
      crossorigin="anonymous"
      loop
      aria-label="Calming rain audio"
    >
      <source src="/sounds/relax/calming_rain.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <div class="media-controls">
      <div class="duration-selector">
        <label for="duration">Duración (min):</label>
        <select
          id="duration"
          v-model="selectedDuration"
          @change="resetPlayback"
          aria-label="Select duration in minutes"
        >
          <option v-for="minute in durationOptions" :value="minute">
            {{ minute }}
          </option>
        </select>
        <button
          class="play-button"
          @click="togglePlayback"
          aria-label="Play or stop media"
        >
          {{ isPlaying ? "⏹ Stop" : "▶ Play" }}
        </button>
      </div>

      <div class="audio-controls">
        <div class="video-volume-control">
          <button
            class="audio-toggle"
            @click="toggleVideoMute"
            :title="voiceAudioEnabled ? 'Mute video' : 'Unmute video'"
            aria-label="Toggle video mute"
          >
            {{ voiceAudioEnabled ? "🔊" : "🔇" }}
          </button>
          <div class="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="videoVolume"
              @input="updateVideoVolume"
              class="volume-slider"
              aria-label="Video volume control"
            />
          </div>
        </div>

        <div class="audio-volume-control">
          <button
            class="audio-toggle"
            @click="toggleAudio"
            :title="
              rainAudioEnabled ? 'Disable rain sound' : 'Enable rain sound'
            "
            aria-label="Toggle rain sound"
          >
            {{ rainAudioEnabled ? "🌧️" : "☁️" }}
          </button>
          <div class="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model="volume"
              @input="updateVolume"
              class="volume-slider"
              aria-label="Rain sound volume control"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      selectedDuration: 5,
      durationOptions: [1, 3, 5, 10, 15],
      playbackTimer: null,
      elapsedSeconds: 0,
      rainAudioEnabled: true,
      audioBlocked: false,
      volume: 0.2,
      voiceAudioEnabled: true,
      videoVolume: 0.7,
      isPlaying: false,
      audioContext: null,
      audioSource: null,
      gainNode: null,
      requiresUserInteraction: true,
      interactionListeners: [],
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      audioPlayAttempts: 0,
      maxAudioPlayAttempts: 3,
    };
  },
  computed: {
    durationInSeconds() {
      return this.selectedDuration * 60;
    },
    remainingTime() {
      return Math.max(0, this.durationInSeconds - this.elapsedSeconds);
    },
  },
  methods: {
    // Add the missing timeupdate handler
    handleTimeUpdate() {
      // This can be used to sync elements with video playback if needed
      // Currently just a placeholder since we're tracking time with elapsedSeconds
    },

    async setupAudioContext() {
      if (!this.audioContext) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioContext = new AudioContext();
          this.gainNode = this.audioContext.createGain();
          this.gainNode.connect(this.audioContext.destination);

          this.$refs.audioPlayer.crossOrigin = "anonymous";
          this.audioSource = this.audioContext.createMediaElementSource(
            this.$refs.audioPlayer
          );
          this.audioSource.connect(this.gainNode);

          this.gainNode.gain.value = this.volume;
          this.requiresUserInteraction =
            this.audioContext.state === "suspended";
        } catch (error) {
          console.error("Error setting up audio context:", error);
          this.audioBlocked = true;
          this.audioContext = null;
        }
      }

      if (this.audioContext && this.audioContext.state === "suspended") {
        try {
          await this.audioContext.resume();
          this.requiresUserInteraction = false;
        } catch (error) {
          console.error("Error resuming audio context:", error);
          this.requiresUserInteraction = true;
        }
      }
    },

    async safeAudioPlay() {
      try {
        if (!this.isPlaying) {
          this.audioPlayAttempts = 0;
        }

        if (this.isMobile) {
          this.$refs.audioPlayer.load();
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        await this.$refs.audioPlayer.play();
        this.audioPlayAttempts = 0;
      } catch (error) {
        console.log(
          `Audio play attempt ${this.audioPlayAttempts + 1} failed:`,
          error
        );
        this.audioPlayAttempts++;

        if (this.audioPlayAttempts < this.maxAudioPlayAttempts) {
          const delay = Math.min(
            100 * Math.pow(2, this.audioPlayAttempts),
            1000
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.safeAudioPlay();
        } else {
          console.error("Max audio play attempts reached");
          this.requiresUserInteraction = true;
          throw error;
        }
      }
    },

    async handleFirstInteraction() {
      if (this.requiresUserInteraction && this.audioContext) {
        try {
          await this.audioContext.resume();
          this.requiresUserInteraction = false;

          if (this.isPlaying && this.rainAudioEnabled) {
            await this.safeAudioPlay();
          }
        } catch (error) {
          console.error("Error handling first interaction:", error);
        }
      }
    },

    async togglePlayback() {
      if (this.isPlaying) {
        this.stopPlayback();
      } else {
        await this.startPlayback();
      }
    },

    async startPlayback() {
      try {
        await this.setupAudioContext();

        this.isPlaying = true;
        this.elapsedSeconds = 0;
        this.rainAudioEnabled = true;

        this.$refs.videoPlayer.currentTime = 0;
        this.$refs.videoPlayer.muted = !this.voiceAudioEnabled;
        this.$refs.videoPlayer.volume = this.videoVolume;
        await this.$refs.videoPlayer.play();

        this.$refs.audioPlayer.currentTime = 0;
        if (!this.requiresUserInteraction) {
          await this.safeAudioPlay();
        }

        this.playbackTimer = setInterval(() => {
          this.elapsedSeconds++;
          if (this.elapsedSeconds >= this.durationInSeconds) {
            this.stopPlayback();
          }
        }, 1000);
      } catch (error) {
        console.error("Playback error:", error);
        this.stopPlayback();
      }
    },

    stopPlayback() {
      clearInterval(this.playbackTimer);
      this.isPlaying = false;
      this.$refs.videoPlayer.pause();
      this.$refs.audioPlayer.pause();
      this.audioPlayAttempts = 0;
    },

    resetPlayback() {
      if (this.isPlaying) {
        this.stopPlayback();
        this.startPlayback();
      }
    },

    async handleMediaEnd() {
      if (!this.isPlaying) return;

      try {
        this.$refs.videoPlayer.currentTime = 0;
        await this.$refs.videoPlayer.play();

        if (this.rainAudioEnabled) {
          if (this.isMobile) {
            this.$refs.audioPlayer.currentTime = 0;
            this.$refs.audioPlayer.load();
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          await this.safeAudioPlay();
        }
      } catch (error) {
        console.error("Media loop error:", error);
      }
    },

    async toggleAudio() {
      this.rainAudioEnabled = !this.rainAudioEnabled;

      if (this.rainAudioEnabled && this.isPlaying) {
        await this.safeAudioPlay();
      } else {
        this.$refs.audioPlayer.pause();
      }
    },

    toggleVideoMute() {
      this.voiceAudioEnabled = !this.voiceAudioEnabled;
      this.$refs.videoPlayer.muted = !this.voiceAudioEnabled;
    },

    updateVolume() {
      if (this.gainNode) {
        this.gainNode.gain.value = this.volume;
      } else {
        this.$refs.audioPlayer.volume = this.volume;
      }
    },

    updateVideoVolume() {
      this.$refs.videoPlayer.volume = this.videoVolume;
      if (this.videoVolume > 0 && !this.voiceAudioEnabled) {
        this.toggleVideoMute();
      }
    },
  },
  mounted() {
    this.$refs.audioPlayer.volume = this.volume;
    this.$refs.videoPlayer.volume = this.videoVolume;
    this.$refs.videoPlayer.muted = !this.voiceAudioEnabled;

    const interactionEvents = ["click", "touchstart", "keydown"];
    const handler = this.handleFirstInteraction.bind(this);

    interactionEvents.forEach((event) => {
      document.addEventListener(event, handler, { passive: true });
      this.interactionListeners.push({ event, handler });
    });

    if (this.isMobile) {
      document.addEventListener("visibilitychange", () => {
        if (
          document.visibilityState === "visible" &&
          this.isPlaying &&
          this.rainAudioEnabled
        ) {
          this.safeAudioPlay();
        }
      });
    }
  },
  beforeDestroy() {
    this.stopPlayback();
    if (this.audioSource) {
      this.audioSource.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    if (this.audioContext) {
      this.audioContext
        .close()
        .catch((e) => console.error("Error closing audio context:", e));
    }

    this.interactionListeners.forEach(({ event, handler }) => {
      document.removeEventListener(event, handler);
    });

    if (this.isMobile) {
      document.removeEventListener(
        "visibilitychange",
        this.handleVisibilityChange
      );
    }
  },
  watch: {
    rainAudioEnabled(newVal) {
      if (newVal && this.isPlaying) {
        this.safeAudioPlay();
      }
    },
  },
};
</script>

<style scoped>
.video-wrapper {
  position: relative;
  width: 70%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  background-color: #000;
}

.background-video {
  width: 100%;
  height: 90dvh;
  display: block;
}

.media-controls {
  font-size: 1.2rem;
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  z-index: 10;
}

.duration-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 20px;
  color: white;
  backdrop-filter: blur(5px);
}

.duration-selector label {
  font-size: 14px;
  white-space: nowrap;
}

.duration-selector select {
  background: white;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.play-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  min-width: 80px;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.audio-volume-control,
.video-volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
}

.audio-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.audio-toggle:hover {
  transform: scale(1.1);
}

.volume-control {
  width: 80px;
}

.volume-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  background: #555;
  border-radius: 5px;
  outline: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.volume-slider:hover {
  opacity: 1;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

audio {
  display: none;
}

@media (max-width: 768px) {
  .video-wrapper {
    width: 100%;
  }

  .media-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .duration-selector {
    order: 1;
  }

  .audio-controls {
    order: 2;
    justify-content: space-between;
    width: 100%;
  }
}
</style>
