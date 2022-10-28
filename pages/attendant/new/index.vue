<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveAttendant">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Nombre"
            v-model="attendant.name"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Ap. Paterno"
            v-model="attendant.paternal_surname"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Ap. Materno"
            v-model="attendant.maternal_surname"
          />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Celular"
            v-model="attendant.cellphone"
            v-mask="'##-####-####'"
          />
        </v-col>

        <v-col cols="6" md="3">
          <my-uploadimage
            :url.sync="attendant.image_url"
            v-model="attendant.image_blob"
            label="Imagenes"
            placeholder="Seleccione imagen"
            @change="uploaded"
          ></my-uploadimage>
          <my-image-wrap
            @deleteImage="deleteImage()"
            :src="image_url ? image.path : image.url"
            alt="imagen"
          />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field outlined label="E-mail" v-model="attendant.email" />
        </v-col>

        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="Fecha Cumpleaños"
            v-model="attendant.birthdate"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="auto">
          <v-btn
            @click.native="$emit('cancel')"
            color="primary"
            outlined
            class="mr-1"
          >
            <span>Cancelar</span>
            <v-icon>mdi-cancel</v-icon>
          </v-btn>

          <v-btn type="submit" color="primary" class="mr-4">
            <span>Guardar</span>
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      attendant: {},
    };
  },
  methods: {
    async saveAttendant() {
      await this.$repository.Attendant.createForm(this.attendant)
        .then((res) => {
          this.$router.push("/attendant");
        })
        .catch((e) => {
          alert(e);
        });
    },
    cancel() {
      this.$router.push("/attendant");
    },
  },
  mounted() {
    let me = this;
    // console.log(this.$auth);
    // console.log(this.$auth.user);
  },
  validate({ store, error }) {
    let permission = "attendant-index";
    if (store.getters.permissions.includes(permission)) return true;
    else
      throw error({
        statusCode: 403,
        message: `Permission required ${permission}`,
      });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nuevo Servidor",
      icon: "human-greeting-variant",
    });
  },
};
</script>
