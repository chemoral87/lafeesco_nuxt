<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="3">
        <v-text-field append-icon="mdi-magnify" clearable hide-details v-model="filterUser" placeholder="Filtro" />
      </v-col>

      <v-col cols="12" md="4">
        <v-btn @click="newUser()" color="primary" class="mr-1"> <v-icon>mdi-plus</v-icon> Nuevo </v-btn>
        <v-btn @click="getUsers()" color="primary"> <v-icon>mdi-reload</v-icon> Refrescar </v-btn>
      </v-col>
      <v-col cols="12">
        <UserTable
          @sorting="getUsers"
          :options="options"
          :response="response"
          @edit="editUser"
          @editProfiles="editProfiles"
          @delete="beforeDeleteUser"
        ></UserTable>
      </v-col>
    </v-row>
    <UserDialog :userx="userx" v-if="userDialog" @close="closeDialog" @save="saveUser" />
    <DialogDelete
      v-if="userDialogDelete"
      :dialog="dialogDelete"
      @ok="deleteUser"
      @close="userDialogDelete = false"
    ></DialogDelete>
    <!-- <UserDialogDelete :userx="userx" v-if="userDialogDelete" @close="userDialogDelete = false" @ok="deleteUser" /> -->
  </v-container>
</template>
<script>
export default {
  middleware: ["authenticated"],

  data() {
    return {
      userx: {},
      options: {},
      filterUser: "",
      userDialog: false,
      userDialogDelete: false
    };
  },
  watch: {
    async filterUser(value) {
      this.$store.dispatch("hideNextLoading");
      let me = this;
      let op = Object.assign(me.options, { filter: value, page: 1 });
      // me.response = await me.$repository.User.index(op);
      me.getUsers(op);
    }
  },
  methods: {
    newUser() {
      this.userx = {};
      this.userDialog = true;
    },
    editUser(item) {
      this.userDialog = true;
      this.userx = Object.assign({}, item);
    },
    editUserRoles(item) {
      this.$router.push(`/users/${item.id}`);
    },
    editProfiles(item) {
      this.$router.push(`/users/${item.id}/profiles`);
    },
    beforeDeleteUser(item) {
      this.userDialogDelete = true;
      this.dialogDelete = {
        text: "Desea eliminar el Usuario ",
        strong: `${item.name} ${item.last_name}  ${item.second_last_name ? item.second_last_name : ""}`,
        payload: item
      };
      // this.userx = Object.assign({}, item);
    },
    async deleteUser(item) {
      await this.$repository.User.delete(item.id, item)
        .then(res => {
          this.getUsers();
          this.userDialogDelete = false;
        })
        .catch(e => {});
    },
    async getUsers(options) {
      if (options) {
        this.options = options;
      }
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
          .catch(e => {});
      } else {
        await this.$repository.User.create(item)
          .then(res => {
            me.getUsers();
            me.userDialog = false;
          })
          .catch(e => {});
      }
    },
    closeDialog() {
      this.userDialog = false;
      this.clearErrors();
    }
  },

  async asyncData({ $axios, app, store, error }) {
    store.dispatch("validatePermission", { error, permission: "user-index" });

    let op = {
      sortBy: ["name"],
      sortDesc: [false],
      itemsPerPage: 10
    };

    const res = await app.$repository.User.index(op).catch(e => {});
    return { response: res, options: op };
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Usuarios", icon: "account" });
  }
};
</script>
