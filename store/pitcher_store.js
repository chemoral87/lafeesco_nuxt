export const state = () => ({
  sensitivity: 0.003,
  selectedRootNote: "C",
  latinNotation: false,
});

export const getters = {
  selectedRootNote(state) {
    return state.selectedRootNote;
  },
  sensitivity(state) {
    return state.sensitivity;
  },
  latinNotation(state) {
    return state.latinNotation;
  },
  // pitcher(state) {
  //   return {
  //     selectedRootNote: state.selectedRootNote,
  //   };
  // },
};

export const mutations = {
  SET_ROOT_NOTE(state, note) {
    state.selectedRootNote = note;
  },
  SET_SENSITIVITY(state, sensitivity) {
    state.sensitivity = sensitivity;
  },
  SET_LATIN_NOTATION(state, latinNotation) {
    state.latinNotation = latinNotation;
  },
};

export const actions = {
  updateRootNote({ commit }, note) {
    commit("SET_ROOT_NOTE", note);
  },
};
