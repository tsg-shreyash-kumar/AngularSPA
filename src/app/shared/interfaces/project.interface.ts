import { CaseRoll } from './caseRoll.interface';
import { ResourceOrCasePlanningViewNote } from './resource-or-case-planning-view-note.interface';
import { ResourceAllocation } from './resourceAllocation.interface';
import { SKUCaseTerms } from './skuCaseTerms.interface';

export interface ProjectBasic {
  pipelineId: string;
  opportunityName: string;
  opportunityStatus: string;
  probabilityPercent: number;
  caseCode: number;
  clientCode: number;
  oldCaseCode: string;
  caseName: string;
  caseTypeCode: number;
  caseType: string;
  clientName: string;
  startDate: string;
  endDate: string;
}

export interface Project extends ProjectBasic {
  primaryIndustry: string;
  primaryCapability: string;
  industryPracticeArea: string;
  capabilityPracticeArea: string;
  managingOfficeAbbreviation: string;
  managingOfficeCode: string;
  managingOfficeName: string;
  billingOfficeAbbreviation: string;
  billingOfficeName: string;
  staffingOfficeAbbreviation: string;
  staffingOfficeCode: string;
  staffingOfficeName: string;
  duration: string;
  type: string;
  allocatedResources: ResourceAllocation[];
  allocations: ResourceAllocation[];
  placeholderAllocations: ResourceAllocation[];
  caseRoll: CaseRoll;
  skuCaseTerms: SKUCaseTerms;
  isProjectPinned: boolean;
  projectName: string;
  projectStatus: string;
  notes: string;
  estimatedTeamSize?: string;
  casePlanningViewNotes?: ResourceOrCasePlanningViewNote[];
  trackById?: number;
}
