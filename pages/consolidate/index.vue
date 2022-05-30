<template>
  <v-container fluid>
    <v-flex>
      <v-btn color="success" @click="$router.push('consolidate/new')">
        <v-icon class="mr-1 mb-1">mdi-account-plus</v-icon> Nuevo Miembro
      </v-btn>
      <v-btn :disabled="!canAddAddress" color="primary" class=" ml-1" @click="addAddress">
        <v-icon class="mr-1">mdi-home-city</v-icon> Añadir Domicilio
      </v-btn>
    </v-flex>

    <MemberTable :members="members" @deleteItem="beforeDeleteMember"></MemberTable>
    <DialogDelete v-if="showDialogDelete" :dialog="dialogDelete" @ok="deleteMember" @close="showDialogDelete = false"></DialogDelete>
  </v-container>
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
    this.$nuxt.$emit("setNavBar", { title: "Consolidar", icon: "account-plus" });
  },
  async asyncData({ $axios, app }) {
    const res = await app.$repository.Member.myMembersNoAddress()
      .catch(e => { });
    return { ...res };
  },
  props: {
  },
  data() {
    return {
      member: {},
      members: [],
      marital_statuses: [],
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
      ],
      showDialogDelete: false,
      dialogDelete: {}
    };
  },
  computed: {
    canAddAddress() {
      console.log("canAddress");
      let match = this.members.find(m => (m.check == true));
      if (match) return true;
      return false;
    }
  },
  methods: {
    addAddress() {
      console.log("agregar domicilio");
    },
    beforeDeleteMember(item) {

      this.showDialogDelete = true;
      this.dialogDelete = {
        text: "Desea eliminar el Miembro ",
        strong: `${item.name} ${item.paternal_surname}`,
        payload: item
      };
      // this.userx = Object.assign({}, item);
    },

    async deleteMember(item) {
      await this.$repository.Member.delete(item.id)
        .then(res => {
          this.showDialogDelete = false;
          this.getMembersNoAddress();
        })
        .catch(e => { });
    },
    async getMembersNoAddress() {
      let { members } = await this.$repository.Member.myMembersNoAddress();
      this.members = members;
    },

  },
  mounted() {
    let me = this;
  }
}
</script>

