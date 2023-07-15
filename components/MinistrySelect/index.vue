<template>
  <v-select
    :value="internalSelectedMinistries"
    @input="$emit('input', $event)"
    outlined
    item-value="id"
    item-text="name"
    :items="ministries"
    label="Ministerios"
    multiple
    hide-details=""
  >
    <template v-slot:prepend-item>
      <v-list-item ripple @mousedown.prevent @click="toggle">
        <v-list-item-action>
          <v-icon :color="internalSelectedMinistries.length > 0 ? 'indigo darken-4' : ''">
            {{ icon }}
          </v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title> Todos </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mt-2"></v-divider>
    </template>
  </v-select>
</template>
<script>
export default {
  props: ['ministries', 'value'],
  data() {
    return {
      // selectedMinistries: this.value
      internalSelectedMinistries: this.value || []
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllMinistry || this.likesSomeMinistry) {
          this.internalSelectedMinistries = []
        } else {
          this.internalSelectedMinistries = this.ministries.map((x) => x.id) // this.ministries.slice()
        }
        // this.$emit('change', this.selectedMinistries)
      })
    }
  },
  watch: {
    value(newVal) {
      this.internalSelectedMinistries = newVal
    },
    internalSelectedMinistries(newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    likesAllMinistry() {
      return this.internalSelectedMinistries.length === this.ministries.length
    },
    likesSomeMinistry() {
      return this.internalSelectedMinistries.length > 0 && !this.likesAllMinistry
    },
    icon() {
      if (this.likesAllMinistry) return 'mdi-close-box'
      else if (this.likesSomeMinistry) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  }
}
</script>
