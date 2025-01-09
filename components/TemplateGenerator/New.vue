<template>
  <div>
    <v-btn @click="toCopy()"><v-icon>mdi-content-copy</v-icon></v-btn>
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
    colRows() {
      let columns = "";
      for (let [i, def] of this.definitions.entries()) {
        console.log(def)
        if (def.column_key != "PRI" && !["created_at", "updated_at"].includes(def.column_name)) {
          if (i > 1) {
            columns += "\n";
          }
          columns += `<v-col cols="6" md="3">
            <v-text-field
            outlined
            label="${def.column_name}"
            v-model="${this.variable_name}.${def.column_name}"
            :rules="${def.is_nullable === 'NO' ? '[(v) => !!v || \'Campo requerido\']' : '[]'}"
            />
          </v-col>`;
        }
      }
      return columns;
    },
    headers() {
      let header = "";
      for (let def of this.definitions) {
        if (def.column_key != "PRI" && !["created_at", "updated_at"].includes(def.column_name)) {
          header += `{   text: "${def.column_name}", value: "${def.column_name}", sortable: false },`;
        }
      }
      return header;
    },
    templ() {
      if (this.variable_name == "") return "";
      return `<template>
  <v-container fluid>
    <v-form ref="form" @submit.prevent="save${this.Modelname}">
      <v-row dense>
        ${this.colRows}
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
      ${this.variable_name}: {}
    }
  },
  methods: {
    async save${this.Modelname}() {
      if (!this.$refs.form.validate()) return;

      await this.$repository.${this.Modelname}.create(this.${this.variable_name})
        .then((res) => {
          this.$router.push("/${this.variable_name}");
        })
        .catch((e) => {
          alert(e);
        });
    },
    cancel() {
      this.$router.push("/${this.variable_name}");
    },
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    return true;
    let permission = "${this.variable_name}-create";
    if (store.getters.permissions.includes(permission)) return true;
    else
    throw error({
        statusCode: 403,
        message: \`Permission required \$\{permission\}\`,
      });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Nuevo ${this.Modelname}",
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
