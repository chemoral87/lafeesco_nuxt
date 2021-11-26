<template>
  <div>
    <v-combobox v-model="model" :filter="filter" item-value="id" item-text="name" hide-selected :hide-no-data="!search" :items="items" :search-input.sync="search" label="Permisos directos" multiple>
      <template v-slot:no-data>
        <v-list-item>
          Intente con otra busqueda...
        </v-list-item>
      </template>
      <template v-slot:selection="{ attrs, item, parent, selected }">
        <v-chip v-if="item === Object(item)" v-bind="attrs" :color="`info`" :input-value="selected" label>
          <span class="pr-2">
            {{ item.name }}
          </span>
          <v-icon small @click="parent.selectItem(item)">
            $delete
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <!-- <v-text-field v-if="editing === item" v-model="editing.text" autofocus flat background-color="transparent" hide-details solo @keyup.enter="edit(index, item)"></v-text-field> -->
        <v-chip :color="`${item.color} `" dark label small>
          {{ item.name }}
        </v-chip>
        <v-spacer></v-spacer>

      </template>
    </v-combobox>
  </div>
</template>
<script>
export default {
  props: ["direct_permissions"],
  data: () => ({
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
    editing: null,
    editingIndex: -1,
    items: [
      // { header: 'Teclee para filtar' },

    ],
    nonce: 1,
    menu: false,
    model: [
      // {
      //   name: 'Foo',
      //   color: 'blue',
      // },
    ],
    x: 0,
    search: null,
    y: 0,
  }),
  computed: {
    permissions_id() {
      let ids = [];
      this.model.forEach(element => {
        ids.push(element.id);
      });
      return ids;
    }
  },
  watch: {
    async search(val, prev) {
      if (val == null || val.trim() == "") {
        this.items = [
          // { header: 'Teclee para filtar' }
        ];
      }
      else {
        let itemz = await this.$repository.Permission.filter({ queryText: val, ids: this.permissions_id });
        itemz.unshift(
          // { header: 'Teclee para filtar' }
        );
        this.items = itemz;
      }
    },
    model(val, prev) {
      if (val.length === prev.length) return;
      var i = val.length;
      while (i--) {
        if (typeof val[i] === 'string') {
          val.splice(i, 1);
        }
      }
      this.model = val;
      this.$emit("modelChange", val);
    },
  },
  mounted() {
    this.model = this.direct_permissions;
  },
  methods: {
    filter(item, queryText, itemText) {
      const hasValue = val => val != null ? val : '';
      const text = hasValue(itemText);
      const query = hasValue(queryText);
      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1;
    },
  },
}
</script>
