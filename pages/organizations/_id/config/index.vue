<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <v-row dense>
              <v-col cols="12">
                <h3>{{ organization.name }} ({{ organization.short_code }})</h3>
              </v-col>
              <br /><br />

              <v-col cols="12">
                <v-row dense>
                  <v-col cols="12" v-for="(group, groupName) in groupedItems" :key="groupName">
                    <v-subheader>{{ groupName }}</v-subheader>
                    <v-row dense>
                      <v-col cols="3" v-for="config in group" :key="config.id">
                        <v-text-field
                          v-model="config.value"
                          outlined
                          :label="getLastSegment(config.key)"
                          hide-details
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col class="text-right">
                <v-btn @click="goBack()" color="primary" outlined>
                  <span>Cancelar</span>
                </v-btn>
                <v-btn @click="saveOrganizationConfig()" color="primary">
                  <span>Guardar</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <!-- {{ items }} -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  async asyncData({ $axios, app, params, store, error }) {
    let org_ids = await store.dispatch("validatePermission", { permission: "organization-update", error });

    let options = {
      sortBy: ["name"],
      sortDesc: [true],
      itemsPerPage: 5
    };
    const organization = await app.$repository.Organization.show(params.id).catch(e => {});
    const res = await app.$repository.OrganizationConfig.index(params.id).catch(e => {});

    return { organization, organization_configs: res.organization_configs, configs: res.configs };
  },
  props: {},
  data() {
    return {
      items: [],

      organization: {},
      configs: [],
      organization_configs: [],

      org_id: this.$route.params.id
    };
  },
  methods: {
    getLastSegment(str) {
      let stri = str.split(".").pop();
      // replace underscore with space
      stri = stri.replace(/_/g, " ");

      return stri;
    },
    async saveOrganizationConfig() {
      let me = this;

      await this.$repository.OrganizationConfig.create(this.org_id, { configs: this.items }).then(response => {
        me.$router.push("/organizations");
      });
    },
    goBack() {
      this.$router.push("/organizations");
    }
  },
  mounted() {
    let me = this;
    this.items = this.keys;
  },
  computed: {
    groupedItems() {
      const grouped = {};
      this.items.forEach(item => {
        const groupName = item.key.split(".")[0]; // Extract the first segment
        if (!grouped[groupName]) {
          grouped[groupName] = [];
        }
        grouped[groupName].push(item);
      });
      return grouped;
    },
    keys() {
      let keys = [];
      // get key value for each configs
      this.configs.forEach(config => {
        keys.push({ config_id: config.id, key: config.key, value: "" });
      });
      this.organization_configs.forEach(config => {
        keys.push({ config_id: config.config_id, key: config.key, value: config.value });
      });

      // sort asc keys by key name
      keys.sort((a, b) => (a.key > b.key ? 1 : -1));

      return keys;
    }
  },

  created() {
    this.$nuxt.$emit("setNavBar", {
      title: "Organizacion Configuración",
      icon: "domain",
      back: this.goBack
    });
  }
};
</script>
