<template>
  <v-container fluid>
    <MemberFormEdit :member="member" @cancel="cancel" @save="saveMember" />

  </v-container>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes('consolidador-update'))
      return true;
    else
      throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", { title: "Editar Miembro", icon: "account-plus" });
  },
  async asyncData({ $axios, app, params }) {
    const member = await app.$repository.Member.show(params.id).catch(e => { });;
    return { member, id: params.id };
  },
  props: {
  },
  data() {
    return {
      coma: "",
      id: 0,
      member: {},

      months: [
        { id: "01", name: "Enero" },
        { id: "02", name: "Febrero" },
        { id: "03", name: "Marzo" },
        { id: "04", name: "Abril" },
        { id: "05", name: "Mayo" },
        { id: "06", name: "Junio" },
        { id: "07", name: "Julio" },
        { id: "08", name: "Agosto" },
        { id: "09", name: "Septiembre" },
        { id: "10", name: "Octubre" },
        { id: "11", name: "Noviembre" },
        { id: "12", name: "Diciembre" },
      ]
    };
  },
  methods: {
    cancel() {
      this.$router.push("/consolidate");
    },
    async saveMember() {
      await this.$repository.Member.update(this.id, this.member)
        .then(res => {
          this.$router.push("/consolidate");
        })
        .catch(e => { });
    }
  },
  mounted() {
    let me = this;
  }
}
</script>

