import Vue from "vue";
import { mapGetters } from "vuex";

const User = {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        ...mapGetters({
          user: "user",
          authenticated: "authenticated",
          verified: "verified",
          permissions: "permissions",
          snackbar: "snackbar"
        })
      }
    });
  }
};

Vue.use(User);
