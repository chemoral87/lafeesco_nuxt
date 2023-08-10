<template>
  <v-card-text class="pt-1 pb-0 text--primary">
    <span class="mr-2">{{ service.event_date | moment("dddd DD MMM") }}</span>
    <strong :class="service.event_name_color">{{ service.event_name }}</strong>
    <strong> {{ service.event_date | moment("hh:mm a") }}</strong>

    <v-chip
      small
      outlined
      :color="'red'"
      v-if="$options.filters.daysDiffFromNow(service.event_date) == 0"
    >
      <strong> HOY </strong>
    </v-chip>
  </v-card-text>
</template>
<script>
export default {
  props: ["service", "showDiffHumanize"],
  data() {
    return {};
  },
  methods: {},
  mounted() {
    let me = this;
  },
};
</script>
