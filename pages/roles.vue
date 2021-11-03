<template>
  <div>
    <h1>Roles</h1>
    {{roles}}
  </div>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      roles: []
    }
  },
  methods: {
    // async initialize() {
    //   let me = this;
    //   try {
    //     const res = await this.$axios.$get('/roles');
    //     this.roles = res.data;
    //     // return { roles: res.data };
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }
  },
  // async created() {
  //   console.log("Created")
  //   // check permissions
  //   if (this.permissions.includes('roles-index')) {
  //     // console.log("si permiso")
  //     await this.initialize();
  //   } else {
  //     // console.log("no permiso")
  //     this.$router.push('/dashboard');
  //   }
  // },
  //  async asyncData({ $axios, params }) {
  async asyncData({ store, $axios, redirect }) {
    // console.log(store.getters.permissions)
    if (store.getters.permissions.includes('roles-index')) {
      // console.log("si permiso")
    } else {
      redirect('/dashboard');
      return;
    }
    try {
      const res = await $axios.$get('/roles');
      return { roles: res.data };
    } catch (e) {
      console.log(e)
    }
  }
}
</script>