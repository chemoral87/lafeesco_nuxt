<template>
  <v-container>
    <v-form ref="form" @submit.prevent="validateEmail">
      <v-row dense>
        <v-col cols="12">
          1. Introduzca su E-mail <br />
          2. Presione el botón Obtener código <br />
          3. Revise en su correo el código generado, introduzcalo junto con la nueva
          contrase <br />
        </v-col>
        <v-col cols="6" sm="4">
          <v-text-field
            outlined
            label="E-mail"
            v-model="email"
            :rules="[(v) => !!v || 'Campo requerido']"
            :disabled="wasCodeSend"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn type="submit" color="primary" class="mr-4" :disabled="wasCodeSend"
            >Obtener Código</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-form ref="formReset" v-if="wasCodeSend" @submit.prevent="resetPassword">
      <v-row dense>
        <v-col cols="6" sm="4">
          <v-text-field
            outlined
            label="Código"
            v-model="reset_code"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="6" sm="4">
          <!-- <v-text-field
                outlined
                v-model="password"
                autocomplete="current-password"
                label="Contraseña"
                placeholder=" "
                persistent-placeholder
                :error-messages="errors ? errors?.password : []"
                @click:append="showned = !showned"
                :append-icon="showned ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showned ? 'text' : 'password'"
              ></v-text-field> -->
          <v-text-field
            outlined
            label="Nueva Contraseña"
            @click:append="showned = !showned"
            :append-icon="showned ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showned ? 'text' : 'password'"
            v-model="password"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn type="submit" color="primary" class="mr-4">Cambiar Contraseña</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row dense>
      <v-spacer />
      <v-btn @click="$router.push('/login')" outlined color="primary" class="mr-3"
        >Cancelar</v-btn
      >
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      email: "",
      wasCodeSend: false,
      reset_code: "",
      password: "",
      showned: false,
    };
  },
  methods: {
    async validateEmail() {
      if (!this.$refs.form.validate()) return;
      let me = this;
      await this.$repository.User.sendResetCode({ email: this.email })
        .then((res) => {
          me.wasCodeSend = true;
        })
        .catch((e) => {});
    },
    async resetPassword() {
      if (!this.$refs.formReset.validate()) return;
      let me = this;
      await this.$repository.User.resetPassword({
        email: this.email,
        reset_code: this.reset_code,
        password: this.password,
      })
        .then((res) => {
          me.$router.push("/login");
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Cambiar Contraseña", icon: "key" });
  },
};
</script>
