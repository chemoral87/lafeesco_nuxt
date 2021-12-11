import CommonRepository from "@/repositories/CommonRepository";
import InvestmentRepository from "@/repositories/InvestmentRepository";
import InvestorRepository from "@/repositories/InvestorRepository";

export default $axios => ({
  Role: CommonRepository($axios)("/roles"),
  Permission: CommonRepository($axios)("/permissions"),
  User: CommonRepository($axios)("/users"),
  Investor: InvestorRepository($axios)("/investor"),
  Investment: InvestmentRepository($axios)("/investment")
});
