<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <h1 class="text-h5">
          <v-icon class="mr-1">mdi-redhat</v-icon>
          Roles
        </h1>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
        <v-btn @click="newRole()" color="primary">
          <v-icon class="mr-1">mdi-plus</v-icon> Nuevo
        </v-btn>
        <v-btn @click="getRoles()" color="primary">
          <v-icon class="mr-1">mdi-reload</v-icon> Refrescar
        </v-btn>
      </v-col>
      <v-col cols="12">
        <client-only>
          <RoleTable @sorting="getRoles" :options="options" :response="response" @edit="editRole" @delete="beforeDeleteRole"></RoleTable>
        </client-only>
      </v-col>
    </v-row>
    <RoleDialog :role="role" v-if="roleDialog" @close="closeDialog" @save="saveRole" />
    <RoleDialogDelete :role="role" v-if="roleDialogDelete" @close="roleDialogDelete = false" @ok="deleteRole" />
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
      role: {},
      response: {
        data: []
      },
      options: {},
      roleDialog: false,
      roleDialogDelete: false
    };
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
    beforeDeleteRole(item) {
      this.roleDialogDelete = true;
      this.role = Object.assign({}, item);
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

  async asyncData({ $axios, app }) {
    let op = {
      sortBy: ["name"],
      sortDesc: [false]
    };
    //NOTE Repository https://medium.com/js-dojo/consuming-apis-in-nuxt-using-the-repository-pattern-8a13ea57d520
    const res = await app.$repository.Role.index(op)
      .catch(e => { });
    return { response: res, options: op };
  }
}
</script>