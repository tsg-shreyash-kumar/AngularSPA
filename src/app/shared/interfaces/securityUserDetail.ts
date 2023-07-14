export interface SecurityUserDetail {
  employeeCode: string;
  roleCode: number;
  lastUpdatedBy: string;
  lastUpdated: string;
  serviceLine: string;
  jobTitle: string;
  isAdmin: boolean;
  fullName: string;
  isTerminated?: boolean;
  override: boolean;
  notes: string;
  endDate?: string;
  userTypeCode?: string;
  geoType?: string;
  officeCodes?: string;
  serviceLineCodes?: string;
  positionGroupCodes?: string;
  levelGrades?: string;
  practiceAreaCodes?: string;
  ringfenceCodes?: string;
}
