<template>
  <v-dialog :value="true" persistent width="400px">
    <v-card>
      <v-card-title>
        <v-icon class="mr-2">mdi-alert</v-icon>
        <span class="text-h5">{{ item.title }}</span>
        <v-spacer></v-spacer>
        <v-icon @click.native="close">$delete</v-icon>
      </v-card-title>

      <v-card-text>
        <div class="text-body-1 text--primary">
          {{item.text}}
          <strong>{{item.strong}}</strong> ?
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" class="mr-1" outlined @click.native="close"> NO </v-btn>
        <v-btn color="primary" @click.native="ok">
          SI
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["value", "dialog"],
  data() {
    return {
      item: {
        titel: "",
        text: "",
        strong: ""
      }
    };
  },
  computed: {
    formTitle() {
      return "Confirmación";
      // return `Esta seguro de elminar el Rol ${this.item.name} ?`;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    ok() {
      if (this.item.payload)
        this.$emit("ok", this.item.payload);
    }
  },
  mounted() {
    this.item.title = this.dialog.title ? this.dialog.title : "Confirmación";
    this.item.text = this.dialog.text ? this.dialog.text : "Confirmación";
    this.item.strong = this.dialog.strong ? this.dialog.strong : "Confirmación";
    this.item.payload = this.dialog.payload ? this.dialog.payload : null;
  }
}
</script>

<style>
</style>