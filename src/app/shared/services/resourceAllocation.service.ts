// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';
// ----------------------- component References ----------------------------------//
import { ResourceAllocation } from '../interfaces/resourceAllocation.interface';

// ----------------------- Service References ----------------------------------//
import { DateService } from '../dateService';

// --------------------------Utils -----------------------------------------//
import * as moment from 'moment';
import { Project } from '../interfaces/project.interface';
import { ConstantsMaster } from '../constants/constantsMaster';
import { ValidationService } from '../validationService';
import { NotificationService } from '../notification.service';
import { CoreService } from 'src/app/core/core.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourceAllocationService {

  constructor(
    private notifyService: NotificationService,
    private coreService: CoreService
  ) { }

  convertToNewResourceAllocation(resourceAllocation: ResourceAllocation, projectData: Project): ResourceAllocation {
    const allocation = {} as ResourceAllocation;

    allocation.oldCaseCode = projectData.oldCaseCode;
    allocation.caseName = projectData.caseName;
    allocation.clientName = projectData.clientName;
    allocation.caseTypeCode=projectData.caseTypeCode;
    allocation.pipelineId = projectData.pipelineId;
    allocation.opportunityName = projectData.opportunityName;
    allocation.employeeCode = resourceAllocation.employeeCode;
    allocation.employeeName = resourceAllocation.employeeName;
    allocation.operatingOfficeCode = resourceAllocation.operatingOfficeCode;
    allocation.operatingOfficeAbbreviation = resourceAllocation.operatingOfficeAbbreviation;
    allocation.currentLevelGrade = resourceAllocation.currentLevelGrade;
    allocation.serviceLineCode = resourceAllocation.serviceLineCode;
    allocation.serviceLineName = resourceAllocation.serviceLineName;
    allocation.allocation = resourceAllocation.allocation;
    allocation.startDate = DateService.convertDateInBainFormat(projectData.startDate);
    allocation.endDate = DateService.convertDateInBainFormat(projectData.endDate);
    allocation.previousStartDate = DateService.convertDateInBainFormat(resourceAllocation.startDate);
    allocation.previousEndDate = DateService.convertDateInBainFormat(resourceAllocation.endDate);
    allocation.previousAllocation = resourceAllocation.allocation;
    allocation.investmentCode = resourceAllocation.investmentCode;
    allocation.caseRoleCode = resourceAllocation.caseRoleCode;
    allocation.caseStartDate = projectData.oldCaseCode ? projectData.startDate : null;
    allocation.caseEndDate = projectData.oldCaseCode ? projectData.endDate : null;
    allocation.opportunityStartDate = !projectData.oldCaseCode ? projectData.startDate : null;
    allocation.opportunityEndDate = !projectData.oldCaseCode ? projectData.endDate : null;
    allocation.lastUpdatedBy = null;

    return allocation;
  }
  public canSplitForMonthClose(existingAllocation, currentAllocationDecidingParamsForSplit) {
    const canSplit = existingAllocation.allocation !== currentAllocationDecidingParamsForSplit.allocation ||
      existingAllocation.investmentCode !== currentAllocationDecidingParamsForSplit.investmentCode ||
      existingAllocation.caseRoleCode !== currentAllocationDecidingParamsForSplit.caseRoleCode;
    if (!canSplit) {
      return [canSplit, null];
    }

    const [isEndDateInMonthClose, validationMessage] = this.isDateFallsInMonthClose(currentAllocationDecidingParamsForSplit.endDate);

    if (isEndDateInMonthClose) {
      return [false, validationMessage];
    }

    const [isStartDateInMonthClose, startDateValidationMessage] = this.isDateFallsInMonthClose(currentAllocationDecidingParamsForSplit.startDate);
    if (!isStartDateInMonthClose) {
      return [false, startDateValidationMessage]
    }

    return [canSplit, null];
  }

  splitAlloctionForMonthClose(existingAllocation: ResourceAllocation, updatedAllocation: ResourceAllocation): [ResourceAllocation[], string] {
    let allocations: ResourceAllocation[] = [];
    let monthCloseDate = this.getLastDateOfMonthCloseDateForAllocationUpdate();

    existingAllocation.startDate = DateService.convertDateInBainFormat(existingAllocation.startDate);
    existingAllocation.endDate = DateService.convertDateInBainFormat(monthCloseDate);
    allocations.push(existingAllocation);
    updatedAllocation.id = null;
    updatedAllocation.startDate = DateService.convertDateInBainFormat(monthCloseDate.setDate(monthCloseDate.getDate() + 1));
    updatedAllocation.endDate = DateService.convertDateInBainFormat(updatedAllocation.endDate);
    allocations.push(updatedAllocation);

    const successMessage = `Allocation splitted into 2 due to month close: ${existingAllocation.startDate} to ${existingAllocation.endDate} and ${updatedAllocation.startDate} to ${updatedAllocation.endDate}`;

    return [allocations, successMessage];

  }

  //TODO: remove this and start using the checkAndSplitAllocationsForPrePostRevenue that works for multiple allocations
  // checkAndSplitAllocationForPrePostRevenue(allocationData, projectStartDate, projectEndDate) {

  //   const allocationsData: ResourceAllocation[] = [];

  //   // All allocations before and after case dates will be pre-post. On case will be regular
  //   if ((moment(allocationData.startDate).isBefore(moment(projectStartDate)) &&
  //     moment(allocationData.endDate).isBefore(moment(projectStartDate)))
  //     || (moment(allocationData.startDate).isAfter(moment(projectEndDate)) &&
  //       moment(allocationData.endDate).isAfter(moment(projectEndDate)))) {

  //     allocationData.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
  //     allocationData.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;
  //     allocationsData.push(allocationData);

  //   } else if (moment(allocationData.startDate).isSameOrAfter(moment(projectStartDate)) &&
  //     moment(allocationData.endDate).isSameOrBefore((projectEndDate))) {

  //     if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
  //       allocationData.investmentCode = null;
  //       allocationData.investmentName = null;
  //     }

  //     allocationsData.push(allocationData);

  //   } else if (moment(allocationData.startDate).isBefore(moment(projectStartDate))
  //     && (moment(allocationData.endDate).isSameOrAfter(moment(projectStartDate)) &&
  //       moment(allocationData.endDate).isSameOrBefore(moment(projectEndDate)))) {

  //     const preAlloc = Object.assign({}, allocationData);
  //     const onProjectAlloc = Object.assign({}, allocationData);

  //     preAlloc.id = null;
  //     preAlloc.endDate = DateService.addDays(projectStartDate, -1);
  //     preAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
  //     preAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;

  //     onProjectAlloc.startDate = projectStartDate;
  //     if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
  //       onProjectAlloc.investmentCode = null;
  //       onProjectAlloc.investmentName = null;
  //     }

  //     allocationsData.push(preAlloc);
  //     allocationsData.push(onProjectAlloc);

  //   } else if ((moment(allocationData.startDate).isSameOrAfter(moment(projectStartDate)) &&
  //     moment(allocationData.startDate).isSameOrBefore(moment(projectEndDate))) &&
  //     moment(allocationData.endDate).isAfter(moment(projectEndDate))) {

  //     const onProjectAlloc = Object.assign({}, allocationData);
  //     const postAlloc = Object.assign({}, allocationData);

  //     onProjectAlloc.endDate = projectEndDate;
  //     if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
  //       onProjectAlloc.investmentCode = null;
  //       onProjectAlloc.investmentName = null;
  //     }

  //     postAlloc.id = null;
  //     postAlloc.startDate = DateService.addDays(projectEndDate, 1);
  //     postAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
  //     postAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;

  //     allocationsData.push(onProjectAlloc);
  //     allocationsData.push(postAlloc);

  //   } else {

  //     const preAlloc = Object.assign({}, allocationData);
  //     const onProjectAlloc = Object.assign({}, allocationData);
  //     const postAlloc = Object.assign({}, allocationData);

  //     preAlloc.id = null;
  //     preAlloc.endDate = DateService.addDays(projectStartDate, -1);
  //     preAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
  //     preAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;


  //     onProjectAlloc.startDate = projectStartDate;
  //     onProjectAlloc.endDate = projectEndDate;
  //     if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
  //       onProjectAlloc.investmentCode = null;
  //       onProjectAlloc.investmentName = null;
  //     }

  //     postAlloc.id = null;
  //     postAlloc.startDate = DateService.addDays(projectEndDate, 1);
  //     postAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
  //     postAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;

  //     allocationsData.push(preAlloc);
  //     allocationsData.push(onProjectAlloc);
  //     allocationsData.push(postAlloc);

  //   }

  //   return allocationsData;
  // }

  checkAndSplitAllocationsForPrePostRevenue(resourceAllocations: ResourceAllocation | ResourceAllocation[]): ResourceAllocation[] {
    const inputAllocationsData: ResourceAllocation[] = [].concat(resourceAllocations);

    const outputAllocationsData: ResourceAllocation[] = [];

    inputAllocationsData.forEach(allocationData => {
      const projectStartDate = DateService.convertDateInBainFormat(allocationData.oldCaseCode ? allocationData.caseStartDate : allocationData.opportunityStartDate);
      const projectEndDate = DateService.convertDateInBainFormat(allocationData.oldCaseCode ? allocationData.caseEndDate : allocationData.opportunityEndDate);

      if (projectStartDate && projectEndDate) {

        // All allocations before and after case dates will be pre-post. On case will be regular
        if (this.isAllocationNonOverlappingWithCaseOppDates(allocationData, projectStartDate, projectEndDate)) {

          allocationData.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
          allocationData.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;
          outputAllocationsData.push(allocationData);

        } else if (this.isAllocationFullyOverlappingWithCaseOppDates(allocationData, projectStartDate, projectEndDate)) {

          if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
            allocationData.investmentCode = null;
            allocationData.investmentName = null;
          }

          outputAllocationsData.push(allocationData);

        } else if (this.isAllocationEndDateFullyOverlappingWithCaseOppDates(allocationData, projectStartDate, projectEndDate)) {

          const preAlloc = Object.assign({}, allocationData);
          const onProjectAlloc = Object.assign({}, allocationData);

          preAlloc.id = null;
          preAlloc.endDate = DateService.addDays(projectStartDate, -1);
          preAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
          preAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;

          onProjectAlloc.startDate = projectStartDate;
          if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
            onProjectAlloc.investmentCode = null;
            onProjectAlloc.investmentName = null;
          }

          outputAllocationsData.push(preAlloc);
          outputAllocationsData.push(onProjectAlloc);

        } else if (this.isAllocationStartDateFullyOverlappingWithCaseOppDates(allocationData, projectStartDate, projectEndDate)) {

          const onProjectAlloc = Object.assign({}, allocationData);
          const postAlloc = Object.assign({}, allocationData);

          onProjectAlloc.endDate = projectEndDate;
          if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
            onProjectAlloc.investmentCode = null;
            onProjectAlloc.investmentName = null;
          }

          postAlloc.id = null;
          postAlloc.startDate = DateService.addDays(projectEndDate, 1);
          postAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
          postAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;

          outputAllocationsData.push(onProjectAlloc);
          outputAllocationsData.push(postAlloc);

        } else {

          const preAlloc = Object.assign({}, allocationData);
          const onProjectAlloc = Object.assign({}, allocationData);
          const postAlloc = Object.assign({}, allocationData);

          preAlloc.id = null;
          preAlloc.endDate = DateService.addDays(projectStartDate, -1);
          preAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
          preAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;


          onProjectAlloc.startDate = projectStartDate;
          onProjectAlloc.endDate = projectEndDate;
          if (allocationData.investmentCode === ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode) {
            onProjectAlloc.investmentCode = null;
            onProjectAlloc.investmentName = null;
          }

          postAlloc.id = null;
          postAlloc.startDate = DateService.addDays(projectEndDate, 1);
          postAlloc.investmentCode = ConstantsMaster.InvestmentCategory.PrePostRev.investmentCode;
          postAlloc.investmentName = ConstantsMaster.InvestmentCategory.PrePostRev.investmentName;

          outputAllocationsData.push(preAlloc);
          outputAllocationsData.push(onProjectAlloc);
          outputAllocationsData.push(postAlloc);

        }


      } else {
        outputAllocationsData.push(allocationData);
      }

    });

    return outputAllocationsData;
  }

  // This method is used to check whether a projects needs a back-fill or not. Returns true or false
  public isBackFillRequiredOnProject(allocatedResourcesOnProject: ResourceAllocation[], project: Project) {
    const today = new Date().toLocaleDateString('en-US');
    let isBackFill = false;
    if (project &&
      (project.type.toLowerCase() === 'opportunity' || project.caseType.toLowerCase() === 'billable')) {
      allocatedResourcesOnProject.forEach(resource => {
        if ((Date.parse(resource.endDate) >= Date.parse(today) &&
          Date.parse(resource.endDate) >= Date.parse(project.startDate) &&
          Date.parse(resource.endDate) < Date.parse(project.endDate))
          // don't allow backfill for a backfill resource
          && resource.investmentCode !== ConstantsMaster.InvestmentCategory.Backfill.investmentCode) {
          isBackFill = true;
        }
      });
    }

    return isBackFill;
  }

  public updateDateForSelectedAllocations(selectedAllocations, updatedDate, title): ResourceAllocation[] {
    const allocationsData: ResourceAllocation[] = [];

    selectedAllocations.forEach(allocData => {

      const resourceAllocation = Object.assign({}, allocData);

      switch (title.toLowerCase()) {
        case 'start': 
        resourceAllocation.previousStartDate = resourceAllocation.startDate;
        resourceAllocation.startDate = updatedDate; 
        break;
        case 'end': 
        resourceAllocation.previousEndDate = resourceAllocation.endDate;
        resourceAllocation.endDate = updatedDate; 
        break;
      }

      const allocation: number = isNaN(resourceAllocation.allocation)
        ? (resourceAllocation.allocation.indexOf('%') !== -1)
          ? Number(resourceAllocation.allocation.slice(0, resourceAllocation.allocation.indexOf('%')))
          : Number(resourceAllocation.allocation)
        : resourceAllocation.allocation;

      resourceAllocation.allocation = allocation;

      allocationsData.push(resourceAllocation);

    })
    return allocationsData;
  }

  public getAllocationDates(projectStartDate, projectEndDate) {
    const today = new Date().toLocaleDateString('en-US');
    const startDate = projectStartDate && ( Date.parse(projectStartDate) > Date.parse(today) || Date.parse(projectEndDate) < Date.parse(today))
      ? DateService.convertDateInBainFormat(projectStartDate)
      : DateService.convertDateInBainFormat(today);

    const proposedEndDate = new Date(startDate);
    const defaultAllocationStartDate = new Date(startDate);
    const defaultAllocationEndDate = new Date(projectEndDate);
    proposedEndDate.setDate(proposedEndDate.getDate() + 30);

    const opportunityEndDate = proposedEndDate.toLocaleDateString('en-US');
    const maxEndDate = DateService.getMaxEndDateForAllocation(defaultAllocationStartDate, defaultAllocationEndDate);
    const showMoreThanYearWarning = ValidationService.checkIfAllocationIsOfOneYear(defaultAllocationStartDate, defaultAllocationEndDate);

    const allocationEndDate = maxEndDate.toLocaleDateString('en-US');

    const endDate = projectEndDate === null
      ? DateService.convertDateInBainFormat(opportunityEndDate)
      : DateService.convertDateInBainFormat(allocationEndDate);

    return [startDate, endDate, showMoreThanYearWarning];

  }

  public getAllocationDatesForNotYetStartedEmployee(joiningDate, startDate, endDate) {
    if (this.isEmployeeJoiningDateBeforeComputedAllocationStartDate(joiningDate, startDate)) {
      return [startDate, endDate];
    }
    // Do not allow allocation of resource having joining date > Case/opp End Date
    if (this.isEmployeeJoiningDateGreaterThanComputedAllocationEndDate(endDate, joiningDate)) {
      this.notifyService.showValidationMsg(ValidationService.joiningDateGreaterThanEndDate);
      return [null, null];
    }

    // Not yet started employees should have allocation start Date =  joining Date
    if (!this.isEmployeeJoiningDateBeforeComputedAllocationStartDate(joiningDate, startDate)) {
      startDate = moment(joiningDate).isSameOrAfter(startDate, 'day')
        ? new Date(joiningDate).toLocaleDateString('en-US')
        : startDate;
    }

    return [startDate, endDate];

  }

  public getLastDateOfMonthCloseDateForAllocationUpdate() {

    const estDateTimeNow = DateService.getESTDateTimeNow();
    let lastDateOfMonthClose = new Date(estDateTimeNow);

    if (estDateTimeNow.getDate() < environment.settings.monthCloseDay) {
      //allocations locked before previous month. So before Mar 25th, Financials for before Feb 01 will be closed

      //NOTE:Need to set date to 1st of the month first, as setMonth(month -1) results in in-correct month when previous month doesn't have same or more number of days. Eg today = 31-May-2021. then setMonth(today -1) will result in May itself instead of April
      lastDateOfMonthClose = new Date(lastDateOfMonthClose.setDate(1)); //get first day of the month.
      lastDateOfMonthClose = new Date(lastDateOfMonthClose.setMonth(lastDateOfMonthClose.getMonth() - 1)); //get first day of the last month
      lastDateOfMonthClose = new Date(new Date(lastDateOfMonthClose.setDate(0)).setHours(0, 0, 0, 0)); // get the last day of last to last month i.e. till when financials are closed

    } else {
      //allocations locked before current month. So on or after Mar 25th, Financials for before Mar 01 will be closed
      lastDateOfMonthClose = new Date(lastDateOfMonthClose.setDate(1)); //get first day of the month
      lastDateOfMonthClose = new Date(new Date(lastDateOfMonthClose.setDate(0)).setHours(0, 0, 0, 0)); // get the last day of previous month i.e. till when financials are closed

    }

    return lastDateOfMonthClose;
  }

  isUserHasOverrideAccess() {
    return this.coreService.loggedInUser.override;
  }



  public isDateFallsInMonthClose(date: Date): [boolean, string] {

    //if user has override acces, then validations doesn't apply for them
    if (this.isUserHasOverrideAccess())
      return [false, ""];

    const lastDateOfMonthClose = this.getLastDateOfMonthCloseDateForAllocationUpdate();
    const closedMonthName = DateService.getMonthName(lastDateOfMonthClose.getMonth() + 1);
    const errorMessage = ValidationService.monthClosedForAllocationUpdates.replace("[monthName]", closedMonthName);
    let isDateFallsInMonthClose = false;

    if (moment(date).isSameOrBefore(moment(lastDateOfMonthClose))) {
      isDateFallsInMonthClose = true;
    }

    if (isDateFallsInMonthClose) {
      return [true, errorMessage];
    } else {
      return [false, ""];
    }

  }

  public validateMonthCloseForInsertAndDelete(allocationData: ResourceAllocation | ResourceAllocation[]): [boolean, string] {

    //if user has override acces, then validations doesn't apply for them
    if (this.isUserHasOverrideAccess())
      return [true, ""];

    const lastDateOfMonthClose = this.getLastDateOfMonthCloseDateForAllocationUpdate();
    const closedMonthName = DateService.getMonthName(lastDateOfMonthClose.getMonth() + 1);
    const errorMessage = ValidationService.monthClosedForAllocationUpdates.replace("[monthName]", closedMonthName);
    let isValidAllocation = true;

    const inputAllocationsData: ResourceAllocation[] = [].concat(allocationData);
    inputAllocationsData.every(alloc => {

      if (moment(alloc.startDate).isSameOrBefore(moment(lastDateOfMonthClose)) ||
        moment(alloc.endDate).isSameOrBefore(moment(lastDateOfMonthClose))) {
        isValidAllocation = false;
        return false;
      }

      return true;

    });

    if (isValidAllocation) {
      return [true, ""];
    } else {
      return [false, errorMessage];
    }

  }

  public validateMonthCloseForUpdates(updatedAllocationData: ResourceAllocation | ResourceAllocation[], existingAllocationData: ResourceAllocation | ResourceAllocation[]): [boolean, string] {
    //if user has override acces, then validations doesn't apply for them
    if (this.isUserHasOverrideAccess())
      return [true, ""];

    const lastDateOfMonthClose = this.getLastDateOfMonthCloseDateForAllocationUpdate();
    const lockedInDate = moment(lastDateOfMonthClose);
    const closedMonthName = DateService.getMonthName(lastDateOfMonthClose.getMonth() + 1);
    const errorMessage = ValidationService.monthClosedForAllocationUpdates.replace("[monthName]", closedMonthName);
    let isValidAllocation = true;

    const inputUpdatedAllocationsData: ResourceAllocation[] = [].concat(updatedAllocationData);
    const inputExistingAllocationsData: ResourceAllocation[] = [].concat(existingAllocationData);
    inputUpdatedAllocationsData.every(updatedAllocation => {
      const existingAllocation = inputExistingAllocationsData.find(x => x.id === updatedAllocation.id);

      const existingAllocStartDate = moment(existingAllocation.startDate).startOf('day');
      const existingAllocEndDate = moment(existingAllocation.endDate).startOf('day');
      const updatedAllocStartDate = moment(updatedAllocation.startDate).startOf('day');
      const updatedAllocEndDate = moment(updatedAllocation.endDate).startOf('day');

      if (existingAllocStartDate.isSameOrBefore(lockedInDate) || existingAllocEndDate.isSameOrBefore(lockedInDate)
        || updatedAllocStartDate.isSameOrBefore(lockedInDate) || updatedAllocEndDate.isSameOrBefore(lockedInDate)) {

        if (!existingAllocStartDate.isSame(updatedAllocStartDate)) {

          if (moment(existingAllocStartDate).isSameOrBefore(lockedInDate) ||
            moment(updatedAllocStartDate).isSameOrBefore(lockedInDate)) {
            isValidAllocation = false;
            return false;
          }

        }
        if (!existingAllocEndDate.isSame(updatedAllocEndDate)) {

          if (moment(existingAllocEndDate).isBefore(lockedInDate) ||
            moment(updatedAllocEndDate).isBefore(lockedInDate)) {
            isValidAllocation = false;
            return false;
          }

        }

        if (existingAllocation.allocation.toString() !== updatedAllocation.allocation.toString() ||
          existingAllocation.investmentCode?.toString() !== updatedAllocation.investmentCode?.toString() ||
          existingAllocation.caseRoleCode?.toString() !== updatedAllocation.caseRoleCode?.toString()) {

          isValidAllocation = false;
          return false;
        }
      }
      return true;
    });

    if (isValidAllocation) {
      return [true, ""];
    } else {
      return [false, errorMessage];
    }

  }

  //----------------PRIVATE Methods ---------------------------------------//
  private isEmployeeJoiningDateGreaterThanComputedAllocationEndDate(endDate: any, joiningDate: any) {
    return endDate && moment(joiningDate).isAfter(endDate, 'day');
  }

  private isEmployeeJoiningDateBeforeComputedAllocationStartDate(joiningDate: any, startDate: any) {
    return moment(joiningDate).isSameOrBefore(startDate, 'day');
  }

  private isAllocationNonOverlappingWithCaseOppDates(allocationData: ResourceAllocation, projectStartDate: string, projectEndDate: string): boolean {
    return (
      moment(allocationData.startDate).isBefore(moment(projectStartDate)) && moment(allocationData.endDate).isBefore(moment(projectStartDate)))
      || (moment(allocationData.startDate).isAfter(moment(projectEndDate)) && moment(allocationData.endDate).isAfter(moment(projectEndDate))
      );
  }

  private isAllocationFullyOverlappingWithCaseOppDates(allocationData: ResourceAllocation, projectStartDate: string, projectEndDate: string): boolean {
    return (
      moment(allocationData.startDate).isSameOrAfter(moment(projectStartDate)) &&
      moment(allocationData.endDate).isSameOrBefore((projectEndDate))
    );
  }

  private isAllocationStartDateFullyOverlappingWithCaseOppDates(allocationData: ResourceAllocation, projectStartDate: string, projectEndDate: string): boolean {
    return (
      (moment(allocationData.startDate).isSameOrAfter(moment(projectStartDate)) && moment(allocationData.startDate).isSameOrBefore(moment(projectEndDate)))
      && moment(allocationData.endDate).isAfter(moment(projectEndDate))
    );
  }

  private isAllocationEndDateFullyOverlappingWithCaseOppDates(allocationData: ResourceAllocation, projectStartDate: string, projectEndDate: string): boolean {
    return (
      moment(allocationData.startDate).isBefore(moment(projectStartDate))
      && (moment(allocationData.endDate).isSameOrAfter(moment(projectStartDate)) && moment(allocationData.endDate).isSameOrBefore(moment(projectEndDate)))
    );
  }

}
