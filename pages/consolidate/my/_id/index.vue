<template>
  <v-container fluid>
    <MemberFormEdit :member="member" @cancel="cancel" @save="saveMember" />
    <v-row dense class="mt-2">
      <v-col cols="12">
        <v-subheader>Historial de llamadas</v-subheader>
        <MemberCallTable @sorting="getCalls" :options="callOptions" :response="callResponse" @edit="openDialog"></MemberCallTable>
        <MemberCallDialog :memberCall="memberCall" v-if="MemberCallDialog" @close="MemberCallDialog = false" @save="saveMemberCall"></MemberCallDialog>
      </v-col>
    </v-row>
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
    // const initialCatalog = await app.$repository.Consolidation.initialCatalog()
    //   .catch(e => { });
    let callOptions = {
      sortBy: ["created_at"],
      sortDesc: [true],
      itemsPerPage: 10
    };
    const callResponse = await app.$repository.MemberCall.indexByMember(params.id, callOptions);
    const member = await app.$repository.Member.show(params.id);
    return { callOptions, callResponse, member, id: params.id };
  },
  props: {
  },
  data() {
    return {
      coma: "",
      id: 0,
      member: {},

      callResponse: [],
      callOptons: {},
      MemberCallDialog: false,
      memberCall: {},
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
    openDialog(item) {
      this.memberCall = item;
      this.MemberCallDialog = true;

    },
    async saveMemberCall(item) {
      let me = this;
      await this.$repository.MemberCall.update(item.id, item)
        .then(res => {
          me.MemberCallDialog = false;
          me.getCalls(null);
        })
        .catch(e => { });
    },
    cancel() {
      this.$router.push("/consolidate/my");
    },
    async saveMember(item) {
      await this.$repository.Member.update(this.id, item)
        .then(res => {
          this.$router.push("/consolidate/my");
        })
        .catch(e => { });
    },
    async getCalls(options) {
      this.callOptions = options ? options : this.callOptions;

      this.callResponse = await this.$repository.MemberCall.indexByMember(this.id, this.callOptions);
    }
  },
  mounted() {
    let me = this;
  }
}
</script>

