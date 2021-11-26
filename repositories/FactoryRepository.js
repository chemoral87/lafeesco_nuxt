import CommonRepository from "@/repositories/CommonRepository";

export default $axios => ({
  Role: CommonRepository($axios)("/roles"),
  Permission: CommonRepository($axios)("/permissions"),
  User: CommonRepository($axios)("/users")
});
