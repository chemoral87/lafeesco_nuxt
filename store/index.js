export const getters = {
  authenticated(state) {
    return state.auth.loggedIn;
  },
  user(state) {
    return state.auth.user;
  },
  permissions(state) {
    if (state.auth.user) return state.auth.user.permissions;
    else return [];
  }
};
