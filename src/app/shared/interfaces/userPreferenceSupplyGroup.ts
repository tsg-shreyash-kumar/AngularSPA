export interface UserPreferenceSupplyGroup {
  id?: string;
  name: string;
  description: string;
  createdBy: string;
  isDefault: boolean;
  isShared: boolean;
  groupMemberCodes: string;
  lastUpdatedBy?: string;
}
