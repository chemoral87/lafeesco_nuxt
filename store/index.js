export const state = () => ({
  snackbar: {
    text: "",
    color: "",
    display: false
  }
  // persistedStates: null
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
  }
};
