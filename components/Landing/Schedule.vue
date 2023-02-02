<template>
  <section id="schedule">
    <v-container fluid>
      <v-row dense align="center" justify="center">
        <v-col cols="10">
          <v-row dense align="center" justify="center">
            <v-col cols="12">
              <h1 class="font-weight-light display-2">Horarios</h1>

              <v-row dense>
                <v-col cols="12" sm="6" class="mt-2">
                  <span class="headline"> Miércoles </span><br />
                  <ul class="text-md-h5">
                    <li>1 Reunión General - 7:30 pm</li>
                  </ul>
                </v-col>

                <v-col cols="12" sm="6" class="mt-2">
                  <span class="headline"> Domingo </span><br />
                  <ul class="text-md-h5">
                    <li>1 Reunión General - 09:00 am</li>
                    <li>2 Reunión General - 11:30 am</li>
                    <li>3 Reunión General - 06:00 pm</li>
                  </ul>
                </v-col>
              </v-row>
            </v-col>
            <!-- <v-col cols="12" md="5" class="d-none d-md-flex">
              <v-img
                src="/img/ill1.svg"
                class="d-block ml-auto mr-auto"
                max-width="400px"
              />
            </v-col> -->
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
#about {
  background-color: #f4f7f5;
}
</style>
