<template>
  <div>

    <v-combobox v-model="model" :filter="filter" item-value="id" item-text="name" :hide-no-data="!search" :items="items" :search-input.sync="search" hide-selected label="Roles" multiple>
      <template v-slot:no-data>
        <v-list-item>
          Intente con otra busqueda...
        </v-list-item>
      </template>
      <template v-slot:selection="{ attrs, item, parent, selected }">
        <v-chip v-if="item === Object(item)" v-bind="attrs" :color="`primary`" :input-value="selected" label>
          <span class="pr-2">
            {{ item.name }}
          </span>
          <v-icon small @click="parent.selectItem(item)">
            $delete
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
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
  props: ["roles"],
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
    roles_id() {
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
        let itemz = await this.$repository.Role.filter({ queryText: val, ids: this.roles_id });
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
    this.model = this.roles;
    // this.items = [];
    // this.roles.forEach(element => {
    //   console.log(element.name, 2);
    //   this.items.push({ text: element.name, color: 'blue' });
    // });
    // console.log("mounted");
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
