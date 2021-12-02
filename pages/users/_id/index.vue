<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <h1 class="text-h5">
          <v-btn @click="$router.push('/users')" class="mr-2" fab small color="return">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-icon class="mr-1">mdi-account</v-icon>
          Usuario: {{ mUser.name }} {{ mUser.last_name }}
        </h1>
      </v-col>
      <v-col cols="12" md="6">
        <RoleCombobox :roles="mUser.roles" @modelChange="setRoles"></RoleCombobox>
      </v-col>
      <v-col cols="12" md="6">
        <PermissionCombobox :permissionsx="mUser.direct_permissions" label="Permisos Directos" @modelChange="setDirectPermissions"></PermissionCombobox>
      </v-col>
      <v-col cols="12">
        <v-btn @click="$router.push('/users')" color="grey" outlined class="mr-2">
          Cancelar
        </v-btn>
        <v-btn @click="saveUserRolesPermissions()" color="primary">
          Guardar
        </v-btn>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('user-update'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  data() {
    return {
      mUser: {}
    };
  },
  computed: {
    user_id() {
      return this.$route.params.id;
    }
  },
  methods: {
    setRoles(roles) {
      this.mUser.roles = roles;
    },
    setDirectPermissions(permissions) {
      this.mUser.direct_permissions = permissions;
    },
    async saveUserRolesPermissions() {
      let role_ids = this.mUser.roles.map(x => x.id);
      let permissions_ids = this.mUser.direct_permissions.map(x => x.id);
      let params = {
        role_ids: role_ids,
        permissions_ids: permissions_ids
      };
      await this.$repository.User.children(this.mUser.id, params)
        .then(res => {
          this.$router.push('/users');
        });
    }
  },

  async asyncData({ $axios, app, params }) {
    const res = await app.$repository.User.show(params.id)
      .catch(e => { });
    return { mUser: res };
  }
}
</script>

<style>
</style>