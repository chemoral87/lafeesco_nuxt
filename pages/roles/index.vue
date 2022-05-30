<template>
  <v-container>
    <v-row dense>
      <v-col cols="12" md="2">
        <v-text-field append-icon="mdi-magnify" clearable hide-details v-model="filterRole" placeholder="Filtro"></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn @click="newRole()" color="primary" class="mr-1">
          <v-icon>mdi-plus</v-icon> Nuevo
        </v-btn>
        <v-btn @click="getRoles()" color="primary">
          <v-icon>mdi-reload</v-icon> Refrescar
        </v-btn>
      </v-col>
      <v-col cols="12">
        <RoleTable @sorting="getRoles" :options="options" @editPermissions="editRolePermissions" :response="response" @edit="editRole" @delete="beforeDeleteRole"></RoleTable>
      </v-col>
    </v-row>
    <RoleDialog :role="role" v-if="roleDialog" @close="closeDialog" @save="saveRole" />
    <DialogDelete v-if="roleDialogDelete" :dialog="dialogDelete" @ok="deleteRole" @close="roleDialogDelete = false"></DialogDelete>
    <!-- <RoleDialogDelete :role="role" v-if="roleDialogDelete" @close="roleDialogDelete = false" @ok="deleteRole" /> -->
  </v-container>
</template>
<script>

export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('role-index'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  data() {
    return {
      filterRole: "",
      role: {},
      response: {
        data: []
      },
      options: {},
      roleDialog: false,
      roleDialogDelete: false,
      dialogDelete: {}
    };
  },
  watch: {
    async filterRole(value) {
      let me = this;
      let op = Object.assign(me.options, { filter: value, page: 1, itemsPerPage: 10 });
      me.response = await me.$repository.Role.index(op);
    }
  },
  methods: {
    async getRoles(options) {
      if (options) { this.options = options; }
      let op = Object.assign({}, this.options);
      this.response = await this.$repository.Role.index(op);
    },
    // sorting(options) {
    //   this.options = options;
    //   this.getRoles();
    // },
    newRole() {
      this.role = {};
      this.roleDialog = true;
    },
    editRole(item) {
      this.role = Object.assign({}, item);
      this.roleDialog = true;
    },
    editRolePermissions(item) {
      this.$router.push(`/roles/${item.id}`);
    },
    beforeDeleteRole(item) {
      // dialogDelete;
      this.dialogDelete = {
        text: "Desea eliminar el Rol ",
        strong: item.name,
        payload: item
      };
      this.roleDialogDelete = true;
    },
    async deleteRole(item) {
      await this.$repository.Role.delete(item.id, item)
        .then(res => {
          this.getRoles();
          this.roleDialogDelete = false;
        })
        .catch(e => { });
    },
    async saveRole(item) {
      let me = this;
      if (item.id) {
        await this.$repository.Role.update(item.id, item)
          .then(res => {
            me.getRoles();
            me.roleDialog = false;
          })
          .catch(e => { });
      } else {
        await this.$repository.Role.create(item)
          .then(res => {
            me.getRoles();
            me.roleDialog = false;
          })
          .catch(e => { });
      }
    },
    closeDialog() {
      this.roleDialog = false;
      this.clearErrors();
      // this.$store.dispatch("validation/clearErrors");
    }
  },
  async asyncData({ app }) {
    let op = {
      sortBy: ["name"],
      sortDesc: [false],
      itemsPerPage: 10
    };
    //NOTE Repository https://medium.com/js-dojo/consuming-apis-in-nuxt-using-the-repository-pattern-8a13ea57d520
    const res = await app.$repository.Role.index(op)
      .catch(e => { });
    return { response: res, options: op };
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Roles", icon: "redhat" });
  }
}
</script>
