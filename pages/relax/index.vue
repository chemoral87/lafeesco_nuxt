<template>
  <div class="media-container">
    <!-- Video element -->
    <video
      ref="videoPlayer"
      playsinline
      webkit-playsinline
      :muted="videoMuted"
      :src="videoSrc"
      class="video-element"
      loop
    ></video>

    <!-- Rain audio element -->
    <audio ref="rainAudio" :src="audioSrc" loop style="display: none"></audio>

    <div class="media-controls">
      <div class="duration-selector">
        <label for="duration">Duración (minz):</label>
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
          @click="toggleMedia"
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
            :title="videoMuted ? 'Unmute video' : 'Mute video'"
            aria-label="Toggle video mute"
          >
            {{ videoMuted ? "🔇" : "🔊" }}
          </button>
          <div class="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model.number="videoVolume"
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
            :title="audioEnabled ? 'Disable rain sound' : 'Enable rain sound'"
            aria-label="Toggle rain sound"
          >
            {{ audioEnabled ? "🌧️" : "☁️" }}
          </button>
          <div class="volume-control">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              v-model.number="audioVolume"
              @input="updateAudioVolume"
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
  data() {
    return {
      videoSrc: "/videos/relax/relax_crop.mp4",
      audioSrc: "/sounds/relax/calming_rain.mp3",
      videoMuted: false,
      videoVolume: 1.0,
      audioEnabled: true,
      audioVolume: 0.5,
      selectedDuration: 10,
      durationOptions: [1, 5, 10, 15, 30, 45, 60],
      isPlaying: false,
      stopTimeout: null,
      showIosWarning: false,
      isIos: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
      iosAudioContext: null,
      iosAudioSource: null,
      audioBuffer: null,
    };
  },
  methods: {
    async toggleMedia() {
      if (this.isPlaying) {
        this.stopMedia();
        return;
      }

      const video = this.$refs.videoPlayer;
      video.currentTime = 0;

      // Configurar el event listener para el loop del video
      video.addEventListener("timeupdate", this.handleVideoLoop);

      try {
        await video.play();
      } catch (err) {
        console.warn("Video play error:", err);
      }

      if (this.audioEnabled) {
        await this.playAudioWithFallback();
      }

      this.isPlaying = true;
      this.scheduleAutoStop();
    },

    async playAudioWithFallback() {
      const audio = this.$refs.rainAudio;
      audio.volume = this.audioVolume;

      try {
        await audio.play();
      } catch (err) {
        console.warn("Standard audio play failed, trying iOS workaround:", err);

        try {
          if (!this.iosAudioContext) {
            const AudioContext =
              window.AudioContext || window.webkitAudioContext;
            this.iosAudioContext = new AudioContext();
          }

          if (!this.audioBuffer) {
            const response = await fetch(this.audioSrc);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.iosAudioContext.decodeAudioData(
              arrayBuffer
            );
          }

          const source = this.iosAudioContext.createBufferSource();
          source.buffer = this.audioBuffer;
          source.loop = true;
          source.connect(this.iosAudioContext.destination);
          source.start(0);

          this.iosAudioSource = source;

          if (this.iosAudioContext.state === "suspended") {
            await this.iosAudioContext.resume();
          }
        } catch (fallbackErr) {
          console.error("iOS audio fallback failed:", fallbackErr);
          throw fallbackErr;
        }
      }
    },

    handleVideoLoop() {
      const video = this.$refs.videoPlayer;
      // Cuando el video está cerca de reiniciarse (último 1%)
      if (video.currentTime > video.duration * 0.99) {
        this.restartAudioSync();
      }
    },
    stopMedia() {
      const video = this.$refs.videoPlayer;
      video.pause();
      video.currentTime = 0;
      video.removeEventListener("timeupdate", this.handleVideoLoop);

      const audio = this.$refs.rainAudio;
      audio.pause();
      audio.currentTime = 0;

      if (this.iosAudioSource) {
        this.iosAudioSource.stop();
        this.iosAudioSource.disconnect();
        this.iosAudioSource = null;
      }

      this.isPlaying = false;
      clearTimeout(this.stopTimeout);
    },

    scheduleAutoStop() {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = setTimeout(() => {
        this.stopMedia();
      }, this.selectedDuration * 60 * 1000);
    },

    resetPlayback() {
      if (this.isPlaying) {
        this.stopMedia();
        this.toggleMedia();
      }
    },
    async restartAudioSync() {
      if (!this.audioEnabled) return;

      // Para el audio estándar
      const audio = this.$refs.rainAudio;
      audio.currentTime = 0;
      if (this.isPlaying) {
        try {
          await audio.play();
        } catch (err) {
          console.warn("Audio restart error:", err);
        }
      }

      // Para el fallback de iOS
      if (this.iosAudioSource && this.iosAudioContext) {
        this.iosAudioSource.stop();

        const newSource = this.iosAudioContext.createBufferSource();
        newSource.buffer = this.audioBuffer;
        newSource.loop = true;
        newSource.connect(this.iosAudioContext.destination);
        newSource.start(0);

        this.iosAudioSource = newSource;
      }
    },
    toggleVideoMute() {
      this.videoMuted = !this.videoMuted;
      this.$refs.videoPlayer.muted = this.videoMuted;
    },

    updateVideoVolume() {
      this.$refs.videoPlayer.volume = this.videoVolume;
      this.videoMuted = this.videoVolume === 0;
      this.$refs.videoPlayer.muted = this.videoMuted;
    },

    toggleAudio() {
      this.audioEnabled = !this.audioEnabled;
      if (this.isPlaying) {
        if (this.audioEnabled) {
          this.playAudioWithFallback().catch((err) => {
            console.warn("Audio play failed:", err);
          });
        } else {
          this.stopAudio();
        }
      }
    },

    stopAudio() {
      const audio = this.$refs.rainAudio;
      audio.pause();
      audio.currentTime = 0;

      if (this.iosAudioSource) {
        this.iosAudioSource.stop();
        this.iosAudioSource.disconnect();
        this.iosAudioSource = null;
      }
    },

    updateAudioVolume() {
      const audio = this.$refs.rainAudio;
      audio.volume = this.audioVolume;

      if (this.iosAudioSource && this.iosAudioContext) {
        // Para control de volumen en AudioContext necesitarías un GainNode
      }

      if (this.audioVolume === 0) {
        this.audioEnabled = false;
      } else if (!this.audioEnabled) {
        this.audioEnabled = true;
      }
    },

    preloadAudio() {
      if (this.isIos) {
        const audio = new Audio(this.audioSrc);
        audio.load();
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.preloadAudio, { once: true });
  },
  beforeDestroy() {
    clearTimeout(this.stopTimeout);
    this.stopMedia();

    if (this.iosAudioContext) {
      this.iosAudioContext.close();
    }

    document.removeEventListener("click", this.preloadAudio);
  },
};
</script>

<style>
.media-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.video-element {
  width: 100%;
  display: block;
  background: #000;
}

.media-controls {
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
}

.duration-selector {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.play-button {
  padding: 8px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.play-button:hover {
  background: #45a049;
}

.audio-controls {
  display: flex;
  gap: 25px;
  justify-content: center;
}

.video-volume-control,
.audio-volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.audio-toggle {
  background: none;
  border: none;
  font-size: 1.4em;
  cursor: pointer;
  padding: 5px;
  transition: transform 0.2s;
}

.audio-toggle:hover {
  transform: scale(1.1);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 5px;
}

.volume-slider {
  width: 100px;
  cursor: pointer;
}

select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background: white;
}

label {
  color: white;
  font-weight: bold;
}

@media (max-width: 600px) {
  .audio-controls {
    flex-direction: column;
    gap: 15px;
  }

  .media-controls {
    padding: 10px;
  }
}
</style>
