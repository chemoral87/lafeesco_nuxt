import RoleRepository from "@/repositories/CommonRepository";

export default $axios => ({
  Role: RoleRepository($axios)("/roles")
});
