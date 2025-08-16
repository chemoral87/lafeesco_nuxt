<template>
  <div class="video-wrapper">
    <video
      muted
      playsinline
      class="background-video"
      @timeupdate="handleTimeUpdate"
      @ended="handleMediaEnd"
      ref="videoPlayer"
    >
      <source src="/videos/relax/relax_crop.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <audio ref="audioPlayer">
      <source src="/sounds/relax/calming_rain.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <div class="media-controls">
      <div class="duration-selector">
        <label for="duration">Duration (minutes):</label>
        <select id="duration" v-model="selectedDuration">
          <option v-for="minute in durationOptions" :value="minute">
            {{ minute }}
          </option>
        </select>
        <button class="play-button" @click="startPlayback">
          {{ isPlaying ? "⏹ Stop" : "▶ Play" }}
        </button>
      </div>

      <div class="audio-controls">
        <div class="video-volume-control">
          <button class="audio-toggle" @click="toggleVideoMute">
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
            />
          </div>
        </div>

        <div class="audio-volume-control">
          <button class="audio-toggle" @click="toggleAudio">
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
      selectedDuration: 5, // Default duration in minutes
      durationOptions: [1, 3, 5, 10, 15], // Available duration options
      playbackTimer: null,
      elapsedSeconds: 0,
      rainAudioEnabled: false,
      audioBlocked: false,
      volume: 0.2, // Default audio volume (70%)
      voiceAudioEnabled: true, // Video starts muted by default
      videoVolume: 0.7, // Default video volume (70%)
      isPlaying: false,
    };
  },
  computed: {
    durationInSeconds() {
      return this.selectedDuration * 60;
    },
  },
  methods: {
    async startPlayback() {
      if (this.isPlaying) {
        this.stopPlayback();
        return;
      }

      console.log("starPlayback called with duration:", this.selectedDuration);
      this.isPlaying = true;
      this.elapsedSeconds = 0;

      // Start video
      this.$refs.videoPlayer.currentTime = 0;
      //this.$refs.videoPlayer.muted = this.voiceAudioEnabled;
      this.$refs.videoPlayer.muted = false;
      this.$refs.videoPlayer.volume = this.videoVolume;
      this.$refs.videoPlayer.play();

      // Activate and start audio
      if (!this.rainAudioEnabled) await this.$refs.audioPlayer.play();
      this.rainAudioEnabled = true;

      // Start timer
      this.playbackTimer = setInterval(() => {
        this.elapsedSeconds++;

        // Check if duration has been reached
        if (this.elapsedSeconds >= this.durationInSeconds) {
          this.stopPlayback();
        }
      }, 1000);
    },

    stopPlayback() {
      console.log("stopPlayback called");
      this.isPlaying = false;
      this.rainAudioEnabled = false;
      clearInterval(this.playbackTimer);
      this.$refs.videoPlayer.pause();
      this.$refs.audioPlayer.pause();
    },

    handleMediaEnd() {
      console.log(
        "handleMediaEnd called, isPlaying:",
        this.isPlaying,
        "elapsedSeconds:",
        this.elapsedSeconds,
        "durationInSeconds:",
        this.durationInSeconds
      );
      // If media ends naturally before timer, restart it
      if (this.isPlaying && this.elapsedSeconds < this.durationInSeconds) {
        this.$refs.videoPlayer.currentTime = 0;
        this.$refs.videoPlayer.play();
      }
    },

    handleTimeUpdate() {
      const video = this.$refs.videoPlayer;
      if (!video) return;
      // Your existing time update logic (if still needed)
    },

    async toggleAudio() {
      console.log("toggleAudio called, current state:", this.rainAudioEnabled);
      if (this.rainAudioEnabled) {
        this.$refs.audioPlayer.pause();
        this.rainAudioEnabled = false;
      } else {
        try {
          await this.$refs.audioPlayer.play();
          this.rainAudioEnabled = true;
          this.audioBlocked = false;
        } catch (err) {
          console.error("Audio playback error:", err);
          this.audioEnabled = false;
          this.audioBlocked = true;
          alert("Please click the play button first to enable audio");
        }
      }
    },

    toggleVideoMute() {
      this.voiceAudioEnabled = !this.voiceAudioEnabled;
      this.$refs.videoPlayer.muted = !this.voiceAudioEnabled;
    },

    updateVolume() {
      console.log("updateVolume called, new volume:", this.volume);
      this.$refs.audioPlayer.volume = this.volume;
    },

    updateVideoVolume() {
      console.log("updateVideoVolume called, new volume:", this.videoVolume);
      this.$refs.videoPlayer.volume = this.videoVolume;
      if (this.videoVolume > 0 && this.voiceAudioEnabled) {
        this.toggleVideoMute();
      }
    },

    tryUnlockAudio() {
      console.log("tryUnlockAudio called, audioBlocked:", this.audioBlocked);
      if (this.audioBlocked && !this.audioEnabled) {
        this.toggleAudio();
      }
    },
  },
  mounted() {
    // Initialize volumes
    this.$refs.audioPlayer.volume = this.volume;
    this.$refs.videoPlayer.volume = this.videoVolume;
    this.$refs.videoPlayer.muted = this.voiceAudioEnabled;
  },
  beforeDestroy() {
    clearInterval(this.playbackTimer);
    document.removeEventListener("click", this.tryUnlockAudio);
  },
};
</script>

<style scoped>
.video-wrapper {
  background-color: white;
  position: relative;
  width: 70%;
  overflow: hidden;
}

.background-video {
  width: 100%;
  height: 80dvh;
}

.media-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
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
}

.duration-selector label {
  font-size: 14px;
}

.duration-selector select {
  background: rgba(255, 255, 255, 1);
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
}

.play-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  cursor: pointer;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.audio-volume-control,
.video-volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 20px;
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
}

.volume-control {
  width: 80px;
  transition: all 0.3s ease;
}

.volume-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: #555;
  border-radius: 2px;
  outline: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.volume-slider:hover {
  opacity: 1;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

audio {
  display: none;
}
</style>
