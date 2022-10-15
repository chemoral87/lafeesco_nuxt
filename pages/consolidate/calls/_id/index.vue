<!-- /consolidate/calls/_id -->
<template>
  <div>
    <v-sheet color="lime lighten-5">
      <v-card-text class="text--primary">
        <v-row dense>
          <v-col cols="auto" class="mr-2"
            ><strong>Nombre</strong> {{ member.name }}
            {{ member.paternal_surname }} {{ member.maternal_surname }}</v-col
          >
          <v-col cols="auto" class="mr-2">
            <strong>Celular</strong> {{ member.cellphone }}
          </v-col>
          <v-col cols="auto" class="mr-2">
            <v-btn color="primary" fab small @click="openCall">
              <v-icon>mdi-phone</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto" class="mr-2" v-if="member.category">
            <strong>Grupo</strong> {{ member.category }}
          </v-col>
          <v-col cols="auto" class="mr-2" v-if="member.marital_status">
            <strong>Estado Civil</strong> {{ member.marital_status }}
          </v-col>

          <v-col cols="auto" class="mr-2" v-if="member.years">
            <strong>Edad</strong> {{ member.years }}
          </v-col>
          <v-col cols="auto" class="mr-2" v-if="member.prayer_request">
            <strong>Petición</strong> {{ member.prayer_request }}
          </v-col>
          <v-col cols="auto" class="mr-2" v-if="member.next_call_type">
            <strong>Siguiente Llamada</strong> {{ member.next_call_type }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-sheet>
    <v-card>
      <v-card-text>
        <v-form ref="formSave" @submit.prevent="saveCall">
          <v-row dense>
            <v-col cols="auto">
              <v-select
                label="Contactado"
                v-model="call.was_contacted"
                :items="was_contacted_items"
                item-text="text"
                item-value="value"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="auto">
              <v-select
                label="Tipo de Llamada"
                v-model="call.call_type_id"
                :items="call_types_filtered"
                item-text="name"
                item-value="id"
                outlined
                hide-details
              />
            </v-col>
            <v-col cols="auto">
              <v-text-field
                label="Comentarios"
                v-model="call.comments"
                outlined
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit" class="mr-4" color="primary">Guardar</v-btn>
              <v-btn
                color="primary"
                outlined
                @click="$router.push('/consolidate/calls')"
              >
                <!-- <v-icon>mdi-arrow-left</v-icon> -->
                Cancelar
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <MemberCallTable
          @sorting="getCalls"
          :options="options"
          :response="responseCalls"
          @edit="openDialog"
        ></MemberCallTable>
        <MemberCallDialog
          :memberCall="memberCall"
          v-if="MemberCallDialog"
          @close="MemberCallDialog = false"
          @save="saveMemberCall"
        ></MemberCallDialog>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  validate({ store, error }) {
    if (store.getters.permissions.includes("consolidador-index")) return true;
    else throw error({ statusCode: 403 });
  },
  created() {
    let { name } = this.member;
    this.$nuxt.$emit("setNavBar", {
      title: `Seguimiento ${name}`,
      icon: "phone",
    });
  },
  async asyncData({ app, params, store }) {
    let options = {
      sortBy: ["created_at"],
      sortDesc: [true],
      itemsPerPage: 10,
    };
    const responseCalls = await app.$repository.MemberCall.indexByMember(
      params.id,
      options
    );
    const call_types = await store.dispatch("catalogs/fetchCallTypes");
    const member = await app.$repository.Member.show(params.id);
    return { member, call_types, responseCalls, id: params.id, options };
  },
  computed: {
    call_types_filtered() {
      return this.call_types.filter(
        (x) => x.was_contacted == this.call.was_contacted
      );
    },
  },
  data() {
    return {
      id: 0,
      member: {},
      MemberCallDialog: false,
      memberCall: {},
      was_contacted_items: [
        { value: 1, text: "SI" },
        { value: 0, text: "NO" },
      ],
      call: {
        was_contacted: 1,
        call_type_id: null,
      },
      options: {},
      responseCalls: [],
      call_types: [],
    };
  },
  methods: {
    async saveMemberCall(item) {
      let me = this;
      await this.$repository.MemberCall.update(item.id, item)
        .then((res) => {
          me.MemberCallDialog = false;
          me.getCalls(null);
        })
        .catch((e) => {});
    },
    openDialog(item) {
      this.memberCall = item;
      this.MemberCallDialog = true;
    },
    openCall() {
      let phone = this.member.cellphone.replaceAll("-", "");
      // window.open(`tel:${phone}`);
      document.location.href = "tel:" + phone;
    },
    async saveCall() {
      let me = this;
      if (!this.$refs.formSave.validate()) return;
      let params = { ...this.call, member_id: this.id };
      await this.$repository.MemberCall.create(params)
        .then((res) => {
          me.$router.push("/consolidate/calls");
        })
        .catch((e) => {});
    },
    async getCalls(options) {
      this.options = options ? options : this.options;
      this.responseCalls = await this.$repository.MemberCall.indexByMember(
        this.id,
        this.options
      );
    },
  },
  mounted() {
    let me = this;
    me.call.call_type_id = this.member.next_call_type_id;
  },
};
</script>
