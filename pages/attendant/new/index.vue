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
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="12" md="3">
          <MinistryCombobox
            :ministries="attendant.ministries"
            @modelChange="setMinistries"
          ></MinistryCombobox>
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="E-mail" v-model="attendant.email" />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field outlined label="Fecha Cumpleaños" v-model="attendant.birthdate" />
        </v-col>
        <v-col cols="6" md="3">
          <my-uploadimage
            :url.sync="attendant.image_url"
            v-model="attendant.image_blob"
            label="Foto"
            :size="150"
            placeholder="Seleccione imagen"
            @change="uploaded"
          ></my-uploadimage>
        </v-col>
        <v-col cols="6" md="3">
          <cropper
            stencil-component="circle-stencil"
            :src="attendant.image_url"
            @change="change"
          />
        </v-col>
        <v-col cols="6" md="3">
          <img
            class="image-cropper"
            style="max-width: 100%; min-height: 120px"
            :src="imga"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-spacer />
        <v-col cols="auto">
          <v-btn @click.native="cancel" color="primary" outlined class="mr-1">
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
  data() {
    return {
      img: "https://images.pexels.com/photos/4323307/pexels-photo-4323307.jpeg",
      attendant: {
        ministries: []
      },
      imga: ""
    };
  },

  methods: {
    setMinistries(ministries) {
      this.attendant.ministries = ministries;
    },
    change({ coordinates, canvas }) {
      this.imga = canvas.toDataURL();
      canvas.toBlob((blob) => {
        this.attendant.image_blobu = blob;
      });
    },
    deleteImage() {
      let _attendant = this.attendant;
      _attendant.image_blob = null;
      _attendant.image_url = null;
    },
    uploaded() {},
    async saveAttendant() {
      if (!this.$refs.form.validate()) return;
      let formData = new FormData();
      let {
        name,
        paternal_surname,
        maternal_surname,
        cellphone,
        email,
        birthdate,
        image_blobu,
        ministries
      } = this.attendant;

      formData.append("name", name);
      formData.append("paternal_surname", paternal_surname);
      maternal_surname && formData.append("maternal_surname", maternal_surname);
      cellphone && formData.append("cellphone", cellphone);
      email && formData.append("email", email);
      birthdate && formData.append("birthdate", birthdate);
      image_blobu && formData.append("image", image_blobu);
      ministries.forEach((x) => {
        formData.append("ministry_ids[]", x.id);
      });

      await this.$repository.Attendant.createForm(formData)
        .then((res) => {
          this.$router.push("/attendant");
        })
        .catch((e) => {
          alert(e);
        });
    },
    cancel() {
      this.$router.push("/attendant");
    }
  },
  mounted() {
    let me = this;
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    let permission = "attendant-index";
    if (store.getters.permissions.includes(permission)) return true;
    else
      throw error({
        statusCode: 403,
        message: `Permission required ${permission}`
      });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nuevo Servidor",
      icon: "human-greeting-variant"
    });
  }
};
</script>
<style scoped>
.image-cropper {
  border-radius: 50%;
}
</style>
