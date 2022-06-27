export const state = () => ({
  snackbar: {
    text: "",
    color: "",
    display: false
  },
  block_loading: false,
  hide_next_loading: false,
  locale: "es"
});

export const getters = {
  // persistedStates(state) {
  //   return state.persistedStates;
  // },
  authenticated(state) {
    return state.auth.loggedIn;
  },
  user(state) {
    return state.auth.user;
  },
  permissions(state) {
    if (state.auth.user == null) return [];
    if (state.auth.user) return state.auth.user.permissions;
    else return [];
  },
  snackbar(state) {
    return state.snackbar;
  },
  showLoading(state) {
    return state.block_loading;
  },
  hideNextLoading(state) {
    return state.hide_next_loading;
  }
};

export const mutations = {
  SET_SNACKBAR(state, snackbar) {
    state.snackbar = snackbar;
  },
  CLOSE_SNACKBAR(state) {
    if (state.snackbar.display == true) {
      state.snackbar.display = false;
    }
  },
  SHOW_LOADING(state) {
    if (state.block_loading == false) {
      state.block_loading = true;
    }
  },
  HIDE_LOADING(state) {
    if (state.block_loading == true) {
      state.block_loading = false;
    }
  },
  HIDE_NEXT_LOADING(state) {
    state.hide_next_loading = true;
  },
  SHOW_NEXT_LOADING(state) {
    state.hide_next_loading = false;
  }
  // SET_STATE(state, payload) {
  //   state.persistedState = payload;
  // }
};

export const actions = {
  async notify({ commit, state }, data) {
    let notify;
    if (data.success) {
      notify = { text: data.success, color: "primary", display: true };
    }
    if (notify == null) return;
    // close if snackbar is open
    if (state.snackbar.display == true) {
      await commit("CLOSE_SNACKBAR");
    }
    commit("SET_SNACKBAR", notify);
  },
  closeNotify({ commit }) {
    commit("CLOSE_SNACKBAR");
  },
  showLoading({ commit }) {
    commit("SHOW_LOADING");
  },
  hideLoading({ commit }) {
    commit("HIDE_LOADING");
  },
  hideNextLoading({ commit }) {
    commit("HIDE_NEXT_LOADING");
  },
  showNextLoading({ commit }) {
    commit("SHOW_NEXT_LOADING");
  }
};
