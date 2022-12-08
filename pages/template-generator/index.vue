<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="table_filter"
          label="Filtro Tabla"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="schema_filter"
          label="Filtro Schema"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn @click="getTables()" color="primary">
          <v-icon class="mr-1">mdi-magnify</v-icon> Buscar
        </v-btn>
        <v-btn @click="sendNotify()" color="primary">
          <v-icon class="mr-1">mdi-bell</v-icon> Notificacion
        </v-btn>
        <v-btn @click="getDefinitions()" color="danger">
          <v-icon class="mr-1">mdi-engine</v-icon> Generar
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
                <th class="text-left">SCHEMA_NAME</th>
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
                <td>{{ item.TABLE_SCHEMA }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="6"> tablas aqui </v-col>
    </v-row>
    <!-- {{ mark_tables }} -->
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
      table_filter: "",
      schema_filter: "lafeescobedo_db",
      tablez: [],
      definitions: [],
      a: 1,
    };
  },
  computed: {
    mark_tables() {
      let mark_tables = this.tablez.filter((tab) => tab.check == true);
      return mark_tables;
    },
  },
  watch: {
    async table_filter(value) {
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
    sendNotify() {
      this.$store.dispatch("notify", {
        success: "tomasin " + this.a,
      });
      this.a++;
    },
    async getTables(options) {
      let { table_filter, schema_filter } = this;
      this.tablez = await this.$repository.TemplateGenerator.getTables({
        table_filter,
        schema_filter,
      });
    },
    async getDefinitions() {
      let { mark_tables } = this;
      let payload = mark_tables.map((tab) => {
        return { table_name: tab.TABLE_NAME, table_schema: tab.TABLE_SCHEMA };
      });
      console.log(payload);
      this.definitions =
        await this.$repository.TemplateGenerator.getDefinitions({
          payload,
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
