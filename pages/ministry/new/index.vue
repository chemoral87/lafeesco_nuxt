<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="saveMinistry">
      <v-row dense>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="name"
            v-model="ministry.name"
            :rules="[(v) => !!v || 'Campo requerido']"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
            outlined
            label="order"
            v-model="ministry.order"
            :rules="[(v) => !!v || 'Campo requerido']"
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
      ministry: {},
    };
  },
  methods: {
    async saveMinistry() {
      if (!this.$refs.form.validate()) return;

      await this.$repository.Ministry.create(this.ministry)
        .then((res) => {
          this.$router.push("/ministry");
        })
        .catch((e) => {
          alert(e);
        });
    },
    cancel() {
      this.$router.push("/ministry");
    },
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    return true;
    let permission = "ministry-index";
    if (store.getters.permissions.includes(permission)) return true;
    else
      throw error({
        statusCode: 403,
        message: `Permission required ${permission}`,
      });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nuevo Ministerio",
      icon: "hand-heart",
    });
  },
};
</script>
