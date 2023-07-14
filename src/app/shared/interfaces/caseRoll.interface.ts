export interface CaseRoll {
  id?: string;
  rolledFromOldCaseCode: string;
  rolledToOldCaseCode: string;
  currentCaseEndDate: string;
  expectedCaseEndDate: string;
  isUpdateEndDateFromCCM?: boolean; //TODO: delete after prod releas 04-Aug-2020
  isProcessedFromCCM: boolean;
  rolledScheduleIds: string;
  lastUpdatedBy: string;
}
