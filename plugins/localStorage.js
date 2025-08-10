import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "mazapan",
    paths: ["newinvest", "pitcher_store"],
  })(store);
};
