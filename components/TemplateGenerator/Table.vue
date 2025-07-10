<template>
  <div>
    <v-btn color="primary" @click="copy()"><v-icon>mdi-content-copy</v-icon> Copiar</v-btn>
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
    }
    // async toCopy() {
    //   let message = this.$refs.message.innerHTML
    //     .replace(/&lt;/g, "<")
    //     .replace(/&gt;/g, ">")
    //     .replace(/&quot;/g, '"');
    //   await navigator.clipboard.writeText(message);
    // }
  },
  computed: {
    Modelname() {
      let str = this.variable_name.toLowerCase();
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    headers() {
      let header = "";
      let firstSortSet = false;
      for (let def of this.definitions) {
        if (def.column_key != "PRI" && !["created_at", "updated_at"].includes(def.column_name)) {
          let firstSortDesc = "";
    if (!firstSortSet) {
      firstSortDesc = ", firstSortDesc: true";
      firstSortSet = true;
    }
    header += `{ text: "${def.column_name}", value: "${def.column_name}", sortable: true${firstSortDesc} },`;
 
        }
      }
      return header;
    },
    templ() {
      if (this.variable_name == "") return "";
      return `<template>
  <div>
    <v-data-table
      dense
      mobile-breakpoint="0"
      @update:sort-by="sortTable"
      :must-sort="true"
      :headers="headers"
      :items="items"
      :options.sync="optionsTable"
      :server-items-length="total"
      class="elevation-1 xwidth1200"
    >
      <template v-slot:[\`item.actions\`]="{ item }">
        <v-btn
          title="Editar"
          class="ma-1"
          color="primary"
          outlined
          fab
          small
          @click="emitAction('edit', item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          title="Delete"
          class="ma-1"
          color="error"
          outlined
          fab
          small
          @click="confirmDelete(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <DialogDelete
      v-if="dialogDelete"
      :dialog="dialogDeleteProp"
      @ok="
        (item) => {
          $emit('delete', item);
        }
      "
      @close="$emit('update:dialogDelete', false)"
    ></DialogDelete>
  </div>
</template>
<script>
export default {
  name: "${this.Modelname}Table",
  props: ["dialogDelete", "response", "options", "tableHeaders"],
  data() {
    return {
      optionsTable: {},
      pageCountRule: 0,
      sortDesc: false,
      headers: [
       ${this.headers}
        { text: "Acciones", value: "actions", width: "200px", sortable: false },
      ],
      dialogDeleteProp: {},
    };
  },
  computed: {
    total() {
      if (this.response) return this.response.total;
      else return 0;
    },
    items() {
      if (this.response) return this.response.data;
      else return [];
    },
  },
  methods: {
    confirmDelete(item) {
      this.dialogDeleteProp = {
        text: "Desea eliminar ${this.variable_name}",
        strong: item.name,
        payload: item,
      };
      this.$emit("update:dialogDelete", true);
    },
    sortTable(columnName) {
        let head = this.headers.find((x) => x.value === columnName);
        if (head.firstSortDesc) this.optionsTable.sortDesc[0] = true;
    },
    emitAction(action, payload) {
      this.$emit(action, payload);
    },
  },
  mounted() {
    let me = this;
    this.optionsTable = this.options;
    if (this)
      me.$nextTick(() => {
        me.options_watch = me.$watch(
          "optionsTable",
          function () {
            this.$emit("sorting", this.optionsTable);
          },
          {
            immediate: false,
          }
        );
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
