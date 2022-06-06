<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <MemberToCallTable @sorting="indexMembersToCall" :options="options" :response="response" @edit="" @delete="" />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('consolidador-index'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Seguimiento", icon: "phone" });
  },
  async asyncData({ $axios, app, params }) {
    let options = {
      sortBy: ["next_call_date"],
      sortDesc: [false],
      itemsPerPage: 10
    };
    const response = await app.$repository.Member.toCall(options)
      .catch(e => { });

    return { response, options };
  },
  props: {
  },
  data() {
    return {
      response: {},
      options: {},
      filter: ""
    };
  },
  methods: {
    async indexMembersToCall(options) {
      // console.log("indexMyMembers", ev);

      if (options) { this.options = options; }
      let op = Object.assign({ filter: this.filter }, this.options);
      this.response = await this.$repository.Member.toCall(op);
    },
  },
  mounted() {
    let me = this;
  }
}
</script>
