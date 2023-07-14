import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { AffiliationRole } from 'src/app/shared/interfaces/affiliationRole.interface';
import { CommitmentType } from 'src/app/shared/interfaces/commitmentType.interface';
import { Office } from 'src/app/shared/interfaces/office.interface';
import { PositionHierarchy } from 'src/app/shared/interfaces/positionHierarchy.interface';
import { PracticeArea } from 'src/app/shared/interfaces/practiceArea.interface';
import { ResourceFilter } from 'src/app/shared/interfaces/resource-filter.interface';
import { ServiceLine } from 'src/app/shared/interfaces/serviceLine.interface';
import { StaffableAsType } from 'src/app/shared/interfaces/staffableAsType.interface';
import { SystemconfirmationFormComponent } from 'src/app/shared/systemconfirmation-form/systemconfirmation-form.component';

@Component({
  selector: 'app-saved-resource-filter-detail',
  templateUrl: './saved-resource-filter-detail.component.html',
  styleUrls: ['./saved-resource-filter-detail.component.scss']
})
export class SavedResourceFilterDetailComponent implements OnInit {
  // -----------------------Local Variables--------------------------------------------//
  filterDetails = '';
  specialCharacter = ' • ';

  // -----------------------Input Events--------------------------------------------//
  @Input() officeFlatList: Office[];
  @Input() staffingTags: ServiceLine[];
  @Input() commitmentTypes: CommitmentType[];
  @Input() practiceAreas: PracticeArea[];
  @Input() affiliationRoles: AffiliationRole[];
  @Input() savedFilter: ResourceFilter;
  @Input() employeeStatus: any;
  @Input() sortsBy: any;
  @Input() filterConfig;
  @Input() staffableAsTypes: StaffableAsType[];
  @Input() positionsHierarchy: PositionHierarchy[];

  // -----------------------Output Events--------------------------------------------//
  @Output() refreshView = new EventEmitter<ResourceFilter>();
  @Output() deleteSavedFilter = new EventEmitter<string>();
  @Output() setAsDefaultFilter = new EventEmitter<ResourceFilter[]>();

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
    if (this.savedFilter) {
      this.setFilterDetailsText();
    }
  }

  onSavedFilterClick(savedFilter: ResourceFilter) {
    this.refreshView.emit(savedFilter);
  }

  onSetDefaultClick($event, savedFilter: ResourceFilter, isDefault) {
    $event.stopPropagation();
    const resourceFiltersData: ResourceFilter[] = [];

    const resourceFilter: ResourceFilter = {
      id: savedFilter.id,
      title: savedFilter.title,
      employeeCode: savedFilter.employeeCode,
      isDefault: isDefault,
      officeCodes: savedFilter.officeCodes,
      staffingTags: savedFilter.staffingTags,
      levelGrades: savedFilter.levelGrades,
      employeeStatuses: savedFilter.employeeStatuses,
      commitmentTypeCodes: savedFilter.commitmentTypeCodes,
      certificates: savedFilter.certificates,
      languages: savedFilter.languages,
      practiceAreaCodes: savedFilter.practiceAreaCodes,
      sortBy: savedFilter.sortBy,
      lastUpdatedBy: savedFilter.lastUpdatedBy,
      staffableAsTypeCodes: savedFilter.staffableAsTypeCodes,
      positionCodes: savedFilter.positionCodes,
      affiliationRoleCodes:savedFilter.affiliationRoleCodes
    }

    resourceFiltersData.push(resourceFilter);
    this.setAsDefaultFilter.emit(resourceFiltersData);

    if (isDefault) {
      this.refreshView.emit(resourceFilter);
    }
  }

  onDeleteSavedFilterClick($event, savedFilter: ResourceFilter) {
    $event.stopPropagation();

    const confirmationPopUpBodyMessage = 'Are you sure you want to delete "' + savedFilter.title + '" filter ?';
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        confirmationPopUpBodyMessage: confirmationPopUpBodyMessage
      }
    };

    const bsModalRef = this.modalService.show(SystemconfirmationFormComponent, config);
    bsModalRef.content.deleteResourceNote.subscribe(() => {
      this.deleteSavedFilter.emit(savedFilter.id);
    });

  }

  // -----------------------Private Methods--------------------------------------------//
  private setFilterDetailsText() {
    if (this.officeFlatList
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.Offices) > -1)
      this.filterDetails += this.savedFilter.officeCodes
        ? this.savedFilter.officeCodes.split(',').map(x =>
          this.officeFlatList.find(y => y.officeCode.toString() === x)?.officeName).join(",")
        : '';

    if (this.staffingTags
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.StaffingTags) > -1)
      this.filterDetails += this.savedFilter.staffingTags
        ? this.specialCharacter + this.savedFilter.staffingTags.split(',').map(x =>
          this.staffingTags.find(y => y.serviceLineCode.toString() === x)?.serviceLineName).join(",")
        : '';

    if (this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.LevelGrades) > -1)
      this.filterDetails += this.savedFilter.levelGrades ? this.specialCharacter + this.savedFilter.levelGrades : '';

    if (this.positionsHierarchy
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.PositionCodes) > -1) {
      let positions = this.positionsHierarchy
                      .map(y => y.children
                        .filter(z => this.savedFilter.positionCodes?.includes(z.value.toString())))
                      .filter(p => p.length)
                        .map(x => x.map(y => y.text))
                        .join(';');

      this.filterDetails += this.savedFilter.positionCodes
        ? this.specialCharacter + positions
        : '';
    }

    if (this.employeeStatus
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.EmployeeStatus) > -1)
      this.filterDetails += this.savedFilter.employeeStatuses
        ? this.specialCharacter + this.savedFilter.employeeStatuses.split(',').map(x =>
          this.employeeStatus.find(y => y.code.toString() === x)?.name).join(",")
        : '';

    if (this.commitmentTypes
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.CommitmentTypes) > -1) {
      this.filterDetails += this.savedFilter.commitmentTypeCodes
        ? this.specialCharacter + this.savedFilter.commitmentTypeCodes.split(',').map(x =>
          this.commitmentTypes.find(y => y.commitmentTypeCode.toString() === x)?.commitmentTypeName)
          .filter(r => !!r).join(",") // we are filtering because there are less commitment types in commitment tab than resources tab
        : '';
    }

    if (this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.Certificates) > -1)
      this.filterDetails += this.savedFilter.certificates ? this.specialCharacter + this.savedFilter.certificates : '';

    if (this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.Languages) > -1)
      this.filterDetails += this.savedFilter.languages ? this.specialCharacter + this.savedFilter.languages : '';

    if (this.practiceAreas
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.PracticeArea) > -1)
      this.filterDetails += this.savedFilter.practiceAreaCodes
        ? this.specialCharacter + this.savedFilter.practiceAreaCodes.split(',').map(x =>
          this.practiceAreas.find(y => y.practiceAreaCode.toString() === x)?.practiceAreaName).join(",")
        : '';

    if (this.affiliationRoles &&
      this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.AffiliationRole) > -1)
      this.filterDetails += this.savedFilter.affiliationRoleCodes 
      ? this.specialCharacter + this.savedFilter.affiliationRoleCodes.split(',').map(x =>
        this.affiliationRoles.find(y => y.roleCode.toString() === x)?.roleName).join(",")
      : '';
      

    if (this.sortsBy
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.SortBy) > -1)
      this.filterDetails += this.savedFilter.sortBy
        ? this.specialCharacter + this.savedFilter.sortBy.split(',').map(x =>
          this.sortsBy.find(y => y.code.toString() === x)?.name).join(",")
        : '';

    if (this.staffableAsTypes
      && this.filterConfig?.filtersToShow?.indexOf(ConstantsMaster.resourcesFilter.StaffableAs) > -1)
      this.filterDetails += this.savedFilter.staffableAsTypeCodes
        ? this.specialCharacter + this.savedFilter.staffableAsTypeCodes.split(',').map(x =>
          this.staffableAsTypes.find(y => y.staffableAsTypeCode.toString() === x)?.staffableAsTypeName).join(',')
        : '';
  }

}
