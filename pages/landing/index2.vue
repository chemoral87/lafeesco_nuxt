<template>
  <div>
    <v-img
      src="https://cool-backgrounds.com/cool-background.jpg"
      gradient="to top right, #43cea2, #185a9d"
      object-fit="contain"
    >
      <v-container fluid>
        <v-row align="center" justify="center" class="white--text">
          <v-col cols="12" class="text-center">
            <h1>Welcome to My Landing Page</h1>
          </v-col>

          <v-col cols="12" class="text-center">
            <p>This is a landing page created with Vuetify</p>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center">
            <h2>Choose a Plan</h2>
          </v-col>
        </v-row>

        <v-row class="d-flex align-stretch">
          <v-col cols="4" class="text-center card-outter">
            <v-card height="100%" class="d-flex flex-column">
              <v-card-title>Basic</v-card-title>
              <v-card-text>
                This is the basic plan, which includes basic features. </v-card-text
              ><v-spacer />
              <v-card-actions class="card-actions">
                <v-btn color="primary">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="4" class="text-center card-outter">
            <v-card height="100%" class="d-flex flex-column">
              <v-card-title>Premium</v-card-title>
              <v-card-text>
                This is the premium plan, which includes advanced features.
              </v-card-text>
              <v-spacer />
              <v-card-actions class="card-actions">
                <v-btn color="primary">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="4" class="text-center card-outter">
            <v-card height="100%" class="d-flex flex-column">
              <v-card-title>Ultimate</v-card-title>
              <v-card-text>
                This is the ultimate plan, which includes all features.
              </v-card-text>
              <v-spacer />
              <v-card-actions class="card-actions">
                <v-btn color="primary">Sign Up</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-img>
  </div>
</template>
<script></script>
<style scoped>
/* .card-outter {
  padding-bottom: 50px;
}
.card-actions {
  position: absolute;
  bottom: 0;
} */
</style>
