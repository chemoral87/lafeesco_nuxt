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
      durationOptions: [1, 5, 10, 15],
      isPlaying: false,
      stopTimeout: null,
    };
  },
  methods: {
    toggleMedia() {
      if (this.isPlaying) {
        this.stopMedia();
        return;
      }

      const video = this.$refs.videoPlayer;
      video.currentTime = 0;

      // First play video (muted autoplay usually works)
      video.play().catch((err) => console.warn("Video play error:", err));

      // For audio, create a new audio context on user gesture
      if (this.audioEnabled) {
        this.playAudioWithFallback();
      }

      this.isPlaying = true;
      this.scheduleAutoStop();
    },

    async playAudioWithFallback() {
      const audio = this.$refs.rainAudio;
      audio.volume = this.audioVolume;

      try {
        // First try standard play
        await audio.play();
      } catch (err) {
        console.warn("Standard audio play failed, trying iOS workaround:", err);

        // iOS workaround - create and start a new audio context
        try {
          // Create new audio context on user gesture
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioContext = new AudioContext();

          // Fetch and decode audio
          const response = await fetch(this.audioSrc);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Create and start source
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.loop = true;
          source.connect(audioContext.destination);
          source.start(0);

          // Store for later cleanup
          this.iosAudioSource = source;
          this.iosAudioContext = audioContext;
        } catch (fallbackErr) {
          console.error("iOS audio fallback failed:", fallbackErr);
        }
      }
    },

    playMedia() {
      const video = this.$refs.videoPlayer;
      video.currentTime = 0;
      video.play().catch((err) => console.warn("Video play blocked:", err));

      if (this.audioEnabled) {
        const audio = this.$refs.rainAudio;
        audio.volume = this.audioVolume;
        audio.play().catch((err) => console.warn("Audio play blocked:", err));
      }

      this.isPlaying = true;

      // Stop after selected duration
      clearTimeout(this.stopTimeout);
      this.stopTimeout = setTimeout(() => {
        this.stopMedia();
      }, this.selectedDuration * 60 * 1000);
    },
    stopMedia() {
      const video = this.$refs.videoPlayer;
      video.pause();
      video.currentTime = 0;

      // Stop standard audio
      const audio = this.$refs.rainAudio;
      audio.pause();
      audio.currentTime = 0;

      // Stop iOS fallback audio if exists
      if (this.iosAudioSource) {
        this.iosAudioSource.stop();
        this.iosAudioSource = null;
      }
      if (this.iosAudioContext) {
        this.iosAudioContext.close();
        this.iosAudioContext = null;
      }

      this.isPlaying = false;
      clearTimeout(this.stopTimeout);
    },

    resetPlayback() {
      if (this.isPlaying) {
        this.stopMedia();
        this.playMedia();
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
      const audio = this.$refs.rainAudio;
      if (this.audioEnabled && this.isPlaying) {
        audio.volume = this.audioVolume;
        audio.play().catch((err) => console.warn("Audio play blocked:", err));
      } else {
        audio.pause();
      }
    },

    updateAudioVolume() {
      const audio = this.$refs.rainAudio;
      audio.volume = this.audioVolume;
      if (this.audioVolume === 0) {
        this.audioEnabled = false;
        audio.pause();
      } else if (!this.audioEnabled) {
        this.audioEnabled = true;
      }
    },
  },
  beforeDestroy() {
    clearTimeout(this.stopTimeout);
    this.stopMedia(); // This will now clean up both audio sources
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
