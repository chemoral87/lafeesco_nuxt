import CommonRepository from "./CommonRepository";
import InvestmentRepository from "./InvestmentRepository";
import InvestorRepository from "./InvestorRepository";
import InvestorProfileRepository from "./InvestorProfileRepository";
import CreditRepository from "./CreditRepository";
import MemberRepository from "./MemberRepository";
import MemberCallRepository from "./MemberCallRepository";

export default $axios => ({
  Role: CommonRepository($axios)("/roles"),
  Permission: CommonRepository($axios)("/permissions"),
  User: CommonRepository($axios)("/users"),
  Investor: InvestorRepository($axios)("/investor"),
  InvestorProfile: InvestorProfileRepository($axios)("/investor-profile"),
  Investment: InvestmentRepository($axios)("/investment"),
  Credit: CreditRepository($axios)("/credit"),
  Consolidation: CommonRepository($axios)("/consolidation"),
  Member: MemberRepository($axios)("/members"),
  MemberAddess: CommonRepository($axios)("/member-addresses"),
  MemberCall: MemberCallRepository($axios)("/member-calls")
});
