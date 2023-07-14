import { Component, Input, OnInit } from '@angular/core';
import { UserPreferenceSupplyGroupViewModel } from '../../interfaces/userPreferenceSupplyGroupViewModel';
import { LocalStorageService } from '../../local-storage.service';
import { Resource } from '../../interfaces/resource.interface';
import { UserPreferenceSupplyGroupMember } from '../../interfaces/userPreferenceSupplyGroupMember';
import { ConstantsMaster } from '../../constants/constantsMaster';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  @Input() groupToEdit: UserPreferenceSupplyGroupViewModel = {} as UserPreferenceSupplyGroupViewModel;
  @Input() hideTitle = false;

  // Variables
  pageHeader;
  group: UserPreferenceSupplyGroupViewModel;
  errorMessage: string[] = [];

  constructor(
    private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    if (this.groupToEdit) {
      this.pageHeader = "Edit Group";
      this.group = this.groupToEdit;

    } else {
      this.pageHeader = "Create New Group";
      this.group = {} as UserPreferenceSupplyGroupViewModel;
      this.group.groupMembers = [];
    }
  }


  onSearchItemSelectHandler(selectedResource: Resource) {
    this.errorMessage = [];
    const groupMemberToAdd: UserPreferenceSupplyGroupMember = {
      employeeCode: selectedResource.employeeCode,
      employeeName: selectedResource.fullName,
      currentLevelGrade: selectedResource.levelGrade,
      positionName: selectedResource.position?.positionName,
      operatingOfficeAbbreviation: selectedResource.schedulingOffice?.officeAbbreviation
    }

    if (!(this.group.groupMembers.some(x => x.employeeCode == selectedResource.employeeCode))) {
      this.group.groupMembers.push(groupMemberToAdd);
    }
    else {
      this.errorMessage.push(`"${selectedResource.fullName}" is already present in "${this.group.name}" group`)
    }
  }

  // Remove member from list
  deleteMemberFromGroupHandler(groupMemberToRemove: UserPreferenceSupplyGroupMember) {
    this.group.groupMembers.splice(
      this.group.groupMembers.findIndex(X => X.employeeCode === groupMemberToRemove.employeeCode),
      1
    );
  }

  validateGroup() {
    this.errorMessage = [];

    if (this.group.groupMembers.length == 0) {
      this.errorMessage.push("Please add a member to this group")
      return false;
    }

    if (!this.group.name) {
      this.errorMessage.push("Please add a group Name")
      return false;
    }

    let savedGroups = JSON.parse(this.localStorageService.get(ConstantsMaster.localStorageKeys.userPreferenceSupplyGroups));
    savedGroups = savedGroups.filter(x => x.id != this.groupToEdit?.id)
    if (savedGroups.some(x => x.name.toLowerCase() === this.group.name.toLowerCase())) {
      this.errorMessage.push("Please choose a group name different than other group names.")
      return false;
    }

    return true;
  }
}
