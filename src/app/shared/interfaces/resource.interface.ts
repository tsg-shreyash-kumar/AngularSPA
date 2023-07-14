import { Employee } from './employee.interface';
import { ResourceLastBillableDate } from './resource-last-billable-date.interface';
import { ResourceOrCasePlanningViewNote } from './resource-or-case-planning-view-note.interface';

export interface Resource extends Employee {
  dateFirstAvailable: string;
  percentAvailable: number;
  upcomingCommitmentsForAlerts: string[];
  availabilityStatus: string;
  onTransitionOrTerminationAndNotAvailable: boolean;
  employeeSearchData: string;
  isSelected: boolean;
  staffableAsTypeName: string;
  resourceViewNotes?: ResourceOrCasePlanningViewNote[];
  source?: string
  uri?: string
  uriHash?: string
  sysCollection?: string
  searchUid?: string
  requestDuration?: number
  lastBillable?: ResourceLastBillableDate;
}
