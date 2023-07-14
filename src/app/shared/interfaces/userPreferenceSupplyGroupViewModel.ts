import { UserPreferenceSupplyGroupMember } from "./userPreferenceSupplyGroupMember";

export interface UserPreferenceSupplyGroupViewModel {
  id?: string;
  name: string;
  description: string;
  createdBy: string;
  isShared: boolean;
  isDefault: boolean;
  lastUpdatedBy?: string;
  groupMembers: UserPreferenceSupplyGroupMember[];
  sharingOption?: any;
  sharedMembers?: UserPreferenceSupplyGroupMember[];
  userPreferences?: any;
  filterRows?: any[];
  sortRows?: any[];
}
