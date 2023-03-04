<template>
  <div>
    <v-btn @click="toCopy()"><v-icon>mdi-content-copy</v-icon></v-btn>
    <div v-text="templ" ref="message" class="templ"></div>
  </div>
</template>
<script>
export default {
  props: ['component', 'definitions', 'table_name', 'model_name'],
  data() {
    return {
      // Modelname: "",
    }
  },
  methods: {
    async toCopy() {
      let message = this.$refs.message.innerHTML
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
      await navigator.clipboard.writeText(message)
      // const storage = document.createElement("textarea");
      // storage.value = this.$refs.message.innerHTML;
      // this.$refs.reference.appendChild(storage);
      // storage.select();
      // storage.setSelectionRange(0, 99999);
      // document.execCommand("copy");
      // this.$refs.reference.removeChild(storage);
    }
  },
  computed: {
    Modelname() {
      let str = this.model_name.toLowerCase()
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    templ() {
      if (this.model_name == '') return ''
      return `<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filter${this.Modelname}"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>

    <v-spacer />
      <v-col cols="auto">
        <v-btn
          color="success"
          @click="$router.push('${this.model_name}/new')"
          class="mb-1 mr-1"
        >
          <v-icon >mdi-account-plus</v-icon>Nuevo ${this.Modelname}
        </v-btn>
      </v-col>
      <v-col cols="12">
        <${this.Modelname}Table
          @sorting="index${this.Modelname}"
          :options="options"
          :response="response"
          @edit="edit${this.Modelname}"
          @delete="delete${this.Modelname}"
          :dialogDelete.sync="dialogDelete${this.Modelname}"
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
    const response = await app.$repository.${this.Modelname}.index(options).catch(
      (e) => {}
    );
    return { response, options };
  },
  watch: {
    async filter${this.Modelname}(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.${this.Modelname}.index(op);
    },
  },
  methods: {
   async index${this.Modelname}(options) {
      if (options) {
        this.options = Object.assign(this.options, options);
      }
      let op = Object.assign({ filter: this.filter }, this.options);
      this.response = await this.$repository.${this.Modelname}.index(op);
    },
    edit${this.Modelname}(item) {
      this.$router.push(\`/${this.model_name}/\$\{item.id\}\`);
    },
    async delete${this.Modelname}(item) {
      await this.$repository.${this.Modelname}.delete(item.id)
        .then((res) => {
          this.dialogDelete${this.Modelname} = false;
          this.index${this.Modelname}();
        })
        .catch((e) => {});
    },
  },
  data() {
    return {
      dialogDelete${this.Modelname}: false,
      options: {},
      response: {},
      filter${this.Modelname} : "",
    };
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    return true;
    if (store.getters.permissions.includes("${this.model_name}-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "${this.Modelname}",
      icon: "human-greeting-variant",
    });
  },
};
<\/script>

      `
    }
  },

  mounted() {
    let me = this
    // let str = this.model_name.toLowerCase();
    // console.log(str);
    // this.Modelname = str.charAt(0).toUpperCase() + str.slice(1);
    // console.log(this.Modelname);
  }
}
</script>
<style scoped>
.templ {
  white-space: pre;
}
</style>
