import CommonRepository from "../CommonRepository";
import ParentRepository from "../ParentRepository";

import InvestmentRepository from "../InvestmentRepository";
import InvestorRepository from "../InvestorRepository";
import InvestorProfileRepository from "../InvestorProfileRepository";
import CreditRepository from "../CreditRepository";
import MemberRepository from "../MemberRepository";
import MemberCallRepository from "../MemberCallRepository";

import AgroEventRepository from "../AgroEventRepository";
import TemplateGeneratorRepository from "../TemplateGeneratorRepository";
import MinistryLeaderRepository from "../MinistryLeaderRepository";
import UserRepository from "../UserRepository";
import ProfileRepository from "../ProfileRepository";
import ExerciseRepository from "../ExerciseRepository";
// import SkyRegistrationRepository from '../SkyRegistrationRepository'
const repositories = {
  Role: { repo: CommonRepository, path: "/roles" },
  Permission: { repo: CommonRepository, path: "/permissions" },
  User: { repo: UserRepository, path: "/users" },
  Profile: { repo: ProfileRepository, path: "/profiles" },
  Investor: { repo: InvestorRepository, path: "/investor" },
  InvestorProfile: {
    repo: InvestorProfileRepository,
    path: "/investor-profile",
  },
  Investment: { repo: InvestmentRepository, path: "/investment" },
  Intake: { repo: CommonRepository, path: "/intake" },
  Credit: { repo: CreditRepository, path: "/credit" },
  Consolidation: { repo: CommonRepository, path: "/consolidation" },
  Member: { repo: MemberRepository, path: "/members" },
  MemberAddess: { repo: CommonRepository, path: "/member-addresses" },
  MemberCall: { repo: MemberCallRepository, path: "/member-calls" },
  FaithHouse: { repo: CommonRepository, path: "/faith-house" },
  FaithHouseContact: { repo: ParentRepository, path: "/faith-house-contact" },
  FaithHouseMembership: {
    repo: CommonRepository,
    path: "/faith-house-membership",
  },
  Organization: { repo: CommonRepository, path: "/organizations" },
  OrganizationConfig: { repo: ParentRepository, path: "/organization-configs" },
  ParkingCar: { repo: CommonRepository, path: "/parking-car" },
  ParkingCarContact: { repo: ParentRepository, path: "/parking-car-contact" },
  Config: { repo: CommonRepository, path: "/configs" },
  AgroEvent: { repo: AgroEventRepository, path: "/agro-event" },
  Attendant: { repo: CommonRepository, path: "/attendant" },
  AttendantMinistry: { repo: CommonRepository, path: "/attendant-ministry" },
  Texting: { repo: CommonRepository, path: "/texting" },
  TemplateGenerator: {
    repo: TemplateGeneratorRepository,
    path: "/template-generator",
  },
  Ministry: { repo: CommonRepository, path: "/ministry" },
  MinistryLeader: { repo: MinistryLeaderRepository, path: "/ministry-leader" },
  Bible: { repo: CommonRepository, path: "/bible" },
  BibleBook: { repo: CommonRepository, path: "/bible-book" },

  ChurchService: { repo: CommonRepository, path: "/church-service" },
  ChurchServiceAttendant: {
    repo: CommonRepository,
    path: "/church-service-attendant",
  },
  SkyRegistration: { repo: CommonRepository, path: "/sky-registration" },
  SkyRoom: { repo: CommonRepository, path: "/sky-room" },
  Exercise: { repo: ExerciseRepository, path: "/exercises" },
};

export default ($axios) => {
  const result = {};
  for (const [key, { repo, path }] of Object.entries(repositories)) {
    if (repo) {
      result[key] = repo($axios)(path);
    } else {
      console.warn(`Repository for ${key} does not exist.`);
    }
  }
  return result;
};

/*
export default ($axios) => ({
  Role: CommonRepository($axios)("/roles"),
  Permission: CommonRepository($axios)("/permissions"),
  User: UserRepository($axios)("/users"),
  Profile: ProfileRepository($axios)("/profiles"),
  //////////////////////////////////////////// ////
  Investor: InvestorRepository($axios)("/investor"),
  InvestorProfile: InvestorProfileRepository($axios)("/investor-profile"),
  Investment: InvestmentRepository($axios)("/investment"),
  Intake: CommonRepository($axios)("/intake"),
  Credit: CreditRepository($axios)("/credit"),
  Consolidation: CommonRepository($axios)("/consolidation"),
  Member: MemberRepository($axios)("/members"),
  MemberAddess: CommonRepository($axios)("/member-addresses"),
  MemberCall: MemberCallRepository($axios)("/member-calls"),
  FaithHouse: CommonRepository($axios)("/faith-house"),
  FaithHouseContact: ParentRepository($axios)("/faith-house-contact"),
  FaithHouseMembership: CommonRepository($axios)("/faith-house-membership"),
  Organization: CommonRepository($axios)("/organizations"),
  OrganizationConfig: ParentRepository($axios)("/organization-configs"),
  ParkingCar: CommonRepository($axios)("/parking-car"),
  ParkingCarContact: ParentRepository($axios)("/parking-car-contact"),
  Config: CommonRepository($axios)("/configs"),
  AgroEvent: AgroEventRepository($axios)("/agro-event"),
  Attendant: CommonRepository($axios)("/attendant"),
  AttendantMinistry: CommonRepository($axios)("/attendant-ministry"),
  Texting: CommonRepository($axios)("/texting"),
  TemplateGenerator: TemplateGeneratorRepository($axios)("/template-generator"),
  Ministry: CommonRepository($axios)("/ministry"),
  MinistryLeader: MinistryLeaderRepository($axios)("/ministry-leader"),
  Bible: CommonRepository($axios)("/bible"),
  ChurchService: CommonRepository($axios)("/church-service"),
  ChurchServiceAttendant: CommonRepository($axios)("/church-service-attendant"),
  SkyRegistration: CommonRepository($axios)("/sky-registration"),
  SkyRoom: CommonRepository($axios)("/sky-room"),
  // ForgotPasswordRepository: ForgotPasswordRepository($axios)('/forgot-password')
});
*/
