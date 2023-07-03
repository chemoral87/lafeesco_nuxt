import CommonRepository from '../CommonRepository'
import InvestmentRepository from '../InvestmentRepository'
import InvestorRepository from '../InvestorRepository'
import InvestorProfileRepository from '../InvestorProfileRepository'
import CreditRepository from '../CreditRepository'
import MemberRepository from '../MemberRepository'
import MemberCallRepository from '../MemberCallRepository'
import HouseFaithReposiotry from '../CommonRepository'
import AgroEventRepository from '../AgroEventRepository'
import TemplateGeneratorRepository from '../TemplateGeneratorRepository'
import MinistryLeaderRepository from '../MinistryLeaderRepository'
import UserRepository from '../UserRepository'

export default ($axios) => ({
  Role: CommonRepository($axios)('/roles'),
  Permission: CommonRepository($axios)('/permissions'),
  User: UserRepository($axios)('/users'),
  Investor: InvestorRepository($axios)('/investor'),
  InvestorProfile: InvestorProfileRepository($axios)('/investor-profile'),
  Investment: InvestmentRepository($axios)('/investment'),
  Credit: CreditRepository($axios)('/credit'),
  Consolidation: CommonRepository($axios)('/consolidation'),
  Member: MemberRepository($axios)('/members'),
  MemberAddess: CommonRepository($axios)('/member-addresses'),
  MemberCall: MemberCallRepository($axios)('/member-calls'),
  FaithHouse: HouseFaithReposiotry($axios)('/faith-house'),
  AgroEvent: AgroEventRepository($axios)('/agro-event'),
  Attendant: CommonRepository($axios)('/attendant'),
  AttendantMinistry: CommonRepository($axios)('/attendant-ministry'),
  TemplateGenerator: TemplateGeneratorRepository($axios)('/template-generator'),
  Ministry: CommonRepository($axios)('/ministry'),
  MinistryLeader: MinistryLeaderRepository($axios)('/ministry-leader'),
  Bible: CommonRepository($axios)('/bible'),
  ChurchService: CommonRepository($axios)('/church-service'),
  ChurchServiceAttendant: CommonRepository($axios)('/church-service-attendant')
})
