<template>
  <section id="hero">
    <v-parallax :src="isXs ? '/img/bgHeroXs.jpg' : '/img/bgHero.jpg'" height="750">
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row align="center" justify="center">
            <v-col cols="12" md="6" xl="8">
              <h1 class="display-2 font-weight-bold mb-4">La Fe Escobedo</h1>
              <h1 class="font-weight-light">
                Bienvenidos a tu iglesia <br />
                un lugar de adoración.<br />
              </h1>
              <v-btn rounded outlined large @click="$vuetify.goTo('#activities')" class="mt-5" color="white">
                Actividades
                <v-icon class="ml-2">mdi-arrow-down</v-icon>
              </v-btn>
              <div class="video d-flex align-center py-4">
                <a @click.stop="dialog = true" class="playBut">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
                    x="0px"
                    y="0px"
                    width="60px"
                    height="60px"
                    viewBox="0 0 213.7 213.7"
                    enable-background="new 0 0 213.7 213.7"
                    xml:space="preserve"
                  >
                    <polygon
                      class="triangle"
                      id="XMLID_18_"
                      fill="none"
                      stroke-width="7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-miterlimit="10"
                      points="73.5,62.5 148.5,105.8 73.5,149.1 "
                    />

                    <circle
                      class="circle"
                      id="XMLID_17_"
                      fill="none"
                      stroke-width="7"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-miterlimit="10"
                      cx="106.8"
                      cy="106.8"
                      r="103.3"
                    />
                  </svg>
                </a>
                <p @click.stop="dialog = true" class="text-h5 ml-2 mb-0 text-decoration-underline">Hablando con caFé</p>
              </div>
            </v-col>
            <v-col cols="12" md="6" xl="4" class="hidden-sm-and-down"> </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div class="svg-border-waves text-white">
        <v-img src="/img/borderWaves.svg" />
      </div>
    </v-parallax>
    <v-container fluid id="activities" class="mt-2">
      <v-row dense align="center" justify="center">
        <v-col cols="11">
          <v-row align="center" justify="space-around">
            <v-col cols="12" sm="6" md="4" lg="3" class="text-center" v-for="(activity, i) in activities" :key="i">
              <v-hover v-slot:default="{ hover }">
                <v-card class="card" shaped :elevation="hover ? 10 : 4" :class="{ up: hover }">
                  <v-img
                    :src="activity.img"
                    max-width="100px"
                    class="d-block ml-auto mr-auto"
                    :class="{ 'zoom-efect': hover }"
                  ></v-img>
                  <h1 class="font-weight-regular">{{ activity.title }}</h1>
                  <h4 class="font-weight-regular subtitle-1">
                    {{ activity.text }}
                  </h4>
                  <h5 class="font-weight-regular subtitle-2" v-if="activity.schedule">
                    {{ activity.schedule }}
                  </h5>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="640px">
      <v-card>
        <no-ssr placeholder="Loading...">
          <youtube :video-id="videoId" @ready="ready" @playing="playing" :player-width="getMaxWindow()"></youtube>
        </no-ssr>
      </v-card>
    </v-dialog>
    <div class="svg-border-waves">
      <img src="/img/wave2.svg" />
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isXs: window.innerWidth < 850,
      dialog: false,
      videoId: "MTUa6JxKkIE",
      activities: [
        {
          img: "/img/ede.png",
          title: "Escuela de Discípulado y Entrenamiento (EDE) ",
          text: "Entrenamiento para formar líderes.",
          schedule: "Lunes 8pm"
        },
        {
          img: "/img/casa_fe.png",
          title: "Casas de Fe",
          text: "Hogares cumpliendo la visión celular.",
          schedule: "Martes 8pm*"
        },

        {
          img: "/img/reto_valientes.png",
          title: "Reto de Valientes",
          text: "Formación para las familias en Cristo.",
          schedule: "Sábado 4pm"
        },
        {
          img: "/img/reconfortados.png",
          title: "Reconfortados",
          text: "Personas en situación de viudez, separación o padres solteros."
        },
        {
          img: "/img/oracion.png",
          title: "Oración",
          text: "Interseción por peticiones y necesidades.",
          schedule: "Lunes a Viernes 8am"
        },
        {
          img: "/img/jovenes.png",
          title: "Jóvenes Nuevo Horizonte",
          text: "Reunión de jovenes y actividades evangelísticas."
        },
        {
          img: "/img/icon3.png",
          title: "Ados",
          text: "Reunión de adolescentes."
        }
      ]
    };
  },
  watch: {
    dialog(value) {
      if (!value) {
        this.pause();
      }
    }
  },
  methods: {
    ready(event) {
      this.player = event.target;
    },
    playing(event) {
      // The player is playing a video.
    },
    change() {
      // when you change the value, the player will also change.
      // If you would like to change `playerVars`, please change it before you change `videoId`.
      // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
      // If `playerVars.autoplay` is 0, `cueVideoById` will be called.
      this.videoId = "another video id";
    },
    getMaxWindow() {
      if (window.innerWidth < 640) return window.innerWidth - 40;
      else return 640;
    },
    stop() {
      this.player.stopVideo();
    },
    pause() {
      this.player.pauseVideo();
    }
  }
};
</script>

<style lang="scss">
.circle {
  stroke: white;
  stroke-dasharray: 650;
  stroke-dashoffset: 650;
  -webkit-transition: all 0.5s ease-in-out;
  opacity: 0.3;
}

.playBut {
  /*  border: 1px solid red;*/
  display: inline-block;
  -webkit-transition: all 0.5s ease;

  .triangle {
    -webkit-transition: all 0.7s ease-in-out;
    stroke-dasharray: 240;
    stroke-dashoffset: 480;
    stroke: white;
    transform: translateY(0);
  }

  &:hover {
    .triangle {
      stroke-dashoffset: 0;
      opacity: 1;
      stroke: white;
      animation: nudge 0.7s ease-in-out;

      @keyframes nudge {
        0% {
          transform: translateX(0);
        }
        30% {
          transform: translateX(-5px);
        }
        50% {
          transform: translateX(5px);
        }
        70% {
          transform: translateX(-2px);
        }
        100% {
          transform: translateX(0);
        }
      }
    }

    .circle {
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }
}
</style>

<style>
.btn-play {
  transition: 0.2s;
}

.svg-border-waves .v-image {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3rem;
  width: 100%;
  overflow: hidden;
}

#hero {
  z-index: 0;
}
.svg-border-waves img {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-bottom: -2px;
  z-index: -1;
}

.card {
  min-height: 250px;
  padding: 5px;
  transition: 0.5s ease-out;
}

.card .v-image {
  margin-bottom: 10px;
  transition: 0.75s;
}

.card h1 {
  margin-bottom: 5px;
}

.zoom-efect {
  transform: scale(1.1);
}

.up {
  transform: translateY(-20px);
  transition: 0.5s ease-out;
}
</style>

<style>
section {
  position: relative;
}
</style>
