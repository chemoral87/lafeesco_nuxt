<template>
  <div>
    <v-btn @click="copy()" color="primary"><v-icon>mdi-content-copy</v-icon> Copiar</v-btn>
    <div v-text="templ" ref="message" class="templ"></div>
  </div>
</template>
<script>
export default {
  props: ["component", "definitions", "table_name", "variable_name"],
  data() {
    return {
      // Modelname: "",
    };
  },
  methods: {
    copy() {
      // copy all innert text from div ref code
      let range = document.createRange();
      range.selectNode(this.$refs.message);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);

      document.execCommand("copy");
      window.getSelection().removeAllRanges();
      // notify copy
      this.$store.dispatch("notify", {
        success: "Copiado al portapapeles"
      });
    },
    async toCopy() {
      let message = this.$refs.message.innerHTML
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');
      await navigator.clipboard.writeText(message);
    }
  },
  computed: {
    Modelname() {
      let str = this.variable_name.toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    ModelName() {
      // return title case removen underscores from variable_name
      // validate if not null
      if (this.variable_name == "") return "";
      return this.variable_name
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
    },
    templ() {
      if (this.variable_name == "") return "";
      return `<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filter${this.ModelName}"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>

    <v-spacer />
      <v-col cols="auto">
        <v-btn
          color="success"
          @click="$router.push('${this.variable_name}/new')"
          class="mb-1 mr-1"
        >
          <v-icon >mdi-account-plus</v-icon>Nuevo ${this.ModelName}
        </v-btn>
      </v-col>
      <v-col cols="12">
        <${this.ModelName}Table
          @sorting="index${this.ModelName}"
          :options="options"
          :response="response"
          @edit="edit${this.ModelName}"
          @delete="delete${this.ModelName}"
          :dialog-delete.sync="dialogDelete${this.ModelName}"
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
    const response = await app.$repository.${this.ModelName}.index(options).catch(
      (e) => {}
    );
    return { response, options };
  },
  watch: {
    async filter${this.ModelName}(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.${this.ModelName}.index(op);
    },
  },
  methods: {
   async index${this.ModelName}(options) {
      if (options) {
        this.options = Object.assign(this.options, options);
      }
      let op = Object.assign({ filter: this.filter }, this.options);
      this.response = await this.$repository.${this.ModelName}.index(op);
    },
    edit${this.ModelName}(item) {
      this.$router.push(\`/${this.variable_name}/\$\{item.id\}\`);
    },
    async delete${this.ModelName}(item) {
      await this.$repository.${this.Modelname}.delete(item.id)
        .then((res) => {
          this.dialogDelete${this.Modelname} = false;
          this.index${this.ModelName}();
        })
        .catch((e) => {});
    },
  },
  data() {
    return {
      dialogDelete${this.ModelName}: false,
      options: {},
      response: {},
      filter${this.ModelName} : "",
    };
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    return true;
    if (store.getters.permissions.includes("${this.variable_name}-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "${this.ModelName}",
      icon: "human-greeting-variant",
    });
  },
};
<\/script>

      `;
    }
  },

  mounted() {
    let me = this;
  }
};
</script>
<style scoped>
.templ {
  white-space: pre;
}
</style>
