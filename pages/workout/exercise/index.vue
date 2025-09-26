<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filterExercise"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn @click="newExercise()" class="mr-1" color="primary">
          <v-icon>mdi-plus</v-icon> Nuevo
        </v-btn>
        <v-btn @click="getExercises()" color="primary">
          <v-icon>mdi-reload</v-icon> Refrescar
        </v-btn>
      </v-col>
      <v-col cols="12">
        <client-only>
          <ExerciseTable
            @sorting="getExercises"
            :options="options"
            :response="response"
            :loading="loading"
            @edit="editExercise"
            @delete="beforeDeleteExercise"
          ></ExerciseTable>
        </client-only>
      </v-col>
    </v-row>
    <ExerciseDialog
      :exercise="exercise"
      v-if="exerciseDialog"
      @close="closeDialog"
      @save="saveExercise"
    />
    <DialogDelete
      v-if="exerciseDialogDelete"
      :dialog="dialogDelete"
      @ok="deleteExercise"
      @close="exerciseDialogDelete = false"
    ></DialogDelete>
  </v-container>
</template>
<script>
export default {
  middleware: ["authenticated"],
  async asyncData({ $axios, app, store, error }) {
    let org_ids = await store.dispatch("validatePermission", {
      permission: "workout-index",
      error,
    });

    let op = {
      sortBy: ["name"],
      sortDesc: [false],
      itemsPerPage: 10,
    };

    // NOTE Repository https://medium.com/js-dojo/consuming-apis-in-nuxt-using-the-repository-pattern-8a13ea57d520
    const res = await app.$repository.Exercise.index(op).catch((e) => {});
    return { response: res, options: op };
  },
  props: {},
  data() {
    return {
      exercise: {},
      options: {},
      filterExercise: "",
      exerciseDialog: false,
      exerciseDialogDelete: false,
      dialogDelete: {},
      loading: false,
    };
  },
  watch: {
    async filterExercise(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      me.loading = true;
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.Exercise.index(op);
      me.loading = false;
    },
  },
  methods: {
    newExercise() {
      this.exercise = {};
      this.exerciseDialog = true;
    },
    editExercise(item) {
      this.exercise = Object.assign({}, item);
      this.exerciseDialog = true;
    },
    beforeDeleteExercise(item) {
      this.dialogDelete = {
        text: "¿Desea eliminar el ejercicio ",
        strong: item.name,
        payload: item,
      };
      this.exerciseDialogDelete = true;
    },
    async deleteExercise(item) {
      this.$store.dispatch("hideNextLoading");
      await this.$repository.Exercise.delete(item.id, item)
        .then((res) => {
          this.getExercises();
          this.exerciseDialogDelete = false;
        })
        .catch((e) => {});
    },
    async getExercises(options) {
      this.$store.dispatch("hideNextLoading");
      this.loading = true;
      if (options) {
        this.options = options;
      }
      let op = Object.assign({ filter: this.filterExercise }, this.options);
      this.response = await this.$repository.Exercise.index(op);
      this.loading = false;
    },
    async saveExercise(item) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      if (item.id) {
        await this.$repository.Exercise.update(item.id, item)
          .then((res) => {
            me.getExercises();
            me.exerciseDialog = false;
          })
          .catch((e) => {});
      } else {
        await this.$repository.Exercise.create(item)
          .then((res) => {
            me.getExercises();
            me.exerciseDialog = false;
          })
          .catch((e) => {});
      }
    },
    closeDialog() {
      this.exerciseDialog = false;
      this.clearErrors();
    },
  },

  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Ejercicios",
      icon: "mdi-dumbbell",
    });
  },
};
</script>
