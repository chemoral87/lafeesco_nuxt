<template>
  <div class="video-wrapper">
    <video
      autoplay
      muted
      loop
      playsinline
      class="background-video"
      @timeupdate="handleTimeUpdate"
      ref="videoPlayer"
    >
      <source src="/videos/relax/relax_crop.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <!-- Hidden audio element that loops -->
    <audio ref="audioPlayer" autoplay loop>
      <source src="/sounds/relax/calming_rain.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <div class="audio-controls">
      <button class="audio-toggle" @click="toggleAudio">
        {{ audioEnabled ? "🔊" : "🔇" }}
      </button>

      <div class="volume-control" v-show="audioEnabled">
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
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      lastTime: -1, // Track the last recorded time
      audioEnabled: false,
      audioBlocked: false,
      volume: 0.7, // Default volume (70%)
      isDraggingVolume: false,
    };
  },
  methods: {
    initAudio() {
      const audio = this.$refs.audioPlayer;
      audio.volume = this.volume;

      // Try to play immediately (may be blocked by browser)
      this.playAudio().catch((e) => {
        console.log("Initial autoplay blocked:", e);
        this.audioBlocked = true;
      });
    },

    // New method to try playing audio
    async playAudio() {
      try {
        await this.$refs.audioPlayer.play();
        this.audioEnabled = true;
        this.audioBlocked = false;
        return true;
      } catch (err) {
        console.error("Audio playback error:", err);
        this.audioEnabled = false;
        this.audioBlocked = true;
        return false;
      }
    },

    // New method to try unlocking audio on user interaction
    tryUnlockAudio() {
      if (this.audioBlocked && !this.audioEnabled) {
        this.playAudio().then((success) => {
          if (success) {
            console.log("Audio unlocked after user interaction");
          }
        });
      }
    },

    // Modified toggleAudio method
    async toggleAudio() {
      const audio = this.$refs.audioPlayer;

      if (this.audioEnabled) {
        audio.pause();
        this.audioEnabled = false;
      } else {
        const success = await this.playAudio();
        if (!success) {
          // Show some UI indication that audio is blocked
          alert("Please click anywhere on the page to enable audio");
        }
      }
    },
    updateVolume() {
      this.$refs.audioPlayer.volume = this.volume;

      // Automatically unmute if volume is increased from 0
      if (this.volume > 0 && !this.audioEnabled) {
        this.toggleAudio();
      }

      // Automatically mute if volume set to 0
      if (this.volume === 0 && this.audioEnabled) {
        this.toggleAudio();
      }
    },
    muteVolume() {
      this.volume = 0;
      this.updateVolume();
    },
    maximizeVolume() {
      this.volume = 1;
      this.updateVolume();
    },
    handleTimeUpdate() {
      const video = this.$refs.videoPlayer;
      if (!video) return;

      // Detect when the video loops (time jumps back to near 0)
      if (this.lastTime > video.currentTime) {
        console.log("Video looped! Restarting playback.");
        // Your custom logic here (runs every loop)
      }
      this.lastTime = video.currentTime;
    },
  },
  mounted() {
    const video = this.$refs.videoPlayer;
    if (video) {
      this.lastTime = video.currentTime;
    }

    // Initialize audio with better autoplay handling
    this.initAudio();

    // Try to play audio when user interacts with the page
    document.addEventListener("click", this.tryUnlockAudio, { once: true });
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

.audio-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px 12px;
  border-radius: 20px;
  z-index: 10;
}

.audio-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
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
