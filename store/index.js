export const state = () => ({
  snackbar: {
    text: "",
    color: "",
    display: false
  },
  show_loading: {
    display: false
  },
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
    return state.show_loading;
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
    if (state.show_loading.display == false) {
      state.show_loading.display = true;
    }
  },
  HIDE_LOADING(state) {
    if (state.show_loading.display == true) {
      state.show_loading.display = false;
    }
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
  }
};
