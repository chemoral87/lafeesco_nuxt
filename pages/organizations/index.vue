<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="2">
        <v-text-field
          append-icon="mdi-magnify"
          clearable
          hide-details
          v-model="filterOrganization"
          placeholder="Filtro"
        ></v-text-field>
      </v-col>

      <v-spacer />
      <v-col cols="auto">
        <v-btn color="success" @click="newOrganization()" class="mb-1 mr-1">
          <v-icon>mdi-account-plus</v-icon>Nuevo Organization
        </v-btn>
      </v-col>
      <v-col cols="12">
        <OrganizationTable
          @sorting="indexOrganizations"
          :options="options"
          :response="response"
          @edit="editOrganization"
          @delete="deleteOrganization"
          :dialogDelete.sync="dialogDeleteOrganization"
        />
      </v-col>
    </v-row>
    <OrganizationFormDialog
      :organization="organization"
      v-if="organizationFormDialog"
      @close="closeFormDialog()"
      @save="saveOrganization"
    />
  </v-container>
</template>
<script>
export default {
  async asyncData({ $axios, app }) {
    let options = {
      sortBy: ["name"],
      sortDesc: [true],
      itemsPerPage: 5
    };
    const response = await app.$repository.Organization.index(options).catch(e => {});
    return { response, options };
  },
  watch: {
    async filterOrganization(value) {
      let me = this;
      this.$store.dispatch("hideNextLoading");
      let op = Object.assign(me.options, { filter: value, page: 1 });
      me.response = await me.$repository.Organization.index(op);
    }
  },
  methods: {
    newOrganization() {
      this.organization = {};
      this.organizationFormDialog = true;
    },
    editOrganization(item) {
      this.organization = Object.assign({}, item);
      this.organizationFormDialog = true;
    },
    async indexOrganizations(options) {
      if (options) {
        this.options = Object.assign(this.options, options);
      }
      let op = Object.assign({ filter: this.filter }, this.options);
      this.response = await this.$repository.Organization.index(op);
    },
    // editOrganization(item) {
    //   this.$router.push(`/organization/${item.id}`);
    // },
    async deleteOrganization(item) {
      await this.$repository.Organization.delete(item.id)
        .then(res => {
          this.dialogDeleteOrganization = false;
          this.indexOrganizations();
        })
        .catch(e => {});
    },

    async saveOrganization(item) {
      let me = this;
      if (item.id) {
        await this.$repository.Organization.update(item.id, item)
          .then(res => {
            me.indexOrganizations();
            me.organizationFormDialog = false;
          })
          .catch(e => {});
      } else {
        await this.$repository.Organization.create(item)
          .then(res => {
            me.indexOrganizations();
            me.organizationFormDialog = false;
          })
          .catch(e => {});
      }
    },
    closeFormDialog() {
      this.organizationFormDialog = false;
      this.clearErrors();
    }
  },
  data() {
    return {
      dialogDeleteOrganization: false,
      organizationFormDialog: false,
      options: {},
      response: {},
      filterOrganization: ""
    };
  },
  middleware: ["authenticated"],
  validate({ store, error }) {
    if (store.getters.permissions.includes("organization-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Organizaciones",
      icon: "domain"
    });
  }
};
</script>
