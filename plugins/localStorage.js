import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "vuex",
    paths: ["newinvest"]
    // paths: ["persistedStates"]
    // paths: [...]
  })(store);
};
