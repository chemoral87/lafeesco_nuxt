<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6"> <v-textarea v-model="prompt" label="Versículos"></v-textarea></v-col>
      <v-col cols="auto">
        <v-btn @click="getVersicles()"> Buscar </v-btn>
      </v-col>
      <v-col cols="auto"> <v-checkbox v-model="see_sub" label="Ver Sub"></v-checkbox></v-col>
      <v-col cols="auto">
        <v-radio-group v-model="display_versicles">
          <v-radio label="Card" value="Card"></v-radio>
          <v-radio label="Text" value="Text"></v-radio> </v-radio-group
      ></v-col>
    </v-row>
    <v-row v-if="display_versicles == 'Card'">
      <v-col cols="12" sm="6" md="4" v-for="(versicle, ix) in versicles" :key="'x' + ix">
        <v-card>
          <v-card-title>
            {{ versicle.book.name }}
            {{ versicle.chapter }}.{{ versicle.verse }}<template v-if="versicle.verseTo">-{{ versicle.verseTo }}</template>
          </v-card-title>
          <v-card-text>
            <span v-for="(verse, iy) in versicle.versicles" :key="'y' + iy">
              <sup v-if="see_sub">{{ verse.verse }}</sup> {{ verse.text }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="display_versicles == 'Text'">
      <v-col cols="12">
        <div v-for="(versicle, ix) in versicles" :key="'w' + ix">
          <template v-if="!versicle.prompt">
            <strong>
              {{ versicle.book.name }} {{ versicle.chapter }}.{{ versicle.verse
              }}<template v-if="versicle.verseTo">-{{ versicle.verseTo }}</template></strong
            >
            <span v-for="(verse, iy) in versicle.versicles" :key="'y' + iy">
              <sup v-if="see_sub">{{ verse.verse }}</sup> {{ verse.text }}
            </span>
          </template>
          <template v-else>
            <strong> {{ versicle.prompt }} </strong> <span class="red--text">no se encontró</span>
          </template>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      prompt: 'is 1.1;is 3.4-5',
      versicles: [],
      see_sub: true,
      display_versicles: 'Text'
    }
  },
  methods: {
    getVersicles() {
      // this.$route.query.s = this.prompt
      this.$router.push({ path: this.$route.path, query: { s: this.prompt } })
      this.$repository.Bible.index({ prompt: this.prompt }).then((resp) => {
        this.versicles = resp
      })
    }
  },
  mounted() {
    let me = this
    if (this.$route.query.s) {
      this.prompt = this.$route.query.s
      this.$repository.Bible.index({ prompt: this.prompt }).then((resp) => {
        this.versicles = resp
        // console.log(resp)
      })
    }
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Biblia',
      icon: 'book'
    })
  }
}
</script>
