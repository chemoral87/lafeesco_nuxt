import Vue from "vue";
import { mapGetters } from "vuex";

const validation = {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        ...mapGetters({
          errors: "validation/errors"
        })
      },
      methods: {
        clearErrors: function() {
          // metodo global para limpiar errorres
          this.$store.dispatch("validation/clearErrors");
        }
      }
    });
  }
};

Vue.use(validation);
