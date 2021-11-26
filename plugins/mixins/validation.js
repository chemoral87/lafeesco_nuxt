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
        },
        validatePermission: function(permission) {
          if (this.$store.getters.permissions.includes(permission)) {
            return true;
          } else {
            throw error({ statusCode: 403 });
          }
        }
      }
    });
  }
};

Vue.use(validation);
