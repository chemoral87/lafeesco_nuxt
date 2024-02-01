<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="name" label="Nombre" required></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="phone_number" label="Teléfono" required></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn @click="addContact" color="primary">Agregar</v-btn>
          </v-col>
        </v-row>

        <v-list-item-group>
          <v-list-item v-for="(contact, index) in item.contacts" :key="index" two-line>
            <v-list-item-content>
              <v-list-item-title
                >{{ contact.name }} - {{ contact.phone_number }}</v-list-item-title
              >
              <!-- <v-list-item-subtitle>{{ contact.number }}</v-list-item-subtitle> -->
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click="removeContact(index)" color="error">Eliminar</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>

        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="item.text"
            :counter="160"
            :rules="rules"
            label="Mensaje"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
    </v-card>

    <v-btn :disabled="!valid" color="primary" @click="sendText">Enviar mensaje</v-btn>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      name: "",
      phone_number: "",
      item: {
        contacts: [],

        text:
          "Hola {{name}}, bienvenido a la Fe Escobedo un lugar de adoración y alabanza a Dios. Dios te bendiga."
      },
      valid: false,
      rules: [
        (v) => !!v || "Requerido",
        (v) => (v && v.length <= 160) || "Text must be less than 160 characters"
      ]
    };
  },
  methods: {
    removeContact(index) {
      this.item.contacts.splice(index, 1);
    },
    addContact() {
      this.item.contacts.push({ name: this.name, phone_number: this.phone_number });
      this.name = "";
      this.phone_number = "";
    },
    sendText() {
      this.$repository.Texting.create(this.item).then((response) => {
        console.log("sendText", response);
      });
    }
  },
  mounted() {
    let me = this;
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Notificaciones 1+4J",
      icon: "message-alert"
    });
  }
};
</script>
