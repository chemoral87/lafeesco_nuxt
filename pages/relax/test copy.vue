<template>
  <div>
    <button @click="toggleMedia">
      {{ isPlaying ? "Pause" : "Play" }}
    </button>

    <!-- Video element -->
    <video
      ref="videoPlayer"
      playsinline
      webkit-playsinline
      muted
      :src="videoSrc"
      class="video-element"
      @ended="handleVideoEnded"
    ></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoSrc: "/videos/relax/relax_crop.mp4",
      audioSrc: "/sounds/relax/calming_rain.mp3",
      isPlaying: false,
      isLooping: true,
      audioPosition: 0,
      audioContext: null,
      audioBuffer: null,
      audioSource: null,
      startTime: 0,
    };
  },
  methods: {
    async toggleMedia() {
      if (this.isPlaying) {
        await this.pauseMedia();
      } else {
        await this.playMedia();
      }
    },

    async setupAudio() {
      try {
        // Create audio context if it doesn't exist
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        // Only fetch and decode if we don't have the buffer
        if (!this.audioBuffer) {
          const response = await fetch(this.audioSrc);
          const arrayBuffer = await response.arrayBuffer();
          this.audioBuffer = await this.audioContext.decodeAudioData(
            arrayBuffer
          );
        }
      } catch (e) {
        console.error("Audio setup failed:", e);
        throw e;
      }
    },

    async playMedia() {
      try {
        const video = this.$refs.videoPlayer;

        // Setup audio first
        await this.setupAudio();

        // Start video (muted)
        await video.play();

        // Create new audio source
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.loop = this.isLooping;

        // Calculate offset for looping
        const duration = this.audioBuffer.duration;
        const offset = this.isLooping
          ? this.audioPosition % duration
          : this.audioPosition;

        // Start audio
        this.startTime = this.audioContext.currentTime;
        this.audioSource.start(0, offset);

        // Unmute video after a brief delay
        setTimeout(() => {
          video.muted = false;
        }, 300);

        this.isPlaying = true;
      } catch (e) {
        console.error("Playback failed:", e);
      }
    },

    async pauseMedia() {
      const video = this.$refs.videoPlayer;

      // Store current audio position before pausing
      if (this.audioSource) {
        this.audioPosition = this.audioContext.currentTime - this.startTime;
        this.audioSource.stop();
        this.audioSource.disconnect();
        this.audioSource = null;
      }

      video.pause();
      this.isPlaying = false;
    },

    handleVideoEnded() {
      if (this.isLooping) {
        this.restartVideo();
      }
    },

    async restartVideo() {
      const video = this.$refs.videoPlayer;
      video.currentTime = 0;
      try {
        await video.play();

        // If audio is playing, restart it too
        if (this.isPlaying) {
          //await this.pauseMedia();
          await this.playMedia();
        }
      } catch (e) {
        console.error("Video restart failed:", e);
      }
    },
  },
  beforeDestroy() {
    // Clean up audio resources when component is destroyed
    if (this.audioSource) {
      this.audioSource.stop();
      this.audioSource.disconnect();
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  },
};
</script>

<style>
.video-element {
  width: 100%;
  max-width: 600px;
}
</style>
