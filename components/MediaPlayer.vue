<template>
  <div class="media-player">
    <!-- Video Container -->
    <div class="video-container">
      <video
        ref="videoPlayer"
        class="video-element"
        playsinline
        webkit-playsinline
        preload="auto"
        @click="togglePlay"
        @ended="handleVideoEnded"
      ></video>

      <!-- Play/Pause Button Overlay -->
      <div class="controls-overlay" @click="togglePlay">
        <button class="play-button">
          <span v-if="isPlaying">⏸</span>
          <span v-else>▶</span>
        </button>
      </div>

      <!-- Loading Indicator -->
      <div v-if="!isMediaReady" class="loading-indicator">
        Loading... {{ loadingProgress }}%
      </div>
    </div>

    <!-- Hidden Audio Element for Rain Sound -->
    <audio ref="audioPlayer" loop></audio>

    <!-- Debug Console -->
    <div class="debug-console">
      <div class="console-header">
        <h3>Debug Console</h3>
        <button @click="clearLogs">Clear Logs</button>
        <button @click="toggleMute" class="mute-button">
          {{ isMuted ? "🔇 Unmute" : "🔊 Mute" }}
        </button>
      </div>
      <div class="log-container">
        <div v-for="(log, index) in debugLogs" :key="index" :class="log.type">
          [{{ log.timestamp }}] {{ log.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoSrc: {
      type: String,
      required: true,
    },
    audioSrc: {
      type: String,
      default: "/sounds/relax/calming_rain.mp3",
    },
  },
  data() {
    return {
      isPlaying: false,
      isMediaReady: false,
      isMuted: false,
      loadingProgress: 0,
      debugLogs: [],
      mediaLoadTimeout: null,
    };
  },
  mounted() {
    this.addLog("Player initialized");
    this.setupPlayer();
  },
  beforeDestroy() {
    this.cleanup();
  },
  methods: {
    handleVideoEnded() {
      const video = this.$refs.videoPlayer;
      const audio = this.$refs.audioPlayer;

      this.addLog("Video ended, restarting manually");

      // Restart both in sync
      video.currentTime = 0;
      audio.currentTime = 0;

      // Ensure play() is re-triggered as a gesture continuation
      Promise.all([video.play(), audio.play()])
        .then(() => {
          this.addLog("Video + Audio restarted");
        })
        .catch((err) => {
          this.addLog(`Restart failed: ${err.message}`, "error");
        });
    },
    // Logging methods
    addLog(message, type = "log") {
      const timestamp = new Date().toLocaleTimeString();
      this.debugLogs.push({ message, type, timestamp });
      if (type === "error") {
        console.error(message);
      } else {
        console.log(message);
      }
    },

    clearLogs() {
      this.debugLogs = [];
      this.addLog("Logs cleared");
    },

    // Player methods
    setupPlayer() {
      const video = this.$refs.videoPlayer;
      const audio = this.$refs.audioPlayer;

      // Add cache busting
      const cacheBuster = `t=${Date.now()}`;
      video.src = this.videoSrc.includes("?")
        ? `${this.videoSrc}&${cacheBuster}`
        : `${this.videoSrc}?${cacheBuster}`;

      audio.src = this.audioSrc.includes("?")
        ? `${this.audioSrc}&${cacheBuster}`
        : `${this.audioSrc}?${cacheBuster}`;

      this.addLog(`Video source set: ${video.src}`);
      this.addLog(`Audio source set: ${audio.src}`);

      // Event listeners for video
      video.addEventListener("progress", () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          this.loadingProgress = Math.min(
            100,
            Math.round((bufferedEnd / (video.duration || 1)) * 100)
          );
        }
      });

      const checkReady = () => {
        if (
          video.readyState >= 3 &&
          audio.readyState >= 3 &&
          !this.isMediaReady
        ) {
          this.isMediaReady = true;
          this.addLog("Both video and audio ready to play");
          clearTimeout(this.mediaLoadTimeout);
        }
      };

      video.addEventListener("canplay", checkReady);
      audio.addEventListener("canplay", checkReady);

      video.addEventListener("error", () => {
        this.addLog(
          `Video error: ${video.error ? video.error.message : "Unknown error"}`,
          "error"
        );
      });

      audio.addEventListener("error", () => {
        this.addLog(
          `Audio error: ${audio.error ? audio.error.message : "Unknown error"}`,
          "error"
        );
      });

      // Timeout for loading
      this.mediaLoadTimeout = setTimeout(() => {
        if (!this.isMediaReady) {
          this.addLog("Media loading timeout", "error");
        }
      }, 30000);
    },

    async togglePlay() {
      const video = this.$refs.videoPlayer;
      const audio = this.$refs.audioPlayer;

      try {
        if (this.isPlaying) {
          video.pause();
          audio.pause();
          this.isPlaying = false;
          this.addLog("Playback paused");
        } else {
          await Promise.all([video.play(), audio.play()]);
          this.isPlaying = true;
          this.addLog("Playback started");
        }
      } catch (error) {
        this.addLog(`Playback failed: ${error.message}`, "error");
        // iOS/Brave fallback - try muted playback
        try {
          video.muted = true;
          await Promise.all([video.play(), audio.play()]);
          this.isPlaying = true;
          this.addLog("Muted playback started");
        } catch (mutedError) {
          this.addLog(`Muted playback failed: ${mutedError.message}`, "error");
        }
      }
    },

    toggleMute() {
      const audio = this.$refs.audioPlayer;
      this.isMuted = !this.isMuted;
      audio.muted = this.isMuted;
      this.addLog(`Audio ${this.isMuted ? "muted" : "unmuted"}`);
    },

    cleanup() {
      clearTimeout(this.mediaLoadTimeout);
      const video = this.$refs.videoPlayer;
      const audio = this.$refs.audioPlayer;
      if (video) {
        video.pause();
        video.src = "";
      }
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      this.addLog("Player cleaned up");
    },
  },
};
</script>

<style scoped>
.media-player {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.video-container {
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-element {
  width: 100%;
  display: block;
  cursor: pointer;
}

.controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.play-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-button:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.loading-indicator {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
}

.debug-console {
  background: #1e1e1e;
  color: #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  font-family: monospace;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.console-header button {
  background: #3a3d41;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
}

.mute-button {
  margin-left: auto;
}

.log-container {
  height: 200px;
  overflow-y: auto;
  padding: 10px;
  background: #252526;
  border-radius: 4px;
}

.log {
  color: #b5cea8;
  margin: 5px 0;
}

.error {
  color: #f48771;
  margin: 5px 0;
}

/* Scrollbar styles */
.log-container::-webkit-scrollbar {
  width: 8px;
}

.log-container::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.log-container::-webkit-scrollbar-thumb {
  background: #3e3e42;
  border-radius: 4px;
}
</style>
