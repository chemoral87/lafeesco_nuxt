export const state = () => ({
  call_types: [],
  marital_statuses: [],
  member_categories: []
});

export const getters = {
  getCallTypes(state) {
    return state.call_types;
  },
  getMaritalStatuses(state) {
    return state.marital_statuses;
  },
  getMemberCategories(state) {
    return state.member_categories;
  }
};

export const mutations = {
  SET_CALL_TYPES(state, call_types) {
    state.call_types = call_types;
  },
  SET_MARITAL_STATUSES(state, marital_statuses) {
    state.marital_statuses = marital_statuses;
  },
  SET_MEMBER_CATEGORIES(state, member_categories) {
    state.member_categories = member_categories;
  }
};

async function fetchManager(commit, getter, apiCall, mutator) {
  if (getter.length > 0) {
    return getter;
  } else {
    getter = await apiCall();
    commit(mutator, getter);
  }
  return getter;
}

export const actions = {
  async fetchCallTypes({ commit, getters }) {
    return fetchManager(
      commit,
      getters.getCallTypes,
      this.$repository.MemberCall.getCallTypes,
      "SET_CALL_TYPES"
    );
  },
  async fetchMaritalStatuses({ commit, getters }) {
    return fetchManager(
      commit,
      getters.getMaritalStatuses,
      this.$repository.Member.getMaritalStatuses,
      "SET_MARITAL_STATUSES"
    );
  },
  async fetchMemberCategories({ commit, getters }) {
    return fetchManager(
      commit,
      getters.getMemberCategories,
      this.$repository.Member.getMemberCategories,
      "SET_MEMBER_CATEGORIES"
    );
  }
};
