<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="3">
        <v-text-field v-model="filter" label="Filtro"></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn @click="getTables()" color="primary">
          <v-icon class="mr-1">mdi-magnify</v-icon> Buscar
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="6">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Mark</th>
                <th class="text-left">TABLE_NAME</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tablez" :key="item.name">
                <td>
                  <v-checkbox
                    v-model="item.check"
                    @change="mark($event, item)"
                  />
                </td>
                <td>{{ item.TABLE_NAME }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="6"> tablas aqui </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="6"> </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      filter: "",
      tablez: [],
    };
  },
  computed: {
    mark_tables() {
      let mark_tables = this.tablez.filter((tab) => tab.check == true);
      return mark_tables;
    },
  },
  watch: {
    async filter(value) {
      this.$store.dispatch("hideNextLoading");
      this.getTables();
    },
  },
  methods: {
    mark(ev, item) {
      this.$set(item, "check", ev);
      // item.check = ev;
      // item = Object.assign({}, item);
    },
    async getTables(options) {
      let { filter } = this;
      this.tablez = await this.$repository.TemplateGenerator.getTables({
        filter,
      });
    },
  },
  mounted() {
    let me = this;
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Template Generator",
      icon: "engine",
    });
  },
};
</script>
