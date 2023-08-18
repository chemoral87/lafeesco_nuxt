<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="">Tutores</span>
          </v-card-title>
          <v-card-text>
            <v-row dense v-for="(parent, ix) in parents" :key="`${ix}-parent`" :class="{ 'light-blue lighten-5': isOdd(ix) }">
              <v-col cols="6" sm="3" md="2">
                <v-text-field v-model="parent.name" label="Nombre" outlined dense />
              </v-col>
              <v-col cols="6" sm="3" md="2">
                <v-text-field v-model="parent.paternal_surname" label="Apellido Paterno" outlined dense />
              </v-col>
              <v-col cols="6" sm="3" md="2">
                <v-text-field v-model="parent.maternal_surname" label="Apellido Materno" outlined dense />
              </v-col>

              <v-col cols="6" sm="3" md="2">
                <v-text-field v-model="parent.cellphone" label="Celular" outlined dense />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="parent.email" label="Correo Electrónico" outlined dense />
              </v-col>
              <!-- <v-col cols="12" sm="12" md="4">
                  <v-text-field
                    v-model="parent.photo"
                    label="Foto"
                    outlined
                    dense
                  ></v-text-field>
                </v-col> -->
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <v-btn @click="addParent()" color="primary">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn v-if="parents.length > 1" @click="popParent()" color="error">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text></v-card
        ></v-col
      >

      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="">Sky kids</span>
          </v-card-title>
          {{ kids }}
          <v-card-text>
            <v-row dense v-for="(kid, ix) in kids" :key="`${ix}-kid`" :class="{ 'lime lighten-5': isOdd(ix) }">
              <v-col cols="6" sm="3" md="2">
                <v-text-field v-model="kid.name" label="Nombre" outlined dense></v-text-field>
              </v-col>
              <v-col cols="6" sm="3" md="2">
                <v-text-field v-model="kid.paternal_surname" label="Apellido Paterno" outlined dense></v-text-field>
              </v-col>
              <v-col cols="6" sm="3" md="2">
                <v-text-field v-model="kid.maternal_surname" label="Apellido Materno" outlined dense></v-text-field>
              </v-col>

              <v-col cols="6" sm="4" md="3">
                <my-birth-picker v-model="kid.birthdate" outlined dense />
                <!-- <v-text-field v-model="kid.birthdate" label="Cumpleaños" outlined dense></v-text-field> -->
              </v-col>
              <v-col cols="12" sm="3" md="2">
                <v-text-field v-model="kid.allergies" label="Alergias" outlined dense> </v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="2">
                <v-text-field v-model="kid.notes" label="Notas" outlined dense> </v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="2">
                <v-select label="Salón" :items="kid_rooms" v-model="kid.room" outlined dense></v-select>
              </v-col>
              <!-- <v-col cols="12" sm="12" md="4">
                  <v-text-field
                    v-model="parent.photo"
                    label="Foto"
                    outlined
                    dense
                  ></v-text-field>
                </v-col> -->
            </v-row>
            <v-row dense>
              <v-col cols="12">
                <v-btn @click="addParent()" color="primary">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn v-if="parents.length > 1" @click="popParent()" color="error">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      kid_rooms: ["Primarios", "Grandes"],
      parents: [
        {
          name: "",
          paternal_surname: "",
          maternal_surname: "",
          birthdate: "",
          allergies: "",
          notes: "",
          room: "",
        },
      ],
      kids: [
        {
          name: "Tomasin",
          paternal_surname: "Perez",
          maternal_surname: "",
          birthdate: "2021-02-01",
          allergies: "mocos",
          notes: "no le gusta venir",
          room: "",
        },
      ],
    };
  },
  middleware: "prevent-refresh",
  beforeRouteLeave(to, from, next) {
    const answer = window.confirm("Do you really want to leave?");
    if (from === this.$route) {
      // Check if the route we're coming from is the current route (i.e., we're leaving)

      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  methods: {
    isOdd(num) {
      return num % 2 !== 0;
    },
    addParent() {
      this.parents.push({
        name: "",
        paternal_surname: "",
        maternal_surname: "",
        cellphone: "",
        email: "",
        photo: "",
      });
    },
    popParent() {
      this.parents.pop();
    },
  },
  mounted() {
    let me = this;
  },

  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Sky kids Registro",
      icon: "teddy-bear",
    });
  },
};
</script>
