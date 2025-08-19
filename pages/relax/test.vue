<template>
  <div>
    <MediaPlayer
      :video-src="'/videos/relax/relax_crop.mp4'"
      :audio-src="'/sounds/relax/calming_rain.mp3'"
    />
    <!-- Your other content -->
  </div>
</template>

<script>
import MediaPlayer from "@/components/MediaPlayer";

export default {
  components: {
    MediaPlayer,
  },
};
</script>
