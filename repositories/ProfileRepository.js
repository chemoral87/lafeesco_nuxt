import ParentRepository from "./ParentRepository";

export default ($axios) => (resource) => {
  // Get the common repository with all default methods
  const commonRepo = ParentRepository($axios)(resource);

  const favorite = (parent_id, id, payload) => {
    return $axios.$post(`${resource}/${parent_id}/${id}/favorite`, payload);
  };

  // Return a new object with all methods from commonRepo and the new register method
  return {
    ...commonRepo,
    favorite,
    // register,
    // sendResetCode,
    // resetPassword
  };
};
