<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th>
            <v-checkbox v-model="check" @change="toogleChecks" hide-details />
          </th>
          <th class="text-left"> Nombre Completo </th>
          <th class="text-left"> Celular</th>
          <th class="text-left"> Categoría</th>
          <th class="text-left"> Edad</th>
          <th class="text-left"> Estado Civil</th>
          <th class="text-left" style="min-width:140px"> Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in members" :key="item.name">
          <td>
            <v-checkbox v-model="item.check" hide-details />
          </td>
          <td>{{ getfullName(item.name, item.paternal_surname, item.maternal_surname)  }}</td>
          <td>{{ item.cellphone}}</td>
          <td>{{ item.category}}</td>
          <td>{{ item.years}}</td>
          <td>{{ item.marital_status}}</td>
          <td>
            <v-btn title="Editar" class="ma-1" color="primary" outlined fab small @click="emitAction('editItem',item)">
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn title="Eliminar" class="ma-1" color="error" outlined fab small @click="emitAction('deleteItem',item)">
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>

          </td>
        </tr>
      </tbody>

    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: ['members'],
  data() {
    return {
      check: false
    };
  },
  methods: {
    getfullName(name, paternal_surname, maternal_surname) {
      return [name, paternal_surname, maternal_surname].filter(Boolean).join(" ");
    },
    toogleChecks() {
      let check = this.check;
      this.members.forEach(m => m.check = check);
    },
    emitAction(event, payload) {
      this.$emit(event, payload);
    },
    // editItem(item) {
    //   this.$emit("editItem", item);
    // },
    // deleteItem(item) {
    //   this.$emit("editItem", item);
    // }
  },
  mounted() {
    let me = this;
    console.log(this.members);
  }
}
</script>
