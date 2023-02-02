<template>
  <section id="contact">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-row align="center" justify="center">
            <v-col sm="4" class="hidden-xs-only">
              <!-- <v-img
                src="/img/ill2.svg"
                class="d-block ml-auto mr-auto"
                max-width="350px"
              /> -->
              <v-img
                src="/img/mapita.png"
                class="d-block ml-auto mr-auto"
                max-width="300px"
              />
            </v-col>
            <v-col cols="12" sm="8" class="white--text text-left">
              <span class="font-weight-light text-h3 mb-2">Contacto</span>
              <br />
              <span class="font-weight-light text-sm-h4">
                Ayuntamiento 108, Col. Joyas de Anahuac<br />
                66057 Cd Gral Escobedo, N.L., México
              </span>
              <br />
              <v-btn
                rounded
                outlined
                href="https://goo.gl/maps/fsAoiGp5CDwHFa3a8"
                target="_blank"
                large
                color="white"
                class="mt-4"
              >
                <v-icon class="mr-2"> mdi-map-marker </v-icon>
                Google Maps
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
#contact {
  /* background-image: url("~@/assets/img/bgDownload.jpg"); */
  background-image: url("/img/bgdrawer.png");
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 500px;
}

#contact .container,
#contact .row {
  height: 100%;
}
</style>
