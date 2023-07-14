import { UserPreferenceSupplyGroupMember } from "./userPreferenceSupplyGroupMember";

export interface UserPreferenceSupplyGroupSharedInfoViewModel {
  id?: string;
  sharedWith: string;
  isDefault: boolean;
  UserPreferenceSupplyGroupId: string;
  lastUpdatedBy?: string;
  sharedWithMemberDetails: UserPreferenceSupplyGroupMember;
}
