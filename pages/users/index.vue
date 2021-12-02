<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <h1 class="text-h5">
          <v-icon class="mr-1">mdi-account</v-icon>
          Usuarios
        </h1>
      </v-col>
      <v-col cols="12">
        <v-btn @click="newUser()" color="primary">
          <v-icon class="mr-1">mdi-plus</v-icon> Nuevo
        </v-btn>
        <v-btn @click="getUsers()" color="primary">
          <v-icon class="mr-1">mdi-reload</v-icon> Refrescar
        </v-btn>
      </v-col>
      <v-col cols="12">

        <UserTable @sorting="getUsers" :options="options" :response="response" @edit="editUser" @editRoles="editUserRoles" @delete="beforeDeleteUser"></UserTable>

      </v-col>
    </v-row>
    <UserDialog :userx="userx" v-if="userDialog" @close="closeDialog" @save="saveUser" />
    <UserDialogDelete :userx="userx" v-if="userDialogDelete" @close="userDialogDelete = false" @ok="deleteUser" />
  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('user-index'))
      return true;
    else
      throw error({ statusCode: 403 });
  },

  data() {
    return {
      userx: {},
      options: {},
      filterUser: "",
      userDialog: false,
      userDialogDelete: false,
    };
  },
  watch: {
    async filterUser(value) {
      let me = this;
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.User.index(op);
    }

  },
  methods: {
    newUser() {
      this.userx = {};
      this.userDialog = true;
    },
    editUser(item) {
      this.userDialog = true;
      this.userx = Object.assign({}, item);;
    },
    editUserRoles(item) {
      this.$router.push(`/users/${item.id}`);
    },
    beforeDeleteUser(item) {
      this.userDialogDelete = true;
      this.userx = Object.assign({}, item);
    },
    async deleteUser(item) {
      await this.$repository.User.delete(item.id, item)
        .then(res => {
          this.getUsers();
          this.userDialogDelete = false;
        })
        .catch(e => { });
    },
    async getUsers(options) {
      if (options) { this.options = options; }
      let op = Object.assign({ filter: this.filterUser }, this.options);
      this.response = await this.$repository.User.index(op);
    },
    async saveUser(item) {
      let me = this;
      if (item.id) {
        await this.$repository.User.update(item.id, item)
          .then(res => {
            me.getUsers();
            me.userDialog = false;
          })
          .catch(e => { });
      } else {
        await this.$repository.User.create(item)
          .then(res => {
            me.getUsers();
            me.userDialog = false;
          })
          .catch(e => { });
      }
    },
    closeDialog() {
      this.userDialog = false;
      this.clearErrors();
    }

  },

  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ["name"],
      sortDesc: [false]
    };

    const res = await app.$repository.User.index(op)
      .catch(e => { });
    return { response: res, options: op };
  }
}
</script>