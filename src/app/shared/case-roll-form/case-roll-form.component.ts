// ----------------------- Angular Package References ----------------------------------//
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { debounceTime, mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// ----------------------- Component/Service References ----------------------------------//
import { DateService } from '../dateService';
import { ValidationService } from 'src/app/shared/validationService';
import { PopupDragService } from '../services/popupDrag.service';
import { SharedService } from '../shared.service';
import { ResourceAllocationService } from '../services/resourceAllocation.service';

// --------------------------Interfaces -----------------------------------------//
import { CaseRoll } from 'src/app/shared/interfaces/caseRoll.interface';
import { Project } from '../interfaces/project.interface';
import { ResourceAllocation } from '../interfaces/resourceAllocation.interface';

// ----------------------- External Libraries References ----------------------------------//
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';

// ----------------------- Constants/Enums ----------------------------------//
import { BS_DEFAULT_CONFIG } from '../constants/bsDatePickerConfig';
import { CaseRollOptions } from '../constants/enumMaster';

@Component({
  selector: 'app-case-roll-form',
  templateUrl: './case-roll-form.component.html',
  styleUrls: ['./case-roll-form.component.scss'],
  providers: [PopupDragService],
  encapsulation: ViewEncapsulation.None
})
export class CaseRollFormComponent implements OnInit {
  // --------------------------Local Variables---------------------------------//
  public errorList = [];
  public expectedEndDate: Date;
  public isDateInvalid: boolean;
  public isNewCaseInvalid: boolean;
  public isAllocationNotSelected: boolean;
  public updateResourceEndDateFromSource: boolean;
  public selectedCaseRollOption = CaseRollOptions.RollCurrentCase;
  public isRadioButtonNotSelected: boolean;
  public caseRollDialogTitle = '';
  bsConfig: Partial<BsDatepickerConfig>;
  gridData = [];
  isSelectAll = false;
  cases: Observable<Project>;
  public asyncCaseString = '';
  selectedCaseToRoll: Project;
  caseRollData: CaseRoll;
  isCaseRolled = false;
  dayAfterProjectEndDate: Date = null;
  minDate: Date = null;
  caseRollOptionsEnum = CaseRollOptions;
  allocationsToBeReverted: ResourceAllocation[] = [];
  isAllocationGridDisabled = false;
  public allocationsGridData: ResourceAllocation[] = [];
  public allAllocationsInPast30Days: ResourceAllocation[] = [];
  revertCaseRollMessage = `Reverting case roll will revert the end date of the rolled allocation(s)
  to original case end date, i.e.,`;
  monthCloseErrorMessage: string;
  // -----------------------Variables affected from outside the component -----------------//
  public project: Project;

  // --------------------------Ouput Events--------------------------------//
  @Output() upsertCaseRollAndAllocations = new EventEmitter<any>();
  @Output() revertCaseRollAndAllocations = new EventEmitter<any>();

  constructor(public bsModalRef: BsModalRef,
    private sharedService: SharedService,
    private resourceAllocationService: ResourceAllocationService,
    private _popupDragService: PopupDragService) { }

  // --------------------------Life Cycle Event handlers---------------------------------//
  ngOnInit() {

    if (!this.project || !this.project.oldCaseCode) {
      this.closeForm();
      return;
    }

    this.getCaseAllocations();
    this.initializeDatePicker();

    if (this.project.caseRoll) {

      this.caseRollData = this.project.caseRoll;
      this.caseRollDialogTitle = 'View Case Roll';
      this.isCaseRolled = true;
      this.minDate = new Date(this.caseRollData.currentCaseEndDate);
      this.loadCaseRolledData();
      this.setRevertCaseRollMessage();

    } else {

      const dayAfterProjectEndDate = new Date(this.project.endDate);
      this.caseRollDialogTitle = 'Add Case Roll';
      this.isCaseRolled = false;
      this.minDate = dayAfterProjectEndDate;
      this.expectedEndDate = dayAfterProjectEndDate;
      this.expectedEndDate.setDate(this.expectedEndDate.getDate() + 1);

    }

    this.enableDisableAllocationGrid();
    this.attachEventForCaseSearch();
    this._popupDragService.dragEvents();
  }

  initializeDatePicker() {
    this.bsConfig = BS_DEFAULT_CONFIG;
  }

  getCaseAllocations() {
    const effectiveFromDate = DateService.convertDateInBainFormat(DateService.addDays(new Date(), -30));
    this.sharedService.getCaseAllocations(this.project.oldCaseCode, effectiveFromDate).subscribe(allocations => {
      this.allAllocationsInPast30Days = allocations.filter(x => !x.isPlaceholderAllocation);
      this.allocationsGridData = this.getFilteredAllocationsForGrid();
      this.loadEmployeeGrid();
    });
  }

  setRevertCaseRollMessage() {
    this.revertCaseRollMessage += ` ${DateService.convertDateInBainFormat(this.project.endDate)}`;
  }

  loadCaseRolledData() {
    if (this.caseRollData.rolledFromOldCaseCode && !this.caseRollData.rolledToOldCaseCode) {
      this.selectedCaseRollOption = CaseRollOptions.RollCurrentCase;
      this.expectedEndDate = new Date(this.caseRollData.expectedCaseEndDate);
    } else if (this.caseRollData.rolledToOldCaseCode) {
      this.selectedCaseRollOption = CaseRollOptions.RollTeamToNewCase;
      this.asyncCaseString = this.caseRollData.rolledToOldCaseCode;
    }
  }

  loadEmployeeGrid() {
    this.gridData = [];

    if (this.allocationsGridData) {
      this.enableDisableAllocationGrid();

      this.allocationsGridData.forEach((allocation, index) => {
        const row = {
          id: 'row-' + index,
          data: allocation,
          checked: this.isAllocationGridDisabled
            ? true // Select All filtered rolled resources
            : Date.parse(allocation.endDate) === Date.parse(this.project.endDate) // Select if allocation end date is same as case end date
        };

        this.gridData.push(row);
      });

      this.checkUncheckSelectAll();
    }

  }

  // --------------------------Event handlers---------------------------------//

  attachEventForCaseSearch() {

    this.cases = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.asyncCaseString);
    }).pipe(
      debounceTime(500),
      mergeMap((token: string) => this.sharedService.getCasesBySearchString(token))
    );

  }

  OnSelectAllChanged(value) {
    this.isSelectAll = !this.isSelectAll;

    this.gridData.forEach(row => {
      row.checked = this.isSelectAll;
    });
  }

  OnSelectRowChanged(row) {
    row.checked = !row.checked;
    this.checkUncheckSelectAll();
  }

  checkUncheckSelectAll() {
    const isRowUnchecked = this.gridData.find(x => !x.checked);
    this.isSelectAll = isRowUnchecked ? false : true;
  }

  typeaheadOnSelect(event) {
    this.selectedCaseToRoll = event.item;
  }

  validateField(fieldName) {
    switch (fieldName) {
      case 'expectedEndDate': {
        if (this.expectedEndDate === undefined || this.expectedEndDate == null) {
          this.isDateInvalid = true;
          this.addToErrorList('required');
        } else if (!ValidationService.isValidDate(this.expectedEndDate.toDateString())) {
          this.isDateInvalid = true;
          this.addToErrorList('dateInvalid');
        } else if (this.expectedEndDate < new Date(this.project.endDate)) {
          this.isDateInvalid = true;
          this.addToErrorList('dateSmallerThanProjectDate');
        } else if (new Date(this.caseRollData?.expectedCaseEndDate).toDateString() === this.expectedEndDate.toDateString()) {
          this.isDateInvalid = true;
          this.addToErrorList('unchangedDate');
        } else {
          this.isDateInvalid = false;
        }
        this.isNewCaseInvalid = false;
        break;
      }
      case 'rolledToNewCaseSelected': {
        if (!this.asyncCaseString) {
          this.isNewCaseInvalid = true;
          this.addToErrorList('required');
        } else if (!this.selectedCaseToRoll || !this.selectedCaseToRoll.oldCaseCode) {
          this.isNewCaseInvalid = true;
          this.addToErrorList('typeaheadInvalid');
        } else if (this.selectedCaseToRoll.oldCaseCode === this.project.oldCaseCode) {
          this.isNewCaseInvalid = true;
          this.addToErrorList('caseRollToSameCase');
        } else {
          this.isNewCaseInvalid = false;
        }
        this.isDateInvalid = false;
        break;
      }
      case 'atleastOneAllocationSelected': {
        if (this.gridData.length === 0) {
          this.isAllocationNotSelected = true;
          this.addToErrorList('caseRollForNoActiveAllocation');
        }
        else if (!this.gridData.find(x => x.checked)) {
          this.isAllocationNotSelected = true;
          this.addToErrorList('atleastOneAllocationSelected');
        } else {
          this.isAllocationNotSelected = false;
        }
        break;
      }
    }
  }

  addToErrorList(type) {
    switch (type) {
      case 'required': {
        if (this.errorList.indexOf(ValidationService.requiredMessage) === -1) {
          this.errorList.push(ValidationService.requiredMessage);
        }
        break;
      }
      case 'dateInvalid': {
        if (this.errorList.indexOf(ValidationService.dateInvalidMessage) === -1) {
          this.errorList.push(ValidationService.dateInvalidMessage);
        }
        break;
      }
      case 'dateSmallerThanProjectDate': {
        if (this.errorList.indexOf(ValidationService.dateSmallerThanProjectDate) === -1) {
          this.errorList.push(ValidationService.dateSmallerThanProjectDate);
        }
        break;
      }
      case 'typeaheadInvalid': {
        if (this.errorList.indexOf(ValidationService.typeaheadInvalidMessage) === -1) {
          this.errorList.push(ValidationService.typeaheadInvalidMessage);
        }
        break;
      }
      case 'atleastOneAllocationSelected': {
        if (this.errorList.indexOf(ValidationService.atleastOneAllocationSelected) === -1) {
          this.errorList.push(ValidationService.atleastOneAllocationSelected);
        }
        break;
      }
      case 'caseRollForNoActiveAllocation': {
        if (this.errorList.indexOf(ValidationService.caseRollForNoActiveAllocationMessage) === -1) {
          this.errorList.push(ValidationService.caseRollForNoActiveAllocationMessage);
        }
        break;
      }
      case 'caseRollToSameCase': {
        if (this.errorList.indexOf(ValidationService.caseRollToSameCase) === -1) {
          this.errorList.push(ValidationService.caseRollToSameCase);
        }
        break;
      }
      case 'unchangedDate': {
        const unchangedMessage = 'No change detected. Please update expected end date.'
        if (this.errorList.indexOf(unchangedMessage) === -1) {
          this.errorList.push(unchangedMessage);
        }
        break;
      }
      case 'monthClose': {
        if (this.errorList.indexOf(this.monthCloseErrorMessage) === -1) {
          this.errorList.push(this.monthCloseErrorMessage);
        }
        break;
      }
    }
  }

  isDataValid() {
    this.errorList = [];

    if (this.selectedCaseRollOption === CaseRollOptions.RollCurrentCase) {
      this.validateField('expectedEndDate');
    } else if (this.selectedCaseRollOption === CaseRollOptions.RollTeamToNewCase) {
      this.validateField('rolledToNewCaseSelected');
    }

    this.validateField('atleastOneAllocationSelected');

    if (this.isDateInvalid || this.isNewCaseInvalid || this.errorList.length) {
      return false;
    } else {
      return true;
    }
  }

  rollCurrentCase() {

    const selectedAllocations: ResourceAllocation[] = this.gridData.filter(x => x.checked).map(y => y.data);

    const expectedCaseEndDate = DateService.convertDateInBainFormat(this.expectedEndDate);
    const currentCaseEndDate = DateService.convertDateInBainFormat(this.project.endDate);
    const rolledScheduleIds = selectedAllocations.map(x => x.id).join();

    let caseRollObj: CaseRoll = {} as CaseRoll;
    if (this.isCaseRolled && !this.caseRollData.rolledToOldCaseCode) {
      const caseRollData = this.caseRollData;
      caseRollData.expectedCaseEndDate = expectedCaseEndDate;

      caseRollObj = caseRollData;

    } else {
      const caseRollData: CaseRoll = {
        rolledFromOldCaseCode: this.project.oldCaseCode,
        rolledToOldCaseCode: null,
        currentCaseEndDate: currentCaseEndDate,
        expectedCaseEndDate: expectedCaseEndDate,
        isProcessedFromCCM: false,
        rolledScheduleIds: rolledScheduleIds,
        lastUpdatedBy: null
      };

      caseRollObj = caseRollData;
    }

    let updatedResourcesAllocations = JSON.parse(JSON.stringify(selectedAllocations));
    updatedResourcesAllocations.map(x => {
      x.previousEndDate = currentCaseEndDate;
      x.endDate = expectedCaseEndDate;
      return x;
    });

    const [isValidAllocation, monthCloseErrorMessage] = this.resourceAllocationService.validateMonthCloseForUpdates(updatedResourcesAllocations, selectedAllocations);
    this.monthCloseErrorMessage = monthCloseErrorMessage;

    if (!isValidAllocation) {
      this.isDateInvalid = true;
      this.addToErrorList('monthClose');
      return;

    } else {
      // Add pre post allocations for the employees whose pre/post allocations needs to be adjusted as per case Roll
      const prePostAllocationsThatOverlapWithCaseRoll = this.allAllocationsInPast30Days.filter(x => x.investmentCode === 4 && updatedResourcesAllocations.map(y => y.employeeCode).includes(x.employeeCode))
      updatedResourcesAllocations = updatedResourcesAllocations.concat(prePostAllocationsThatOverlapWithCaseRoll);

      this.upsertCaseRollAndAllocations.emit({ caseRoll: caseRollObj, resourceAllocations: updatedResourcesAllocations, project: this.project });

    }

    this.closeForm();

  }

  rollTeamToNewCase() {

    if (this.isCaseRolled && this.caseRollData.rolledFromOldCaseCode) {
      const allocationsToRevert: ResourceAllocation[] =
        this.gridData.filter(x => this.caseRollData.rolledScheduleIds.toLowerCase().includes(x.data.id.toLowerCase())).map(y => y.data);

      const updatedAllocationsAfterRevert = JSON.parse(JSON.stringify(allocationsToRevert));
      updatedAllocationsAfterRevert.forEach(alloc => {
        alloc.endDate = DateService.convertDateInBainFormat(this.caseRollData.currentCaseEndDate);
      });

      const selectedAllocationsToRollToNewCase: ResourceAllocation[] = this.gridData.filter(x => x.checked).map(y => y.data);
      const rolledScheduleIds = selectedAllocationsToRollToNewCase.map(x => x.id).join();

      const resourcesAllocationsToInsert = selectedAllocationsToRollToNewCase.map(alloc => {

        return this.resourceAllocationService.convertToNewResourceAllocation(alloc, this.selectedCaseToRoll);

      });

      const [isValidAllocationForRevert, errorMessageForRevert] = this.resourceAllocationService.validateMonthCloseForUpdates(updatedAllocationsAfterRevert, allocationsToRevert);
      const [isValidAllocationForRollToNewCase, errorMessageForRollToNewCase] = this.resourceAllocationService.validateMonthCloseForInsertAndDelete(resourcesAllocationsToInsert);

      if (!isValidAllocationForRevert) {
        this.monthCloseErrorMessage = errorMessageForRevert;
        this.isDateInvalid = true;
        this.addToErrorList('monthClose');
        return;
      } else if (!isValidAllocationForRollToNewCase) {
        this.monthCloseErrorMessage = errorMessageForRollToNewCase;
        this.isDateInvalid = true;
        this.addToErrorList('monthClose');
        return;
      } else {
        this.caseRollData.rolledToOldCaseCode = this.selectedCaseToRoll.oldCaseCode;
        this.caseRollData.rolledScheduleIds = rolledScheduleIds;
        this.caseRollData.currentCaseEndDate = null;
        this.caseRollData.expectedCaseEndDate = null;
        const allocationsToUpsert = updatedAllocationsAfterRevert.concat(resourcesAllocationsToInsert);

        this.upsertCaseRollAndAllocations.emit({ caseRoll: this.caseRollData, resourceAllocations: allocationsToUpsert, project: this.project });

      }

    } else {
      const selectedAllocations: ResourceAllocation[] = this.gridData.filter(x => x.checked).map(y => y.data);
      const rolledScheduleIds = selectedAllocations.map(x => x.id).join();

      const caseRollObj: CaseRoll = {
        rolledFromOldCaseCode: this.project.oldCaseCode,
        rolledToOldCaseCode: this.selectedCaseToRoll.oldCaseCode,
        currentCaseEndDate: null,
        expectedCaseEndDate: null,
        isProcessedFromCCM: false,
        rolledScheduleIds: rolledScheduleIds,
        lastUpdatedBy: null
      };

      const resourcesAllocations = selectedAllocations.map(alloc => {

        return this.resourceAllocationService.convertToNewResourceAllocation(alloc, this.selectedCaseToRoll);

      });

      const [isValidAllocation, monthCloseErrorMessage] = this.resourceAllocationService.validateMonthCloseForInsertAndDelete(resourcesAllocations);
      this.monthCloseErrorMessage = monthCloseErrorMessage;

      if (!isValidAllocation) {
        this.isDateInvalid = true;
        this.addToErrorList('monthClose');
        return;
      } else {
        this.upsertCaseRollAndAllocations.emit({ caseRoll: caseRollObj, resourceAllocations: resourcesAllocations, project: this.project, allocationDataBeforeSplitting: resourcesAllocations });
      }

    }

    this.closeForm();

  }

  revertCaseRoll() {
    const allocationsToRevert: ResourceAllocation[] =
      this.gridData
        .filter(x => x.checked && this.caseRollData.rolledScheduleIds.toLowerCase().includes(x.data.id.toLowerCase()))
        .map(y => y.data);

    const updatedAllocationsAfterRevert = JSON.parse(JSON.stringify(allocationsToRevert));

    updatedAllocationsAfterRevert.forEach(alloc => {
      alloc.previousEndDate = alloc.endDate;
      alloc.endDate = DateService.convertDateInBainFormat(this.caseRollData.currentCaseEndDate);
    });

    const [isValidAllocation, monthCloseErrorMessage] = this.resourceAllocationService.validateMonthCloseForUpdates(updatedAllocationsAfterRevert, allocationsToRevert);
    this.monthCloseErrorMessage = monthCloseErrorMessage;

    if (!isValidAllocation) {
      this.isDateInvalid = true;
      this.addToErrorList('monthClose');
      return;
    } else {
      this.revertCaseRollAndAllocations.emit({ caseRoll: this.caseRollData, resourceAllocations: updatedAllocationsAfterRevert, project: this.project });
    }

    this.closeForm();

  }

  addCaseRoll() {

    switch (this.selectedCaseRollOption) {
      case CaseRollOptions.RevertCaseRoll:
        {
          if (!this.isDataValid()) {
            return false;
          }
          this.revertCaseRoll();
          break;
        }
      case CaseRollOptions.RollCurrentCase:
        {
          if (!this.isDataValid()) {
            return false;
          }

          this.rollCurrentCase();
          break;
        }
      case CaseRollOptions.RollTeamToNewCase:
        {
          if (!this.isDataValid()) {
            return false;
          }

          this.rollTeamToNewCase();
          break;
        }
    }

  }

  expectedEndDateChange() {
    if (this.expectedEndDate &&
      (isNaN(this.expectedEndDate.getTime()) || this.expectedEndDate <= new Date(this.project.endDate))) {
      this.expectedEndDate = new Date(this.project.endDate);
    }
  }

  onCaseRollTypeChange(caseRollType) {

    if (this.isCaseRolled) {
      switch (caseRollType) {
        case CaseRollOptions.RollCurrentCase:
        case CaseRollOptions.RevertCaseRoll:
          this.allocationsGridData = this.getFilteredAllocationsForGrid();
          break;
        case CaseRollOptions.RollTeamToNewCase:
          this.allocationsGridData = this.allAllocationsInPast30Days?.filter(x => x.investmentCode !== 4);
          break;
      }

      this.loadEmployeeGrid();
    }

  }

  enableDisableAllocationGrid() {
    if (this.isCaseRolled && (this.caseRollData?.rolledToOldCaseCode || this.selectedCaseRollOption === CaseRollOptions.RollCurrentCase)) {
      this.isAllocationGridDisabled = true;
    }
    else {
      this.isAllocationGridDisabled = false;
    }
  }

  getFilteredAllocationsForGrid() {

    if (this.isCaseRolled && this.caseRollData.rolledScheduleIds) {
      // Filter allocations that are not rolled
      return this.allAllocationsInPast30Days?.filter(x => this.caseRollData.rolledScheduleIds.toLowerCase().includes(x.id));
    } else {
      // Filter pre-post allocations
      return this.allAllocationsInPast30Days?.filter(x => x.investmentCode !== 4);
    }
  }

  closeForm() {
    this.bsModalRef.hide();
  }

}
