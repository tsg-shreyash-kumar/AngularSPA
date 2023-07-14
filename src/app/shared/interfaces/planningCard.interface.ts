import { PlaceholderAllocation } from './placeholderAllocation.interface';
import { ResourceOrCasePlanningViewNote } from './resource-or-case-planning-view-note.interface';

export interface PlanningCard {
  id?: string;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  isShared?: boolean;
  sharedOfficeCodes?: string;
  sharedOfficeAbbreviations?: string;
  sharedStaffingTags?: string;
  createdBy?: string;
  mergedCaseCode?: string;
  isMerged?: boolean;
  pegOpportunityId?: string;
  lastUpdatedBy?: string;
  allocations?: PlaceholderAllocation[];
  placeholderallocations?: PlaceholderAllocation[];
  regularAllocations?: PlaceholderAllocation[];
  casePlanningViewNotes?: ResourceOrCasePlanningViewNote[];
  trackById?: number;
}
