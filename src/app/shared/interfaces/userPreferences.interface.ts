export interface UserPreferences {
  employeeCode: string;
  supplyViewOfficeCodes: string;
  levelGrades: string;
  availabilityIncludes: string;
  supplyViewStaffingTags: string;
  groupBy: string;
  sortBy: string;
  supplyWeeksThreshold: number;
  vacationThreshold: number;
  trainingThreshold: number;
  demandViewOfficeCodes: string;
  caseTypeCodes: string;
  caseAttributeNames: string;
  opportunityStatusTypeCodes: string;
  minOpportunityProbability: number;
  demandTypes: string;
  demandWeeksThreshold: number;
  caseExceptionShowList: string;
  caseExceptionHideList: string;
  opportunityExceptionShowList: string;
  opportunityExceptionHideList: string;
  lastUpdatedBy: string;
  caseAllocationsSortBy: string;
  bossUserType: string;
  userGeotype: string;
  practiceAreaCodes: string;
  positionCodes: string;
  planningCardsSortOrder: string;
  caseOppSortOrder: string;
  affiliationRoleCodes:string;
  industryPracticeAreaCodes:string;
  capabilityPracticeAreaCodes:string;
  isDefault: boolean;
}
