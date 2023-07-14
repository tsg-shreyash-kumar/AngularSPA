import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SortByComponent } from '../sort-by/sort-by.component';
import { FilterByComponent } from '../filter-by/filter-by.component';
import { UserPreferences } from 'src/app/shared/interfaces/userPreferences.interface';
import { UserPreferenceSupplyGroupViewModel } from 'src/app/shared/interfaces/userPreferenceSupplyGroupViewModel';
import { ResourceFiltersBasicMenu } from 'src/app/shared/interfaces/resource-filters-basic-menu.interface';
import { ResourceFilter } from 'src/app/shared/interfaces/resource-filter.interface';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CoreService } from 'src/app/core/core.service';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { Resource } from 'src/app/shared/interfaces/resource.interface';
import { UserPreferenceSupplyGroupMember } from 'src/app/shared/interfaces/userPreferenceSupplyGroupMember';
import { SavedResourceFiltersComponent } from '../saved-resource-filters/saved-resource-filters.component';
import { SupplySettingsComponent } from 'src/app/shared/staffing-settings/supply-settings/supply-settings.component';

@Component({
  selector: 'app-saved-group-modal',
  templateUrl: './saved-group-modal.component.html',
  styleUrls: ['./saved-group-modal.component.scss']
})
export class SavedGroupModalComponent implements OnInit {

  @Output() newSavedGroupEmitter = new EventEmitter();
  @Output() saveSavedGroupEmitter = new EventEmitter();
  @Output() upsertResourceFilter = new EventEmitter();

  // ViewChild(s)
  @ViewChild("savedGroupSortBy", { static: false }) sortByComponent!: SortByComponent;
  @ViewChild("savedGroupFilterBy", { static: false }) filterByComponent!: FilterByComponent;
  @ViewChild("savedGroupSupplySetting", { static: false }) supplySettingsComponent: SupplySettingsComponent;
  @ViewChild("savedGroupFilterSettings", { static: false }) savedResourceFiltersComponent!: SavedResourceFiltersComponent;

  // Validation
  isPageOneValid: boolean = true;
  isPageTwoValid: boolean = true;
  isFormValid: boolean = true;

  // Variables
  modalTitle: string;
  errorMessage: string[] = [];
  groupToEdit: any;
  isEditMode: boolean = false;

  userPreferences: UserPreferences;
  loggedInUserHomeOffice;

  onSecondPage: boolean = false;
  showSpecificUserSearch: boolean = false;

  savedGroup: UserPreferenceSupplyGroupViewModel;
  sharingMenuOptions: ResourceFiltersBasicMenu[] = [
    { label: "Everyone", value: 1, selected: false },
    { label: "Specific User", value: 2, selected: false },
    { label: "Private", value: 3, selected: false }
  ];

  // Temporary resource filters
  resourceFilterGroup: ResourceFilter;
  filteredItems: ResourceFilter[];

  constructor(public modalRef: BsModalRef, private coreService: CoreService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    // Set sharing
    this.savedGroup = {} as UserPreferenceSupplyGroupViewModel;
    this.resourceFilterGroup = {} as ResourceFilter;
    this.savedGroup.sharedMembers = []; // ..moded this here to avoid errors when appearing when selecting a resource while editing

    if (this.isEditMode == true) {
      // this.savedGroup = this.groupToEdit;
      // this.modalTitle = `Edit "${this.savedGroup.name}"`;

      this.resourceFilterGroup = this.groupToEdit;
      this.modalTitle = `Edit "${this.resourceFilterGroup.title}"`;
    } else {
      this.modalTitle = "Create New Saved Group";
      // this.savedGroup.sharedMembers = [];
    }

    // this.loadUserPreferences();
    this.loggedInUserHomeOffice = this.coreService.loggedInUser.office;
  }

  loadUserPreferences() {
    if (this.isEditMode == true) {
      this.userPreferences = this.savedGroup.userPreferences;
    } else {
      this.userPreferences = JSON.parse(this.localStorageService.get(ConstantsMaster.localStorageKeys.userPreferences, 'monthly'));
    }
  }

  // Go to next page
  nextPage() {
    this.errorMessage = [];

    if (!this.resourceFilterGroup.title) {
      this.isPageOneValid = false;
      this.errorMessage.push("Please add a group name.");
    }

    // Check first page form
    // let existingGroups: any[] = JSON.parse(window.sessionStorage.getItem("mockViewingGroups")) || [];
    // existingGroups = existingGroups.filter((x) => String(x.group.name).toLowerCase() == String(this.savedGroup.name).toLowerCase()) || [];
    // let isUnique = existingGroups.length ? false : true;

    // if (!this.savedGroup.name) {
    //   this.isPageOneValid = false;
    //   this.errorMessage.push("Please add a group name.");
    // }

    // if (this.savedGroup.sharingOption == 2 && this.savedGroup.sharedMembers.length == 0) {
    //   this.isPageOneValid = false;
    //   this.errorMessage.push("Please add a shared member, or select a different sharing option");
    // }

    // if (!this.isEditMode && this.savedGroup.name && isUnique == false) {
    //   this.isPageOneValid = false;
    //   this.errorMessage.push("This group name is already in use, please choose a different name.");
    // }

    if (this.errorMessage.length == 0) {
      this.isPageOneValid = true;
      this.onSecondPage = true;
    }
  }

  // Add users to members or sharing list
  onSearchItemSelectHandler(selectedUser: Resource) {
    this.errorMessage = [];

    const groupMemberToAdd: UserPreferenceSupplyGroupMember = {
      employeeCode: selectedUser.employeeCode,
      employeeName: selectedUser.fullName,
      currentLevelGrade: selectedUser.levelGrade,
      positionName: selectedUser.position?.positionName,
      operatingOfficeAbbreviation: selectedUser.schedulingOffice?.officeAbbreviation
    }

    if (!(this.savedGroup.sharedMembers.some(x => x.employeeCode == selectedUser.employeeCode))) {
      this.savedGroup.sharedMembers.push(groupMemberToAdd);
    }
    else {
      this.errorMessage.push(`"${selectedUser.fullName}" is already present in the shared list.`);
    }
  }

  // Remove user from list
  deleteMemberFromGroupHandler(userToRemove: UserPreferenceSupplyGroupMember) {
    this.savedGroup.sharedMembers.splice(
      this.savedGroup.sharedMembers.findIndex(X => X.employeeCode === userToRemove.employeeCode),
      1
    );
  }

  // Select sharing option
  onSharingSelectionHandler(selectedSharingOption: ResourceFiltersBasicMenu) {
    this.sharingMenuOptions.forEach((option) => {
      if (option.value == selectedSharingOption.value) {
        option.selected = true;
        this.savedGroup.sharingOption = option.value;
      } else {
        option.selected = false;
      }
    });

    if (selectedSharingOption.value == 2) {
      this.showSpecificUserSearch = true;
    } else {
      this.showSpecificUserSearch = false;
    }
  }

  saveGroup() {
    const savedGroupSupplySettings = {
      supplyViewOfficeCodes: this.supplySettingsComponent.selectedSupplyViewOfficeList.toString(),
      supplyViewStaffingTags: this.supplySettingsComponent.selectedStaffingTagList.toString(),
      positionCodes: this.supplySettingsComponent.selectedPositionList.toString(),
      affiliationRoleCodes: this.supplySettingsComponent.selectedAffiliationRoleCodes.toString(),
      levelGrades: this.supplySettingsComponent.selectedLevelGradeList.toString(),
      availabilityIncludes: this.supplySettingsComponent.selectedAvailabilityIncludesList.toString(),
      supplyWeeksThreshold: this.supplySettingsComponent.userPreferences.supplyWeeksThreshold, // dateInterval
      vacationThreshold: this.supplySettingsComponent.userPreferences.vacationThreshold,
      trainingThreshold: this.supplySettingsComponent.userPreferences.trainingThreshold
    };

    this.savedGroup.filterRows = this.filterByComponent.filterRows;
    this.savedGroup.sortRows = this.sortByComponent.sortRows;
    this.savedGroup.userPreferences = savedGroupSupplySettings;

    if (this.isEditMode == true) {
      this.saveSavedGroupEmitter.emit(this.savedGroup);
    } else {
      this.newSavedGroupEmitter.emit(this.savedGroup);
    }

    this.modalRef.hide();
  }

  checkValidation() {
    this.errorMessage = [];

    // Check if form is valid
    if (this.errorMessage.length == 0) {
      this.isFormValid = true;
      this.saveGroup();
    }
  }

  // Temporary solution for resourceFilters
  upsertFiltersForLoggedInEmployee(saveNew = true) {
    if (this.resourceFilterGroup.title !== "") {
      const resourceFiltersData: ResourceFilter[] = [];

      const resourceFilter: ResourceFilter = {
        id: saveNew ? null : this.resourceFilterGroup?.id,
        title: this.resourceFilterGroup.title || '',
        employeeCode: null,
        isDefault: this.resourceFilterGroup.isDefault == true ? true : false,
        officeCodes: this.savedResourceFiltersComponent.selectedOfficeList.toString(),
        staffingTags: this.savedResourceFiltersComponent.selectedStaffingTagList.toString(),
        levelGrades: this.savedResourceFiltersComponent.selectedLevelGradeList.toString(),
        employeeStatuses: this.savedResourceFiltersComponent.selectedEmployeeStatusList.toString(),
        commitmentTypeCodes: this.savedResourceFiltersComponent.selectedCommitmentTypeList.toString(),
        certificates: this.savedResourceFiltersComponent.selectedCertificatesList.toString(),
        languages: this.savedResourceFiltersComponent.selectedLanguagesList.toString(),
        practiceAreaCodes: this.savedResourceFiltersComponent.selectedPracticeAreaList.toString(),
        sortBy: this.savedResourceFiltersComponent.selectedSortByList.toString(),
        lastUpdatedBy: null,
        staffableAsTypeCodes: this.savedResourceFiltersComponent.selectedStaffableAsList.toString(),
        positionCodes: this.savedResourceFiltersComponent.selectedPositionList.toString(),
        affiliationRoleCodes: this.savedResourceFiltersComponent.selectedRoleNameList.toString()
      }

      resourceFiltersData.push(resourceFilter);
      this.upsertResourceFilters(resourceFiltersData);
      this.modalRef.hide();
    }
  }

  upsertResourceFilters(resourceFiltersData: ResourceFilter[]) {
    this.upsertResourceFilter.emit(resourceFiltersData);
  }
}
