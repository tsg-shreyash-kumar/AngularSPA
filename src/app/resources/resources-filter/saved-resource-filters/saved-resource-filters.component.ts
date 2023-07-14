import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CoreService } from 'src/app/core/core.service';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { AffiliationRole } from 'src/app/shared/interfaces/affiliationRole.interface';
import { Certificate } from 'src/app/shared/interfaces/certificate.interface';
import { CommitmentType } from 'src/app/shared/interfaces/commitmentType.interface';
import { Language } from 'src/app/shared/interfaces/language';
import { LevelGrade } from 'src/app/shared/interfaces/levelGrade.interface';
import { Office } from 'src/app/shared/interfaces/office.interface';
import { PositionHierarchy } from 'src/app/shared/interfaces/positionHierarchy.interface';
import { PracticeArea } from 'src/app/shared/interfaces/practiceArea.interface';
import { ResourceFilter } from 'src/app/shared/interfaces/resource-filter.interface';
import { ServiceLine } from 'src/app/shared/interfaces/serviceLine.interface';
import { ServiceLineHierarchy } from 'src/app/shared/interfaces/serviceLineHierarchy';
import { StaffableAsType } from 'src/app/shared/interfaces/staffableAsType.interface';
import { UserPreferences } from 'src/app/shared/interfaces/userPreferences.interface';
import { LocalStorageService } from 'src/app/shared/local-storage.service';

@Component({
  selector: 'app-saved-resource-filters',
  templateUrl: './saved-resource-filters.component.html',
  styleUrls: ['./saved-resource-filters.component.scss']
})
export class SavedResourceFiltersComponent implements OnInit {
  // Input
  @Input() resourceFilterGroup: ResourceFilter;
  @Input() isEditMode: boolean = false;

  // Outputs
  @Output() getResources = new EventEmitter();
  @Output() getResourcesSortBySelectedValues = new EventEmitter();
  @Output() showCommitmentBySelectedValues = new EventEmitter();

  // Variables
  officeHierarchy;
  officeFlatList: Office[];
  staffingTagsHierarchy: ServiceLineHierarchy[];
  staffingTags: ServiceLine[];
  levelGrades: LevelGrade[];
  commitmentTypes: CommitmentType[];
  certificates: Certificate[];
  languages: Language[];
  affiliationRoles: AffiliationRole[];
  staffableAsTypes: StaffableAsType[];
  positionsHierarchy: PositionHierarchy[];
  practiceAreas: PracticeArea[];
  sortsBy;

  userPreferences: UserPreferences;

  readonly resourceFilters = ConstantsMaster.resourcesFilter;

  selectedOfficeList = [];

  staffingTagDropdownList;
  selectedStaffingTagList = [];

  levelGradeDropdownList;
  selectedLevelGradeList = [];

  positionDropdownList;
  selectedPositionList = [];

  staffableAsDropdownList;
  selectedStaffableAsList = [];

  employeeStatusDropDownList;
  employeeStatus = [];
  selectedEmployeeStatusList = [];

  commitmentTypesDropDownList;
  selectedCommitmentTypeList = [];

  certificatesDropDownList;
  selectedCertificatesList = [];

  languagesDropDownList;
  selectedLanguagesList = [];

  roleNameDropdownList;
  selectedRoleNameList = [];

  sortByDropdownList;
  selectedSortByList = [];

  practiceAreaDropDownList;
  selectedPracticeAreaList = [];

  constructor(private coreService: CoreService, private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.userPreferences = JSON.parse(this.localStorageService.get(ConstantsMaster.localStorageKeys.userPreferences, 'monthly'));

    this.initializeDropdowns();

    this.initializeOfficesFilter();
    this.initializeStaffingTagsFilter();
    this.initializeLevelGradesFilter();
    this.initializeCommitmentTypesFilter();
    this.initializeCertificatesFilter();
    this.initializeLanguagesFilter();
    this.initializeSortByFilter();
    this.initializeRoleNameFilter();
    this.initializePracticeAreaFilter();
    this.initializeEmployeeStatusFilter();
    this.initializeStaffableAsFilter();
    this.initializePositionFilter();
  }

  isStringNullOrEmpty(value) {
    if (value === null || value === undefined || value === '') {
      return true;
    } else {
      return false;
    }
  }

  // Initialing dropdown data
  initializeDropdowns() {
    if (this.coreService.loggedInUserClaims.Roles?.includes('PracticeStaffing')) {
      this.officeHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.officeHierarchyEMEA);
    } else {
      this.officeHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.officeHierarchy);
    }

    this.officeFlatList = this.localStorageService.get(ConstantsMaster.localStorageKeys.OfficeList);
    this.staffingTagsHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.staffingTagsHierarchy);
    this.staffingTags = this.localStorageService.get(ConstantsMaster.localStorageKeys.staffingTags);
    this.levelGrades = this.localStorageService.get(ConstantsMaster.localStorageKeys.levelGradesHierarchy);
    this.positionsHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.positionsHierarchy);
    this.staffableAsTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.staffableAsTypes);
    this.commitmentTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.commitmentTypes);
    this.certificates = this.localStorageService.get(ConstantsMaster.localStorageKeys.certificates);
    this.languages = this.localStorageService.get(ConstantsMaster.localStorageKeys.languages);
    this.affiliationRoles = this.localStorageService.get(ConstantsMaster.localStorageKeys.affiliationRoles);
    this.practiceAreas = this.localStorageService.get(ConstantsMaster.localStorageKeys.practiceAreas);
    this.sortsBy = ConstantsMaster.sortBy;
  }

  private initializeOfficesFilter() {
    if (this.officeHierarchy) {
      this.officeHierarchy = JSON.parse(JSON.stringify(this.officeHierarchy));
    }

    if (this.isEditMode) {
      this.selectedOfficeList = this.resourceFilterGroup.officeCodes.split(",");
    } else {
      this.selectedOfficeList = [];
    }
  }

  private initializeStaffableAsFilter() {
    if (this.staffableAsTypes) {
      this.staffableAsTypes = this.staffableAsTypes.filter(x => x.staffableAsTypeCode > -1);
      this.staffableAsDropdownList = {
        text: 'All',
        value: 0,
        checked: false,
        children: this.staffableAsTypes.map(item => {
          return {
            text: item.staffableAsTypeName,
            value: item.staffableAsTypeCode,
            checked: false
          }
        })
      };
    }

    if (this.isEditMode) {
      this.selectedStaffableAsList = this.resourceFilterGroup.staffableAsTypeCodes.split(",");
    } else {
      this.selectedStaffableAsList = [];
    }
  }

  private initializePositionFilter() {
    if (this.positionsHierarchy && this.userPreferences) {
      this.positionDropdownList = {
        text: 'All',
        value: 0,
        checked: false,
        children: this.positionsHierarchy.map((item) => {
          return {
            text: item.text,
            value: item.value,
            collapsed: true,
            children: item.children != null ? item.children.map(child => {
              return {
                text: child.text,
                value: child.value,
                checked: false
              };
            }) : null,
            checked: false
          };
        })
      };

      if (this.isEditMode) {
        this.selectedPositionList = this.resourceFilterGroup.positionCodes.split(",");
      } else {
        this.selectedPositionList = this.userPreferences.positionCodes ? this.userPreferences.positionCodes.split(',') : [];
      }
    }
  }

  private initializePracticeAreaFilter() {
    if (this.practiceAreas) {
      this.practiceAreaDropDownList = {
        text: 'All',
        value: 0,
        checked: false,
        children: this.practiceAreas.map(item => {
          return {
            text: item.practiceAreaName,
            value: item.practiceAreaCode,
            checked: false
          }
        })
      };
    }

    if (this.isEditMode) {
      this.selectedPracticeAreaList = this.resourceFilterGroup.practiceAreaCodes.split(",");
    } else {
      this.selectedPracticeAreaList = [];
    }
  }

  private initializeStaffingTagsFilter() {
    if (this.staffingTagsHierarchy) {
      this.staffingTagDropdownList = {
        text: 'All',
        value: 0,
        checked: false,
        children: this.staffingTagsHierarchy.map((item) => {
          return {
            text: item.text,
            value: item.value,
            collapsed: true,
            children: item.children != null ? item.children.map(child => {
              return {
                text: child.text,
                value: child.value,
                checked: false
              };
            }) : null,
            checked: false
          };
        })
      };
    }

    if (this.isEditMode) {
      this.selectedStaffingTagList = this.resourceFilterGroup.staffingTags.split(",");
    } else {
      this.selectedStaffingTagList = [];
    }
  }

  private initializeLevelGradesFilter() {
    if (this.levelGrades) {
      const levelGradeChildrenList = this.levelGrades.map(item => {
        return {
          text: item.text,
          value: item.value,
          collapsed: true,
          children: item.children.map(child => {
            return {
              text: child.text,
              value: child.value,
              checked: false
            };
          }),
          checked: false
        };
      });
      this.levelGradeDropdownList = {
        text: 'All',
        value: 0,
        checked: false,
        children: levelGradeChildrenList
      };

      if (this.isEditMode) {
        this.selectedLevelGradeList = this.resourceFilterGroup.levelGrades.split(",");
      } else {
        this.selectedLevelGradeList = [];
      }
    }
  }

  private initializeCommitmentTypesFilter() {
    this.commitmentTypes = this.commitmentTypes.filter(type => type.commitmentTypeCode != '');
    this.commitmentTypesDropDownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.commitmentTypes.map(item => {
        return {
          text: item.commitmentTypeName,
          value: item.commitmentTypeCode,
          checked: false
        };
      })
    };

    if (this.isEditMode) {
      this.selectedCommitmentTypeList = this.resourceFilterGroup.commitmentTypeCodes.split(",");
    } else {
      this.selectedCommitmentTypeList = this.commitmentTypes.map(item => item.commitmentTypeCode); // Select ALL as the default option for Commitment Type
    }
  }

  private initializeCertificatesFilter() {
    if (this.certificates) {
      this.certificatesDropDownList = {
        text: 'All',
        value: 0,
        checked: false,
        children: this.certificates.map(item => {
          return {
            text: item.name,
            value: item.name,
            checked: false
          };
        })
      };

      if (this.isEditMode) {
        this.selectedCertificatesList = this.resourceFilterGroup.certificates.split(",");
      } else {
        this.selectedCertificatesList = [];
      }
    }
  }

  private initializeLanguagesFilter() {
    if (this.languages) {
      this.languagesDropDownList = {
        text: 'All',
        value: 0,
        checked: false,
        children: this.languages.map(item => {
          return {
            text: item.name,
            value: item.name,
            checked: false
          };
        })
      };

      if (this.isEditMode) {
        this.selectedLanguagesList = this.resourceFilterGroup.languages.split(",");
      } else {
        this.selectedLanguagesList = [];
      }
    }
  }

  private initializeSortByFilter() {
    this.sortByDropdownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.sortsBy.map(item => {
        return {
          text: item.name,
          value: item.code,
          checked: false
        };
      })
    };

    if (this.isEditMode) {
      this.selectedSortByList = this.resourceFilterGroup.sortBy.split(",");
    } else {
      this.selectedSortByList = [];
    }
  }

  private initializeRoleNameFilter() {
    this.roleNameDropdownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.affiliationRoles.map(item => {
        return {
          text: item.roleName,
          value: item.roleCode,
          checked: false
        };
      })
    };

    if (this.isEditMode) {
      this.selectedRoleNameList = this.resourceFilterGroup.affiliationRoleCodes.split(",");
    } else {
      this.selectedRoleNameList = [];
    }
  }

  private initializeEmployeeStatusFilter() {
    this.employeeStatus = ConstantsMaster.employeeStatus;
    this.employeeStatusDropDownList = {
      text: 'All',
      value: 0,
      checked: false,
      children: this.employeeStatus.map(item => {
        return {
          text: item.name,
          value: item.code,
          checked: false
        };
      })
    };


    if (this.isEditMode) {
      this.selectedEmployeeStatusList = this.resourceFilterGroup.employeeStatuses.split(",");
    } else {
      this.selectedEmployeeStatusList = this.employeeStatus.map(item => item.code); // Select ALL as the default option for Commitment Type
    }
  }

  // Selecting dropdown data
  showResourcesCertificatesBySelectedValue(certificatesList) {
    if (this.isArrayEqual(this.selectedCertificatesList.map(String), certificatesList.split(','))) {
      return false;
    }
    this.selectedCertificatesList = certificatesList.split(',');
    this.getFilteredResources();
  }

  showResourcesLanguagesBySelectedValue(languagesList) {
    if (this.isArrayEqual(this.selectedLanguagesList.map(String), languagesList.split(','))) {
      return false;
    }
    this.selectedLanguagesList = languagesList.split(',');
    this.getFilteredResources();
  }

  showResourcesPracticeAreaBySelectedValue(practiceAreaList) {
    if (this.isArrayEqual(this.selectedPracticeAreaList.map(String), practiceAreaList.split(','))) {
      return false;
    }
    this.selectedPracticeAreaList = !this.isStringNullOrEmpty(practiceAreaList) ? practiceAreaList?.split(',') : [];

    // this.showOrHideAffiliationRoleFilter();
    this.getFilteredResources();
  }

  showResourcesRoleNameBySelectedValue(roleNameList) {
    if (this.isArrayEqual(this.selectedRoleNameList.map(String), roleNameList.split(','))) {
      return false;
    }
    this.selectedRoleNameList = roleNameList.split(',');
    this.getFilteredResources();
  }

  getResourcesBySelectedOfficeHandler(officeCodes) {
    if (officeCodes && this.isArrayEqual(this.selectedOfficeList.map(String), officeCodes.split(','))) {
      return false;
    }
    this.selectedOfficeList = officeCodes.split(',');
    this.getFilteredResources();
  }

  getResourcesBySelectedLevelGrades(levelGrades) {
    if (this.isArrayEqual(this.selectedLevelGradeList.map(String), levelGrades.split(','))) {
      return false;
    }
    this.selectedLevelGradeList = levelGrades.split(',');
    this.getFilteredResources();
  }

  getResourcesBySelectedPositionList(position) {
    if (this.isArrayEqual(this.selectedPositionList.map(String), position.split(','))) {
      return false;
    }
    this.selectedPositionList = position.split(',');
    this.getFilteredResources();
  }

  getResourcesBySelectedStaffableAs(staffableAsTypeCodes) {
    if (this.isArrayEqual(this.selectedStaffableAsList.map(String), staffableAsTypeCodes.split(','))) {
      return false;
    }
    this.selectedStaffableAsList = staffableAsTypeCodes.split(',');
    this.getFilteredResources();
  }

  getResourcesBySelectedStaffingTags(staffingTagCodes) {
    if (this.isArrayEqual(this.selectedStaffingTagList.map(String), staffingTagCodes.split(','))) {
      return false;
    }
    this.selectedStaffingTagList = staffingTagCodes.split(',');
    this.getFilteredResources();
  }

  getResourcesSortBySelectedValue(sortByList) {
    if (this.isArrayEqual(this.selectedSortByList.map(String), sortByList.split(','))) {
      return false;
    }

    this.selectedSortByList = sortByList.split(',');
    const sortBy = this.selectedSortByList.toString();

    this.getResourcesSortBySelectedValues.emit({ sortBy, direction: 'asc' });

  }

  getResourcesByRoleNameSelectedValue(roleNameList) {
    if (this.isArrayEqual(this.selectedRoleNameList.map(String), roleNameList.split(','))) {
      return false;
    }
    this.selectedRoleNameList = roleNameList.split(',');
    this.getFilteredResources();


  }

  showResourcesCommitmentsBySelectedValue(commitmentTypeList) {
    if (this.isArrayEqual(this.selectedCommitmentTypeList.map(String), commitmentTypeList.split(','))) {
      return false;
    }
    this.selectedCommitmentTypeList = commitmentTypeList.split(',');
    this.showCommitmentBySelectedValues.emit({ commitmentTypes: this.selectedCommitmentTypeList });
  }

  getResourcesEmployeeStatusBySelectedValue(employeeStatusList) {
    if (this.isArrayEqual(this.selectedEmployeeStatusList.map(String), employeeStatusList.split(','))) {
      return false;
    }
    this.selectedEmployeeStatusList = employeeStatusList.split(',');
    this.getFilteredResources();
  }

  private getFilteredResources() {
    const officeCodes = this.selectedOfficeList?.toString();
    const levelGrades = this.selectedLevelGradeList?.toString();
    const staffingTags = this.selectedStaffingTagList?.toString();
    const sortBy = this.selectedSortByList?.toString();
    const certificates = this.selectedCertificatesList?.toString();
    const languages = this.selectedLanguagesList?.toString();
    const employeeStatuses = this.selectedEmployeeStatusList?.toString();
    const roleCodes = this.selectedRoleNameList?.toString();
    const staffableAsTypeCodes = this.selectedStaffableAsList?.toString();
    const positionCodes = this.selectedPositionList?.toString();
    const practiceAreas = this.selectedPracticeAreaList?.toString();

    this.getResources.emit({ officeCodes, levelGrades, staffingTags, sortBy, certificates, languages, employeeStatuses, practiceAreas, staffableAsTypeCodes, positionCodes, roleCodes });
  }

  private isArrayEqual(array1, array2) {
    return JSON.stringify(array1) === JSON.stringify(array2);
  }
}
