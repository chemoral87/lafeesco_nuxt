import CommonRepository from "./CommonRepository";

export default ($axios) => (resource) => {
  // Get the common repository with all default methods
  const commonRepo = CommonRepository($axios)(resource);

  // Define any exercise-specific methods if needed in the future
  // const getByMuscleGroup = (muscleGroup) => {
  //   return $axios.$get(`${resource}/muscle/${muscleGroup}`)
  // }

  // Return a new object with all methods from commonRepo
  return {
    ...commonRepo,
    // Add custom methods here if needed
    // getByMuscleGroup
  };
};
