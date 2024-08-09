<template>
  <div>
    <div class="wrapper">
      <v-btn @click="confirmRemove()" color="error" class="mt-8" small absolute style="top: -50px" right fab>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-img style="min-height: 30px" v-bind="{ ...$props, ...$attrs }">
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-1"></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </div>
    <DialogDelete
      v-if="dialogDelete"
      :dialog="dialogDeleteProp"
      @ok="removeImage()"
      @close="dialogDelete = false"
    ></DialogDelete>
  </div>
</template>
<script>
export default {
  props: [],
  data() {
    return {
      dialogDelete: false,
      dialogDeleteProp: {}
    };
  },
  methods: {
    removeImage() {
      this.$emit("deleteImage");
      this.dialogDelete = false;
    },
    confirmRemove(imu) {
      this.dialogDeleteProp = {
        text: "Desea eliminar esta imagen ",
        strong: ""
      };
      this.dialogDelete = true;
    }
  },
  mounted() {
    let me = this;
  }
};
</script>
<style scoped>
.wrapper {
  position: relative;
}
</style>
