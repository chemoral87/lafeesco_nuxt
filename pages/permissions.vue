<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filterPermission"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn @click="newPermission()" class="mr-1" color="primary">
          <v-icon>mdi-plus</v-icon> Nuevo
        </v-btn>
        <v-btn @click="getPermissions()" color="primary">
          <v-icon>mdi-reload</v-icon> Refrescar
        </v-btn>
      </v-col>
      <v-col cols="12">
        <client-only>
          <PermissionTable
            @sorting="getPermissions"
            :options="options"
            :response="response"
            @edit="editPermission"
            @delete="beforeDeletePermission"
          ></PermissionTable>
        </client-only>
      </v-col>
    </v-row>
    <PermissionDialog
      :permission="permission"
      v-if="permissionDialog"
      @close="closeDialog"
      @save="savePermission"
    />
    <DialogDelete
      v-if="permissionDialogDelete"
      :dialog="dialogDelete"
      @ok="deletePermission"
      @close="permissionDialogDelete = false"
    ></DialogDelete>

    <!-- <PermissionDialogDelete :permission="permission" v-if="permissionDialogDelete" @close="permissionDialogDelete = false" @ok="deletePermission" /> -->
  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes("permission-index")) return true;
    else throw error({ statusCode: 403 });
  },
  props: {},
  data() {
    return {
      permission: {},
      options: {},
      filterPermission: "",
      permissionDialog: false,
      permissionDialogDelete: false,
      dialogDelete: {},
    };
  },
  watch: {
    async filterPermission(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      let op = Object.assign(me.options, { filter: value, page: 1, l: false });
      me.response = await me.$repository.Permission.index(op);
    },
  },
  methods: {
    newPermission() {
      this.permission = {};
      this.permissionDialog = true;
    },
    editPermission(item) {
      this.permission = Object.assign({}, item);
      this.permissionDialog = true;
    },
    beforeDeletePermission(item) {
      this.dialogDelete = {
        text: "Desea eliminar el Permiso ",
        strong: item.name,
        payload: item,
      };
      this.permissionDialogDelete = true;
    },
    async deletePermission(item) {
      await this.$repository.Permission.delete(item.id, item)
        .then((res) => {
          this.getPermissions();
          this.permissionDialogDelete = false;
        })
        .catch((e) => {});
    },
    async getPermissions(options) {
      if (options) {
        this.options = options;
      }
      let op = Object.assign({ filter: this.filterPermission }, this.options);
      this.response = await this.$repository.Permission.index(op);
    },
    async savePermission(item) {
      let me = this;
      if (item.id) {
        await this.$repository.Permission.update(item.id, item)
          .then((res) => {
            me.getPermissions();
            me.permissionDialog = false;
          })
          .catch((e) => {});
      } else {
        await this.$repository.Permission.create(item)
          .then((res) => {
            me.getPermissions();
            me.permissionDialog = false;
          })
          .catch((e) => {});
      }
    },
    closeDialog() {
      this.permissionDialog = false;
      this.clearErrors();
    },
  },

  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ["name"],
      sortDesc: [false],
      itemsPerPage: 10,
    };
    //NOTE Repository https://medium.com/js-dojo/consuming-apis-in-nuxt-using-the-repository-pattern-8a13ea57d520
    const res = await app.$repository.Permission.index(op).catch((e) => {});
    return { response: res, options: op };
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Permisos", icon: "key" });
  },
};
</script>
