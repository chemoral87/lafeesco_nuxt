<template>
  <v-container>
    <div class="text-h6">{{ profile.organization_name }} ({{ profile.organization_short_code }})</div>
    <v-row>
      <v-col cols="12" md="6">
        <RoleCombobox :roles="profile.roles" @modelChange="setRoles"></RoleCombobox>
      </v-col>
      <v-col cols="12" md="6">
        <PermissionCombobox
          :permissionsx="profile.direct_permissions"
          label="Permisos Directos"
          @modelChange="setDirectPermissions"
        ></PermissionCombobox>
      </v-col>

      <v-col cols="12" class="d-flex justify-end">
        <v-btn @click="back()" color="primary" outlined class="mr-1"> Cancelar </v-btn>
        <v-btn @click="saveProfileRolesPermissions()" color="primary"> Guardar </v-btn>
      </v-col>
    </v-row>
    <!-- {{ profile }} -->
  </v-container>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      profile: {},
      user_id: this.$route.params.id,
      profile_id: this.$route.params.profile_id
    };
  },
  methods: {
    setRoles(roles) {
      this.profile.roles = roles;
    },
    setDirectPermissions(permissions) {
      this.profile.direct_permissions = permissions;
    },
    back() {
      this.$router.push(`/users/${this.user_id}/profiles`);
    },
    async saveProfileRolesPermissions() {
      let role_ids = this.profile.roles.map(x => x.id);
      let permissions_ids = this.profile.direct_permissions.map(x => x.id);
      let params = {
        role_ids: role_ids,
        permissions_ids: permissions_ids
      };
      await this.$repository.Profile.update(this.user_id, this.profile_id, params).then(res => {
        // this.$auth.fetchUser(); // refresh permissions
        this.$router.push(`/users/${this.user_id}/profiles`);
      });
    }
  },
  mounted() {
    let me = this;
  },
  async asyncData({ $axios, app, params }) {
    const _mUser = await app.$repository.User.show(params.id).catch(e => {});
    // const res2 = await app.$repository.Profile.index(params.id).catch(e => {});
    const _profile = await app.$repository.Profile.show(params.id, params.profile_id).catch(e => {});
    return { mUser: _mUser, profile: _profile };
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: `Perfilx: ${this.mUser.name} ${this.mUser.last_name}`,
      icon: "account",
      back: this.back,
      show_drawer: false
    });
  }
};
</script>
