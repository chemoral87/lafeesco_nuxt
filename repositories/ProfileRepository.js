import ParentRepository from "./ParentRepository";

export default $axios => resource => {
  // Get the common repository with all default methods
  const commonRepo = ParentRepository($axios)(resource);

  // Define your new method
  //   const register = (payload) => {
  //     return $axios.$post(`${resource}/register`, payload)
  //   }
  //   const sendResetCode = (payload) => {
  //     return $axios.$post(`${resource}/send-code`, payload)
  //   }
  //   const resetPassword = (payload) => {
  //     return $axios.$post(`${resource}/reset-password`, payload)
  //   }

  const favorite = (parent_id, id, payload) => {
    return $axios.$post(`${resource}/${parent_id}/${id}/favorite`, payload);
  };

  // Return a new object with all methods from commonRepo and the new register method
  return {
    ...commonRepo,
    favorite
    // register,
    // sendResetCode,
    // resetPassword
  };
};
