<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filterIntake"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>

      <v-spacer />
      <v-col cols="auto">
        <v-btn
          color="success"
          @click="$router.push('intake/new')"
          class="mb-1 mr-1"
        >
          <v-icon>mdi-account-plus</v-icon>Nuevo Intake
        </v-btn>
      </v-col>
      <v-col cols="12">
        <IntakeTable
          @sorting="indexIntake"
          :options="options"
          :response="response"
          @edit="editIntake"
          @delete="deleteIntake"
          :dialog-delete.sync="dialogDeleteIntake"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  async asyncData({ $axios, app }) {
    let options = {
      sortBy: ["name"],
      sortDesc: [true],
      itemsPerPage: 5,
    };
    const response = await app.$repository.Intake.index(options).catch(
      (e) => {}
    );
    return { response, options };
  },
  watch: {
    async filterIntake(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.Intake.index(op);
    },
  },
  methods: {
    async indexIntake(options) {
      if (options) {
        this.options = Object.assign(this.options, options);
      }
      let op = Object.assign({ filter: this.filter }, this.options);
      this.response = await this.$repository.Intake.index(op);
    },
    editIntake(item) {
      this.$router.push(`/intake/${item.id}`);
    },
    async deleteIntake(item) {
      await this.$repository.Intake.delete(item.id)
        .then((res) => {
          this.dialogDeleteIntake = false;
          this.indexIntake();
        })
        .catch((e) => {});
    },
  },
  data() {
    return {
      dialogDeleteIntake: false,
      options: {},
      response: {},
      filterIntake: "",
    };
  },
  middleware: ["authenticated"],
  validate({ app }) {
    if (!app.$repository.Intake) {
      throw new Error("Intake repository does not exist.");
    }
    return true;
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Intake",
      icon: "human-greeting-variant",
    });
  },
};
</script>
