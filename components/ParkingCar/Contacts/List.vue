<template>
  <v-card color="green lighten-4">
    <v-card-title>
      Contactos <v-spacer />
      <v-btn color="primary" @click="newContact()" class="ml-3"> <v-icon>mdi-plus</v-icon> Nuevo </v-btn>
    </v-card-title>
    <v-list>
      <v-list-item-group v-if="contacts.length > 0">
        <v-list-item v-for="(contact, ix) in contacts" :key="contact.id">
          <v-list-item-avatar>
            <v-img :src="contact.photo" alt="Avatar"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              #{{ contact.order }} {{ contact.name }}
              {{ contact.paternal_surname }}
              {{ contact.maternal_surname }}
            </v-list-item-title>
            <v-list-item-subtitle> {{ contact.role }} {{ contact.phone }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon color="primary" @click="editContact(contact)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-list-item-action>

          <v-list-item-action>
            <v-btn icon color="error" @click="confirmDelete(contact)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>

      <v-list-item v-else>
        <v-list-item-content>No items available</v-list-item-content>
      </v-list-item>
    </v-list>

    <v-dialog v-model="dialogUpdate" persistent width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Editar Contacto</span>
          <v-spacer />
          <v-icon @click.native="dialogUpdate = false"> $delete </v-icon>
        </v-card-title>
        <v-form ref="formUpdate" @submit.prevent="updateContact()">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field v-model="item.name" label="Nombre" :rules="[$vrules.required]" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="item.phone" label="Teléfono" v-mask="'##-####-#####'" />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" class="mr-1" outlined @click.native="dialogUpdate = false"> Cancelar </v-btn>
            <v-btn color="primary" type="submit"> Guardar </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogAdd" persistent width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Nuevo Contacto</span>
          <v-spacer />
          <v-icon @click.native="dialogAdd = false"> $delete </v-icon>
        </v-card-title>
        <v-form ref="formSave" @submit.prevent="saveContact()">
          <v-card-text>
            <v-row dense>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field v-model="item.name" label="Nombre" :rules="[$vrules.required]" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="item.phone"
                    label="Teléfono"
                    v-mask="'##-####-#####'"
                    :rules="[$vrules.required]"
                  />
                </v-col>
              </v-row>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" class="mr-1" outlined @click.native="dialogAdd = false"> Cancelar </v-btn>
            <v-btn color="primary" type="submit"> Guardar </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <DialogDelete
      v-if="dialogDelete"
      :dialog="dialogDeleteProp"
      @ok="
        item => {
          deleteContact(item);
          // $emit('delete', item);
        }
      "
      @close="dialogDelete = false"
    />
  </v-card>
</template>
<script>
export default {
  props: {
    contacts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      item: {},
      contact_old: {},

      dialogDelete: false,
      dialogAdd: false,
      dialogUpdate: false,
      dialogDeleteProp: {}
    };
  },
  methods: {
    newContact() {
      this.item = Object.assign(
        {},
        {
          phone: "",
          name: ""
        }
      );

      this.dialogAdd = true;
      if (this.$refs.formSave) this.$refs.formSave.resetValidation();
    },
    async updateContact() {
      if (!this.$refs.formUpdate.validate()) return;

      // how to update item in contacts_list

      const index = this.contacts.findIndex(contact => contact.id == this.item.id);
      if (index != -1) {
        this.$set(this.contacts, index, { ...this.item });
        // this.$emit('update:contacts', this.contacts); // Emit the updated contacts list
      }

      this.dialogUpdate = false;
      this.item = {
        name: "",
        phone: ""
      };

      // await this.$repository.FaithHouseContact.updateForm(this.faith_house_id, this.item.id, this.formDataUpdate)
      //   .then(res => {
      //     this.indexContact();
      //     this.dialogUpdate = false;
      //   })
      //   .catch(e => {});
    },
    async saveContact() {
      if (!this.$refs.formSave.validate()) return;

      this.contacts.push(this.item);
      this.dialogAdd = false;
      this.item = {
        name: "",
        phone: ""
      };

      // await this.$repository.FaithHouseContact.createForm(this.faith_house_id, this.formData)
      //   .then(res => {
      //     // this.$router.push("/faith-house");
      //     this.indexContact();
      //     this.dialogAdd = false;
      //   })
      //   .catch(e => {});
    },

    async indexContact() {
      // let me = this;
      // let contacts = await me.$repository.FaithHouseContact.index(me.faith_house_id);
      // me.$emit("update:contacts", contacts);
    },
    editContact(item) {
      this.item = Object.assign({}, item);
      this.$nextTick(() => {
        this.dialogUpdate = true;
      });
    },
    confirmDelete(item) {
      this.dialogDeleteProp = {
        text: `Desea eliminar el contacto  `,
        strong: item.name,
        payload: item
      };
      this.$nextTick(() => {
        this.dialogDelete = true;
      });
    },
    async deleteContact(item) {
      // remote item from contacts_list
      const index = this.contacts.findIndex(contact => contact.id == item.id);
      if (index != -1) {
        this.contacts.splice(index, 1);
        // this.$emit('update:contacts', this.contacts); // Emit the updated contacts list
      }
      this.dialogDelete = false;
    }
  },
  computed: {
    formData() {
      const formData = new FormData();
      const fields = ["order", "name", "paternal_surname", "maternal_surname", "role", "phone", "email", "photo_blob"];

      fields.forEach(field => {
        const value = this.item[field];
        if (value !== undefined && value !== null) {
          formData.append(field, value);
        }
      });
      return formData;
    },
    formDataUpdate() {
      const formData = new FormData();
      const fields = ["order", "name", "paternal_surname", "maternal_surname", "role", "phone", "email", "photo_blob"];

      fields.forEach(field => {
        const value = this.item[field];
        if (value !== undefined && value !== null) {
          formData.append(field, value);
        }
      });

      formData.append("_method", "PUT");
      return formData;
    }
  },
  mounted() {
    let me = this;
  }
};
</script>
