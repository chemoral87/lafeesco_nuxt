<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="6">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="table_filter" label="Filtro Tabla"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-btn @click="getTables()" color="primary"> <v-icon class="mr-1">mdi-magnify</v-icon> Buscar </v-btn>

            <!-- <v-btn @click="getDefinitions()" color="danger">
          <v-icon class="mr-1">mdi-engine</v-icon> Generar
        </v-btn> -->
          </v-col>
        </v-row>

        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">TABLE_NAME</th>
                <!-- <th class="text-left">TABLE_NAME</th> -->
                <th class="text-left">SCHEMA_NAME</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tablez" :key="item.name">
                <td>
                  <v-radio-group v-model="radioTable" column>
                    <v-radio :label="item.table_name" :value="item.table_name" @click="getColumns(item)"></v-radio>
                  </v-radio-group>
                  <!-- <v-checkbox
                    v-model="item.check"
                    @change="mark($event, item)"
                  /> -->
                </td>
                <!-- <td>{{ item.TABLE_NAME }}</td> -->
                <td>{{ item.table_schema }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="model_name" label="Modelo"></v-text-field>
        <v-radio-group v-model="radioComponent" column>
          <v-radio v-for="item in components" :label="item.name" :value="item.name" @click="getComponent()" :key="item.name"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" v-if="Object.entries(definitions).length !== 0 && radioComponent != ''">
        <TemplateGeneratorCompo :component="radioComponent" :definitions="definitions" :table_name="radioTable" :model_name="model_name" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {},

  data() {
    return {
      radioTable: '',
      model_name: '',
      radioComponent: 'Model',
      table_filter: '',
      schema_filter: 'lafeescobedo_db',
      tablez: [],
      definitions: {},
      components: [
        { name: 'Model' },
        { name: 'Controller' },
        { name: 'Table' },
        { name: 'Indez' },
        { name: 'New' },
        { name: 'Id' }
        // { name: "Table" },
      ]
    }
  },
  computed: {
    // mark_tables() {
    //   let mark_tables = this.tablez.filter((tab) => tab.check == true);
    //   return mark_tables;
    // },
  },
  watch: {
    async table_filter(value) {
      this.$store.dispatch('hideNextLoading')
      this.getTables()
    }
  },
  methods: {
    // mark(ev, item) {
    //   this.$set(item, "check", ev);
    //   // item.check = ev;
    //   // item = Object.assign({}, item);
    // },
    sendNotify() {
      this.$store.dispatch('notify', {
        success: 'tomasin ' + this.a
      })
      this.a++
    },
    async getTables(options) {
      let { table_filter, schema_filter } = this
      this.radioTable = ''
      this.tablez = await this.$repository.TemplateGenerator.getTables({
        table_filter,
        schema_filter
      })
    },
    getColumns(payload) {
      this.model_name = this.radioTable

      this.getDefinitions([payload])
    },
    getComponent() {},
    async getDefinitions(data) {
      // let { mark_tables } = this;
      let payload = data.map((tab) => {
        return { table_name: tab.table_name, table_schema: tab.table_schema }
      })

      this.definitions = await this.$repository.TemplateGenerator.getDefinitions({
        payload
      })
    }
  },
  mounted() {
    let me = this
  },
  created() {
    this.$nuxt.$emit('setNavBar', {
      title: 'Template Generator',
      icon: 'engine'
    })
  }
}
</script>
