<template>
  <div>
    <v-btn
      color="success"
      @click="$router.push('consolidate/new')"
      class="mb-1 mr-1"
    >
      <v-icon class="mr-1">mdi-account-plus</v-icon> Nuevo Miembro
    </v-btn>
    <v-btn
      :disabled="!canAddAddress"
      color="primary"
      class=""
      @click="openMemberAddressDialog"
    >
      <v-icon class="mr-1">mdi-home-city</v-icon> Añadir Domicilio
    </v-btn>

    <MemberSimpleTable
      :members="members"
      @editItem="editItem"
      @deleteItem="beforeDeleteMember"
      @toogleChecks="toogleChecks"
    ></MemberSimpleTable>
    <DialogDelete
      v-if="showDialogDelete"
      :dialog="dialogDelete"
      @ok="deleteMember"
      @close="showDialogDelete = false"
    ></DialogDelete>
    <MemberAddressDialog
      v-if="showMemberAddressDialog"
      @save="saveMemberAddress"
      @close="showMemberAddressDialog = false"
    ></MemberAddressDialog>
  </div>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes("consolidador-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Consolidar",
      icon: "account-plus",
    });
  },
  async asyncData({ $axios, app }) {
    const res = await app.$repository.Member.indexMyNoAddress().catch(
      (e) => {}
    );
    return { ...res };
  },
  props: {},
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
      showMemberAddressDialog: false,
      dialogDelete: {},
    };
  },
  computed: {
    canAddAddress() {
      let match = this.members.find((m) => m.check == true);
      if (match) return true;
      return false;
    },
  },
  methods: {
    toogleChecks({ check, item }) {
      if (item) {
        this.members.map((m) => (m.id == item.id ? { ...m, check: check } : m));
      } else {
        this.members.forEach((m) => (m.check = check));
      }
      this.members = [...this.members];
    },
    openMemberAddressDialog() {
      this.showMemberAddressDialog = true;
    },
    async saveMemberAddress(address) {
      let member_ids = this.members
        .filter((m) => m.check == true)
        .map((m) => m.id);
      let me = this;

      await this.$repository.MemberAddess.create({ ...address, member_ids })
        .then((res) => {
          this.showMemberAddressDialog = false;
          me.getMembersNoAddress();
        })
        .catch((e) => {});
    },
    async getMembersNoAddress() {
      let { members } = await this.$repository.Member.indexMyNoAddress();
      this.members = members;
    },
    beforeDeleteMember(item) {
      this.showDialogDelete = true;
      this.dialogDelete = {
        text: "Desea eliminar el Miembro ",
        strong: `${item.name} ${item.paternal_surname}`,
        payload: item,
      };
      // this.userx = Object.assign({}, item);
    },
    editItem(item) {
      this.$router.push(`/consolidate/${item.id}`);
    },
    async deleteMember(item) {
      await this.$repository.Member.delete(item.id)
        .then((res) => {
          this.showDialogDelete = false;
          this.getMembersNoAddress();
        })
        .catch((e) => {});
    },
  },
  mounted() {
    let me = this;
  },
};
</script>
