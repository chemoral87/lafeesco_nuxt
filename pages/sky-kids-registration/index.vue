<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveSkyRegistration" v-if="qr_url == ''">
      <v-row dense>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <span class="">Tutores</span>
            </v-card-title>

            <v-card-text>
              <v-row dense v-for="(parent, ix) in parents" :key="`${ix}-parent`"
                :class="{ 'light-blue lighten-5': isOdd(ix) }">
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="parent.name" label="Nombre" outlined dense :rules="[requiredRule]" />
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="parent.paternal_surname" label="Apellido Paterno" outlined dense
                    :rules="[requiredRule]" />
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="parent.maternal_surname" label="Apellido Materno" outlined dense />
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="parent.cellphone" label="Celular" outlined dense v-mask="'##-####-####'"
                    :rules="[requiredRule]" />
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
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <span class="">Sky kids</span>
            </v-card-title>

            <v-card-text>
              <v-row dense v-for="(kid, ix) in kids" :key="`${ix}-kid`" :class="{ 'lime lighten-5': isOdd(ix) }">
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="kid.name" label="Nombre" outlined dense :rules="[requiredRule]"></v-text-field>
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="kid.paternal_surname" label="Apellido Paterno" outlined dense
                    :rules="[requiredRule]"></v-text-field>
                </v-col>
                <v-col cols="6" sm="3" md="2">
                  <v-text-field v-model="kid.maternal_surname" label="Apellido Materno" outlined dense></v-text-field>
                </v-col>

                <v-col cols="6" sm="3" md="2">
                  <v-select label="Salón" :items="kid_rooms" v-model="kid.room" outlined dense
                    :rules="[requiredRule]"></v-select>
                </v-col>

                <v-col cols="8" sm="4" md="3">
                  <my-birth-picker v-model="kid.birthdate" outlined dense :rules="[requiredRule]" />
                  <!-- <v-text-field v-model="kid.birthdate" label="Cumpleaños" outlined dense></v-text-field> -->
                </v-col>
                <v-col cols="12" sm="3" md="2">
                  <v-text-field v-model="kid.allergies" label="Alergias" outlined dense> </v-text-field>
                </v-col>
                <v-col cols="12" sm="3" md="2">
                  <v-text-field v-model="kid.notes" label="Notas" outlined dense> </v-text-field>
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
                  <v-btn @click="addKid()" color="primary">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                  <v-btn v-if="parents.length > 1" @click="popKid()" color="error">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-spacer />
        <v-col cols="auto">
          <v-btn type="submit" color="primary">Guardar</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-card v-if="qr_url != ''">
      <v-card-title>
        <span class="">QR SkyKids</span>
      </v-card-title>
      <v-card-text class="py-1"> Registro guardado con éxito, presione el botón compartir </v-card-text>
      <v-card-text class="py-1">
        <v-row dense>
          <v-col cols="12">
            <img :src="qr_url" style="max-width: 320px" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="share()" color="primary"> <v-icon>mdi-share-variant</v-icon> Compartir </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
export default {
  props: {},
  layout: "no_login",
  data() {
    return {
      requiredRule: (v) => !!v || "Requerido",
      response: {},
      qr_url: "https://lafeescobedo-bucket.s3.us-east-2.amazonaws.com/local/skykids/20230904/e98b7b7954ff475fade7a37e623aacff.jpg",
      kid_rooms: ["Primarios", "Grandes"],
      parents: [
        {
          name: "",
          paternal_surname: "",
          maternal_surname: "",
          cellphone: "",
          email: "",
          photo: "",
          // name: "ABC",
          // paternal_surname: "DCF",
          // maternal_surname: "",
          // cellphone: "81-2022-1172",
          // email: "",
          // photo: "",
        },
      ],
      kids: [
        {
          name: "",
          paternal_surname: "Peez",
          maternal_surname: "",
          birthdate: "",
          allergies: "",
          notes: "",
          room: "",
          // name: "Tomasin",
          // paternal_surname: "Perez",
          // maternal_surname: "",
          // birthdate: "2020-01-01",
          // allergies: "mocos",
          // notes: "no le gusta venir",
          // room: "",
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
    share() {
      // share image
      let me = this;
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        fetch(this.qr_url)
          .then(function (response) {
            return response.blob();
          })
          .then(function (blob) {
            let file = new File([blob], "qr_skykids.jpg", { type: "image/jpeg" });
            let filesArray = [file];

            navigator.share({
              title: "QR Sky Kids",
              text: "Registro Sky Kids",
              files: filesArray,
              // url: me.qr_url,
            });
          });
      } else {
        let link = document.createElement("a");
        link.href = this.qr_url;
        link.download = "sky_kids.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    async saveSkyRegistration() {
      let me = this;
      if (!this.$refs.form.validate()) return;

      let payload = {
        parents: this.parents,
        kids: this.kids,
      };
      await this.$repository.SkyRegistration.create(payload)
        .then((res) => {
          me.response = res;
          me.qr_url = res.qr_url;
        })
        .catch((e) => {
          alert(e);
        });
    },
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
    addKid() {
      this.kids.push({
        name: "",
        paternal_surname: "",
        maternal_surname: "",
        birthdate: "",
        allergies: "",
        notes: "",
        room: "",
      });
    },
    popKid() {
      this.kids.pop();
    },
  },
  mounted() {
    let me = this;
  },

  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "SkyKids Registro",
      icon: "teddy-bear",
    });
  },
};
</script>
