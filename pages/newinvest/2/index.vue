<template>
  <v-form ref="form">
    <v-container>
      <v-row dense>
        <v-col cols="12" sm="4" md="4">
          <v-text-field v-model="investor.name" persistent-placeholder placeholder="Ingrese nombre" label="Nombre" outlined :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-text-field v-model="investor.last_name" persistent-placeholder placeholder="Ingrese apellido paterno" label="Apellido Paterno" outlined :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-text-field v-model="investor.second_last_name" persistent-placeholder placeholder="Ingrese apellido materno" label="Apellido Materno" outlined :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col cols="6" sm="4" md="4">
          <v-text-field label="Fecha de Cumpleaños" type="tel" v-mask="'####-##-##'" persistent-placeholder placeholder="AAAA-MM-DD" v-model="investor.birthday" outlined :rules="[rules.required,rules.date, rules.isDate, ]"></v-text-field>

          <!-- <MyDatepicker label="Fecha de Nacimiento" v-model="date" outlined></MyDatepicker> -->
          <!-- <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="10" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="date" label="Fecha de Nacimiento" outlined v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="datePicker" @input="menu2 = false"></v-date-picker>
          </v-menu> -->
        </v-col>
        <v-col cols="6" sm="4" md="4">
          <v-text-field v-mask="'##-####-####'" type="tel" v-model="investor.cellphone" persistent-placeholder placeholder="Ingrese número " label="Teléfono Celular" outlined :rules="[rules.required, rules.cellphone]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="4" md="4">
          <v-text-field v-model="investor.email" persistent-placeholder placeholder="Ingrese correo electrónico" label="Correo Electrónico" outlined :rules="[rules.email]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="investor.password" persistent-placeholder placeholder="Ingrese una contraseña de 6 letras" label="Contraseña" outlined :rules="[rules.required, rules.password]"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="investor.password_confirm" persistent-placeholder placeholder="Confirme nuevamente su contraseña" label="Confirme Contraseña" :error-messages="errors ? errors.password_confirm : []" outlined :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-alert dense outlined type="error" v-if="errors.form" max-width="23rem">
            {{errors.form}}
          </v-alert>
        </v-col>
        <v-col cols="12">

          <v-btn color="primary" @click="$router.push('/newinvest/1')">
            <v-icon class="mr-1">mdi-chevron-left</v-icon> Regresar
          </v-btn>
          <v-btn color="primary" @click="validPhase">
            <v-icon class="mr-1">mdi-chevron-right</v-icon> Siguiente
          </v-btn>
          <!-- <v-btn color="primary" @click="validPhase">
            <v-icon class="mr-1">mdi-chevron-right</v-icon> Paso 3
          </v-btn> -->
        </v-col>
      </v-row>

    </v-container>
  </v-form>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  created() {
    this.$nuxt.$emit("setNavBar", { title: `Paso 2: Datos Generales`, icon: null, back: "/newinvest/1", show_drawer: false, show_login: false });
  },
  props: {
  },
  data() {
    return {
      investor: {
        name: "",
        last_name: "",
        second_last_name: "",
        email: "",
        cellphone: "",
        password: "",
        password_confirm: "",
        birthday: "",
        date: null
      }, //(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      menu2: false,
      rules: {
        required: value => !!value || 'Campo requerido',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Formato de correo inválido';
        },
        date: value => {
          const pattern = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
          return pattern.test(value) || 'Formato inválido año-mes-día';
        },
        isDate: value => {
          const datum = this.$moment(value);
          return datum.isValid() || 'Fecha inválida';
        },
        password: value => {
          let len = value.length;
          return len >= 6 || 'La contraseña debe tener mínimo 6 caracteres';
        },
        cellphone: value => {
          let len = value.length;
          return len >= 10 || 'Introduzca un número de 10 dígitos';
        }
      }
    };
  },
  computed: {
    // ...mapGetters("newinvest", [
    //   'capital',
    // ]),
    ...mapGetters({ sInvestor: 'newinvest/investor' }),
    datePicker: {
      set(value) {
        this.date = value;
      },
      get() {
        try {
          if (!isNaN(this.date) && this.date instanceof Date) {
            return this.date;
          } else {
            return (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
          }
        } catch (e) {

        }

      }
    }
  },
  methods: {
    async validPhase() {
      let error = {};
      // this.$refs.form.resetValidation();
      if (this.investor.password != this.investor.password_confirm) {
        error.password_confirm = "No coinciden las contraseñas";
      }
      let isValid = this.$refs.form.validate();
      if (!isValid) {
        error.form = "Favor de llenar los campos que faltan";
      }
      this.$store.dispatch("validation/setErrors", error);
      // if (Object.keys(error).length > 0) {
      //   error.form = "* Favor de llenar los campos que faltan";
      // } else {
      //   this.$store.dispatch("validation/clearErrors");
      // }
      if (isValid) {
        this.$store.commit("newinvest/SET_PROFILE", this.investor);
        // send email to code verification
        this.$router.push('/newinvest/3');

      }
    },

  },
  mounted() {
    let me = this;
    var datum = new Date();
    datum.setFullYear(datum.getFullYear() - 18);
    let label = this.$moment(datum).format('YYYY-MM-DD');
    this.date = label;
    this.investor = this.sInvestor;
  }
}
</script>