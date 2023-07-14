import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Resource } from 'src/app/shared/interfaces/resource.interface';
import { UserPreferenceSupplyGroupMember } from 'src/app/shared/interfaces/userPreferenceSupplyGroupMember';
import { UserPreferenceSupplyGroupViewModel } from 'src/app/shared/interfaces/userPreferenceSupplyGroupViewModel';
import { FilterByComponent } from '../filter-by/filter-by.component';
import { SortByComponent } from '../sort-by/sort-by.component';
import { ResourceFiltersBasicMenu } from 'src/app/shared/interfaces/resource-filters-basic-menu.interface';
import { CreateGroupComponent } from 'src/app/shared/staffing-settings/create-group/create-group.component';
import { UserPreferenceSupplyGroup } from 'src/app/shared/interfaces/userPreferenceSupplyGroup';
import { CoreService } from 'src/app/core/core.service';
import { GroupSettingsComponent } from 'src/app/shared/staffing-settings/group-settings/group-settings.component';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { Subscription } from 'rxjs';
import { UserPreferencesMessageService } from 'src/app/core/user-preferences-message.service';

@Component({
  selector: 'app-custom-group-modal',
  templateUrl: './custom-group-modal.component.html',
  styleUrls: ['./custom-group-modal.component.scss']
})
export class CustomGroupModalComponent implements OnInit, OnDestroy {

  // ViewChilds
  @ViewChild("customGroupFilterBy", { static: false }) filterByComponent!: FilterByComponent;
  @ViewChild("customGroupSortBy", { static: false }) sortByComponent!: SortByComponent;
  @ViewChild('createGroup', { static: false }) createGroupComponent: CreateGroupComponent;
  @ViewChild('groupSettings', { static: false }) groupSettingsComponent: GroupSettingsComponent;

  // Outputs
  @Output() upsertUserPreferenceSupplyGroups = new EventEmitter<any>();


  // Variables
  modalTitle: string;
  isFormValid: boolean = true;
  errorMessage: string[] = [];
  groupToEdit: any;
  isEditMode: boolean = false;
  showSpecificUserSearch: boolean = false;
  allGroupsArray: UserPreferenceSupplyGroupViewModel[] = [];

  customGroup: UserPreferenceSupplyGroupViewModel;
  sharingMenuOptions: ResourceFiltersBasicMenu[] = [
    { label: "Everyone", value: 1, selected: false },
    { label: "Specific User", value: 2, selected: false },
    { label: "Private", value: 3, selected: false }
  ];
  subscription: Subscription = new Subscription();

  constructor(
    private coreService: CoreService,
    private localStorageService: LocalStorageService,
    private userPreferencesMessageService: UserPreferencesMessageService,
    public modalRef: BsModalRef) { }

  ngOnInit(): void {
    this.loadAllCustomSupplyGroupsFromLocalStorage();
    // Set members
    this.customGroup = {} as UserPreferenceSupplyGroupViewModel;

    if (this.isEditMode == true) {
      this.customGroup = this.groupToEdit;
      this.modalTitle = `Edit "${this.customGroup.name}"`;
    } else {
      this.modalTitle = "Create New Custom Group";
      this.customGroup.groupMembers = [];
      this.customGroup.sharedMembers = [];
    }
    this.subscribeEvents();
  }

  loadAllCustomSupplyGroupsFromLocalStorage() {
    this.allGroupsArray = JSON.parse(this.localStorageService.get(ConstantsMaster.localStorageKeys.userPreferenceSupplyGroups, 'weekly'));
  }

  // Add users to members or sharing list
  onSearchItemSelectHandler(selectedUser: Resource, section: string) {
    this.errorMessage = [];

    const groupMemberToAdd: UserPreferenceSupplyGroupMember = {
      employeeCode: selectedUser.employeeCode,
      employeeName: selectedUser.fullName,
      currentLevelGrade: selectedUser.levelGrade,
      positionName: selectedUser.position?.positionName,
      operatingOfficeAbbreviation: selectedUser.schedulingOffice?.officeAbbreviation
    }

    if (section == "members") {
      if (!(this.customGroup.groupMembers.some(x => x.employeeCode == selectedUser.employeeCode))) {
        this.customGroup.groupMembers.push(groupMemberToAdd);
      }
      else {
        this.errorMessage.push(`"${selectedUser.fullName}" is already present in "${this.customGroup.name}" group.`);
      }
    } else {
      if (!(this.customGroup.sharedMembers.some(x => x.employeeCode == selectedUser.employeeCode))) {
        this.customGroup.sharedMembers.push(groupMemberToAdd);
      }
      else {
        this.errorMessage.push(`"${selectedUser.fullName}" is already present in the shared list.`);
      }
    }
  }

  // Remove user from list
  deleteMemberFromGroupHandler(userToRemove: UserPreferenceSupplyGroupMember, section: string) {
    if (section == "members") {
      this.customGroup.groupMembers.splice(
        this.customGroup.groupMembers.findIndex(X => X.employeeCode === userToRemove.employeeCode),
        1
      );
    } else {
      this.customGroup.sharedMembers.splice(
        this.customGroup.sharedMembers.findIndex(X => X.employeeCode === userToRemove.employeeCode),
        1
      );
    }
  }

  // Select sharing option
  onSharingSelectionHandler(selectedSharingOption: ResourceFiltersBasicMenu) {
    if (selectedSharingOption.value == 2) {
      this.showSpecificUserSearch = true;
    } else {
      this.showSpecificUserSearch = false;
      this.customGroup.sharedMembers = [];
    }

    this.sharingMenuOptions.forEach((option) => {
      if (option.value == selectedSharingOption.value) {
        option.selected = true;
        this.customGroup.sharingOption = option.value;
      } else {
        option.selected = false;
      }
    });
  }

  // Save group
  saveGroup() {
    this.customGroup.filterRows = this.filterByComponent.filterRows;
    this.customGroup.sortRows = this.sortByComponent.sortRows;

    // if (this.isEditMode == true) {
    //   this.saveCustomGroupEmitter.emit(this.customGroup);
    // } else {
    //   this.newCustomGroupEmitter.emit(this.customGroup);
    // }
    this.upsertUserPreferenceSupplyGroups.emit(this.customGroup);

    this.modalRef.hide();
  }

  checkValidation() {
    this.errorMessage = [];

    let existingGroups: any[] = JSON.parse(window.sessionStorage.getItem("mockViewingGroups")) || [];
    existingGroups = existingGroups.filter((x) => String(x.group.name).toLowerCase() == String(this.customGroup.name).toLowerCase()) || [];
    let isUnique = existingGroups.length && !this.isEditMode ? false : true;

    // Check if form is valid
    if (!this.customGroup.name) {
      this.isFormValid = false;
      this.errorMessage.push("Please add a group name.");
    }

    if (this.customGroup.name && isUnique == false) {
      this.isFormValid = false;
      this.errorMessage.push("This group name is already in use, please choose a different name.");
    }

    if (this.customGroup.groupMembers.length == 0) {
      this.isFormValid = false;
      this.errorMessage.push("Please add a group member.");
    }

    if (this.customGroup.sharingOption == 2 && this.customGroup.sharedMembers.length == 0) {
      this.isFormValid = false;
      this.errorMessage.push("Please add a specific user, or select a different sharing option");
    }

    if (this.errorMessage.length == 0) {
      this.isFormValid = true;
      this.saveGroup();
    }
  }

  upsertPreferenceSupplyGroups() {
    if (!this.createGroupComponent.validateGroup()) {
      return;
    }

    if (this.createGroupComponent && this.createGroupComponent.group.isDefault) {
      if (this.groupSettingsComponent)
        this.groupSettingsComponent.defaultGroupArray.splice(0, 1, this.createGroupComponent.group);

      this.allGroupsArray.map(x => {
        if (x.id === this.createGroupComponent.group.id) {
          x.isDefault = this.createGroupComponent.group.isDefault;
        } else {
          x.isDefault = false;
        }
      });
    }

    if (this.groupSettingsComponent && this.groupSettingsComponent.defaultGroupArray
      && this.groupSettingsComponent.defaultGroupArray[0].id === this.createGroupComponent.group.id
      && this.createGroupComponent.group.isDefault) {

      this.groupSettingsComponent.defaultGroupArray.splice(0, 1);
    }

    if (this.createGroupComponent.group.id) {
      const indexOfGroup = this.allGroupsArray.findIndex(x => x.id === this.createGroupComponent.group.id);
      this.allGroupsArray.splice(
        indexOfGroup,
        1,
        this.createGroupComponent.group
      );
    } else {
      this.allGroupsArray.push(this.createGroupComponent.group);
    }

    const supplyGroupsDataToUpsert: UserPreferenceSupplyGroup = {
      id: this.createGroupComponent.group.id,
      name: this.createGroupComponent.group.name,
      description: this.createGroupComponent.group.description,
      isDefault: this.createGroupComponent.group.isDefault ?? false,
      isShared: this.createGroupComponent.group.isShared ?? false,
      createdBy: this.createGroupComponent.group.id ? this.createGroupComponent.group.createdBy : this.coreService.loggedInUser.employeeCode,
      groupMemberCodes: this.createGroupComponent.group.groupMembers.map(x => x.employeeCode).join(",")
    }

    this.upsertUserPreferenceSupplyGroups.emit({ supplyGroupsDataToUpsert: [].concat(supplyGroupsDataToUpsert), allGroupsArray: this.allGroupsArray });

    this.modalRef.hide();
  }

  subscribeEvents() {
    this.subscription.add(this.userPreferencesMessageService.refreshUserPreferencesSupplyGroups().subscribe(result => {
      if (result?.length) {

        if (this.allGroupsArray.some(x => !x.id)) {
          const updatedData = this.allGroupsArray.find(x => !x.id);
          updatedData.id = result[0].id;
          updatedData.createdBy = result[0].createdBy;
        }

      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
