<template>
  <v-container>
    <v-row dense>
      <v-col cols="12">
        <h1 class="text-h5">
          <v-btn @click="$router.push('/roles')" class="mr-2" fab small color="return">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-icon class="mr-1">mdi-account</v-icon>
          Rol: {{ mRole.name }}
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('role-update'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  data() {
    return {
      mRole: {}
    };
  },
  async asyncData({ $axios, app, params }) {
    const res = await app.$repository.Role.show(params.id)
      .catch(e => { });
    return { mRole: res };
  }
}
</script>

