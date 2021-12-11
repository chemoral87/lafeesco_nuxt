// https://github.com/nuxt/nuxt.js/tree/ef4cdd477644cfb4571e1d7eb3b9ef1d16a3ed54/examples/vuex-persistedstate
import createPersistedState from "vuex-persistedstate";

export const plugins = [
  createPersistedState({ key: "turron", paths: ["local"] })
  // createPersistedState({
  //   key: "turron",
  //   paths: ["local"]
  //   // paths: [...]
  // })
];

export const state = () => ({
  capital: 0,
  name: "",
  last_name: "",
  second_last_name: "",
  birthday: "",
  cellphone: "",
  email: "",
  password: "",
  password_confirm: ""
});

export const getters = {
  capital(state) {
    return state.capital;
  },
  investor(state) {
    return {
      name: state.name,
      last_name: state.last_name,
      second_last_name: state.second_last_name,
      birthday: state.birthday,
      cellphone: state.cellphone,
      email: state.email,
      password: state.password,
      password_confirm: state.password_confirm
    };
  }
};

export const mutations = {
  // increment: state => state.counter++,
  // decrement: state => state.counter--,
  SET_CAPITAL(state, capital) {
    state.capital = capital;
  },
  SET_PROFILE(state, profile) {
    state.name = profile.name;
    state.last_name = profile.last_name;
    state.second_last_name = profile.second_last_name;
    state.birthday = profile.birthday;
    state.email = profile.email;
    state.cellphone = profile.cellphone;
    state.password = profile.password;
  }
};
