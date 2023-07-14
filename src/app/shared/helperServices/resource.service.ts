
import { Resource } from '../interfaces/resource.interface';
import { CommitmentType } from '../interfaces/commitmentType.interface';
import { UserPreferences } from '../interfaces/userPreferences.interface';
import { StaffingTag, AvailabilityIncludes, CommitmentType as CommitmentTypeEnum } from '../constants/enumMaster';
import { DateService } from '../dateService';
import * as moment from 'moment';
import { ResourceCommitment } from 'src/app/shared/interfaces/resourceCommitment';
import { Training } from 'src/app/shared/interfaces/training';
import { Vacation } from 'src/app/shared/interfaces/vacation';
import { ResourceLoA } from 'src/app/shared/interfaces/resourceLoA';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { ResourceStaffing } from 'src/app/shared/interfaces/resourceStaffing.interface';
import { SupplyFilterCriteria } from '../interfaces/supplyFilterCriteria.interface';

export class ResourceService {
  private static commitmentTypeLookups: CommitmentType[];
  private static userPreferences: UserPreferences;

  public static createResourcesDataForStaffing(data: ResourceCommitment, searchStartDate: string, searchEndDate: string,
    supplyFilterCriteriaObj: SupplyFilterCriteria, commitmentTypes: CommitmentType[], userPreferences: UserPreferences, isTriggeredFromSearch = false) {

    this.commitmentTypeLookups = commitmentTypes;
    this.userPreferences = userPreferences;

    const staffingTagSelected = supplyFilterCriteriaObj.staffingTags
      ? supplyFilterCriteriaObj.staffingTags.split(',')
      : [];
    const availabilityIncludes = supplyFilterCriteriaObj.availabilityIncludes
      ? supplyFilterCriteriaObj.availabilityIncludes.split(',')
      : [];
    const resources: Resource[] = data.resources || [];

    const allCommitments = this.getCommitmentsForResources(data);

    resources.forEach(resource => {

      const resourceCommitments = {
        allocations: allCommitments.allocations.filter(x => x.employeeCode === resource.employeeCode),
        loas: allCommitments.loas.filter(x => x.employeeCode === resource.employeeCode),
        vacations: allCommitments.vacations.filter(x => x.employeeCode === resource.employeeCode),
        trainings: allCommitments.trainings.filter(x => x.employeeCode === resource.employeeCode),
        notAvailability: allCommitments.notAvailablities.filter(x => x.employeeCode === resource.employeeCode),
        downDay: allCommitments.downDays.filter(x => x.employeeCode === resource.employeeCode),
        shortTermAvailability: allCommitments.shortTermAvailabilities.filter(x => x.employeeCode === resource.employeeCode),
        limitedAvailability: allCommitments.limitedAvailabilities.filter(x => x.employeeCode === resource.employeeCode),
        ringFenceAllocations: allCommitments.ringFenceAllocations.filter(x => x.employeeCode === resource.employeeCode),
        transition: allCommitments.transitions.find(x => x.employeeCode === resource.employeeCode),
        transfer: allCommitments.transfers.find(x => x.employeeCode === resource.employeeCode),
        termination: allCommitments.terminations.find(x => x.employeeCode === resource.employeeCode),
        placeholderAllocations: allCommitments.placeholderAllocations.filter(x => x.employeeCode === resource.employeeCode),
        staffableAsRole: allCommitments.staffableAsRoles.find(x => x.employeeCode === resource.employeeCode)
      };

      resource = this.updateResourceModel(resource, searchStartDate);
      resource = this.setStaffableAsRole(resource, resourceCommitments.staffableAsRole);

      resource.upcomingCommitmentsForAlerts = this.addAlertsForActiveAndFutureCommitments(resourceCommitments, availabilityIncludes);

      resource = this.updateAvailabilityDataForResources(resource, searchStartDate, searchEndDate, resourceCommitments,
        staffingTagSelected, availabilityIncludes);

      resource = this.updateAvailabilityDateForTransfer(resource, resourceCommitments.transfer);
      resource = this.updateAvailabilityDateForTransition(resource, resourceCommitments.transition, isTriggeredFromSearch);
      resource = this.updateAvailabilityDateForTermination(resource, resourceCommitments.termination, isTriggeredFromSearch);

      resource = this.updateAvailabilityStatus(resource, resourceCommitments);

      resource.isSelected = false;
    });

    const availableResources = resources.filter(x => (x.percentAvailable > 0 && x.dateFirstAvailable) || isTriggeredFromSearch);

    return availableResources;
  }

  public static createResourcesDataForResourcesTab(data: ResourceStaffing[], searchStartDate, searchEndDate,
    supplyFilterCriteriaObj, commitmentTypes, userPreferences, isTriggeredFromSearch = false) {

    this.commitmentTypeLookups = commitmentTypes;
    this.userPreferences = userPreferences;

    const staffingTagSelected = supplyFilterCriteriaObj.staffingTags
      ? supplyFilterCriteriaObj.staffingTags.split(',')
      : [];
    const availabilityIncludes = supplyFilterCriteriaObj.availabilityIncludes
      ? supplyFilterCriteriaObj.availabilityIncludes.split(',')
      : [];

    data.forEach(resourceData => {

      const allCommitments = this.getCommitmentsForResources(resourceData);

      const resourceCommitments = {
        allocations: allCommitments.allocations,
        loas: allCommitments.loas,
        vacations: allCommitments.vacations,
        trainings: allCommitments.trainings,
        notAvailability: allCommitments.notAvailablities,
        downDay: allCommitments.downDays,
        shortTermAvailability: allCommitments.shortTermAvailabilities,
        limitedAvailability: allCommitments.limitedAvailabilities,
        ringFenceAllocations: allCommitments.ringFenceAllocations,
        transition: allCommitments.transitions ? allCommitments.transitions[0] : null, //TODO: see if this can be updated to use arrays instead of object
        transfer: allCommitments.transfers ? allCommitments.transfers[0] : null,
        termination: allCommitments.terminations ? allCommitments.terminations[0] : null,
        placeholderAllocations: allCommitments.placeholderAllocations,
        staffableAsRole: allCommitments.staffableAsRoles[0]
      };

      resourceData.resource = this.updateResourceModel(resourceData.resource, searchStartDate);
      resourceData.resource = this.setStaffableAsRole(resourceData.resource, resourceCommitments.staffableAsRole);

      //resource.upcomingCommitmentsForAlerts = this.addAlertsForActiveAndFutureCommitments(resourceCommitments, availabilityIncludes);

      resourceData.resource = this.updateAvailabilityDataForResources(resourceData.resource, searchStartDate, searchEndDate, resourceCommitments,
        staffingTagSelected, availabilityIncludes);

      resourceData.resource = this.updateAvailabilityDateForTransfer(resourceData.resource, resourceCommitments.transfer);
      resourceData.resource = this.updateAvailabilityDateForTransition(resourceData.resource, resourceCommitments.transition, isTriggeredFromSearch);
      resourceData.resource = this.updateAvailabilityDateForTermination(resourceData.resource, resourceCommitments.termination, isTriggeredFromSearch);

      resourceData.resource = this.updateAvailabilityStatus(resourceData.resource, resourceCommitments);

      //resource.isSelected = false;
    });

    //const availableResources = resources.filter(x => (x.percentAvailable > 0 && x.dateFirstAvailable) || x.isTerminated);
    return data;
  }

  private static getCommitmentsForResources(data: ResourceCommitment | ResourceStaffing) {
    const employeeAllocations = data.allocations || [];
    const employeeplaceholderAllocations = data.placeholderAllocations || [];
    let employeeLoAs = data.loAs || [];
    let employeeVacations = data.vacations || [];
    let employeeTrainings = data.trainings || [];
    const employeeTransitions = data.transitions || [];
    const employeeTransfers = data.transfers || [];
    const employeeTerminations = data.terminations || [];
    const staffableAsRoles = data.staffableAsRoles || [];
    const resourceViewNotes = data.resourceViewNotes || [];
    const employeeRingFenceAllocations = data.commitments?.filter(item =>
      item.commitmentTypeCode === StaffingTag.PEG
      || item.commitmentTypeCode === StaffingTag.PEG_Surge
      || item.commitmentTypeCode === StaffingTag.AAG
      || item.commitmentTypeCode === StaffingTag.ADAPT
      || item.commitmentTypeCode === StaffingTag.FRWD);
    const employeeShortTermAvailability = data.commitments?.filter(item =>
      item.commitmentTypeCode === CommitmentTypeEnum.SHORT_TERM_AVAILABLE);
    const employeeNotAvailable = data.commitments?.filter(item =>
      item.commitmentTypeCode === CommitmentTypeEnum.NOT_AVAILABLE);
    const downDay = data.commitments?.filter(item =>
      item.commitmentTypeCode === CommitmentTypeEnum.DOWN_DAY);
    const employeeLimitedAvailability = data.commitments?.filter(item =>
      item.commitmentTypeCode === CommitmentTypeEnum.LIMITED_AVAILABILITY);

    // append trainings, vacations & LOA created in BOSS to data from the source systems
    const employeeTrainingsSavedInStaffing = data.commitments?.filter(item =>
      item.commitmentTypeCode === CommitmentTypeEnum.TRAINING).map(x => {
        const trainingsSavedInStaffing: Training = {
          employeeCode: x.employeeCode,
          startDate: x.startDate,
          endDate: x.endDate,
          type: 'Training'
        };
        return trainingsSavedInStaffing;
      });

    const employeeVacationsSavedInStaffing = data.commitments?.filter(item =>
      item.commitmentTypeCode === CommitmentTypeEnum.VACATION).map(x => {
        const vacationsSavedInStaffing: Vacation = {
          employeeCode: x.employeeCode,
          startDate: x.startDate,
          endDate: x.endDate,
          description: x.description,
          type: 'Vacation'
        };
        return vacationsSavedInStaffing;
      });

    const employeeLoAsSavedInStaffing = data.commitments?.filter(item =>
      item.commitmentTypeCode === CommitmentTypeEnum.LOA).map(x => {
        const loasSavedInStaffing: ResourceLoA = {
          employeeCode: x.employeeCode,
          startDate: x.startDate,
          endDate: x.endDate,
          description: x.description,
          type: 'LOA'
        };
        return loasSavedInStaffing;
      });


    // TimeOffs saved in workday
    const employeeTimeOffs = data.timeOffs?.map(item => {
      const timeOffsSavedInWorkday: Vacation = {
        employeeCode: item.employeeCode,
        startDate: item.startDate,
        endDate: item.endDate,
        description: '',
        type: 'Vacation'
      };
      return timeOffsSavedInWorkday;
    });

    employeeTrainings = employeeTrainings.concat(employeeTrainingsSavedInStaffing);
    employeeVacations = employeeVacations.concat(employeeVacationsSavedInStaffing);
    employeeVacations = employeeVacations.concat(employeeTimeOffs);
    employeeLoAs = employeeLoAs.concat(employeeLoAsSavedInStaffing);

    if (employeeTrainings && employeeTrainings.length) {
      employeeTrainings = employeeTrainings.sort((previousElement, nextElement) => {
        return <any>new Date(previousElement.startDate) - <any>new Date(nextElement.startDate);
      });
    }

    if (employeeVacations && employeeVacations.length) {
      employeeVacations = employeeVacations.sort((previousElement, nextElement) => {
        return <any>new Date(previousElement.startDate) - <any>new Date(nextElement.startDate);
      });
    }

    if (employeeLoAs && employeeLoAs.length) {
      employeeLoAs = employeeLoAs.sort((previousElement, nextElement) => {
        return <any>new Date(previousElement.startDate) - <any>new Date(nextElement.startDate);
      });
    }

    return {
      allocations: employeeAllocations,
      placeholderAllocations: employeeplaceholderAllocations,
      loas: employeeLoAs,
      vacations: employeeVacations,
      trainings: employeeTrainings,
      transitions: employeeTransitions,
      transfers: employeeTransfers,
      terminations: employeeTerminations,
      ringFenceAllocations: employeeRingFenceAllocations,
      shortTermAvailabilities: employeeShortTermAvailability,
      notAvailablities: employeeNotAvailable,
      downDays: downDay,
      limitedAvailabilities: employeeLimitedAvailability,
      staffableAsRoles: staffableAsRoles,
      resourceViewNotes: resourceViewNotes
    };

  }

  private static getFirstAvailableDateAndAllocation(date, endDate, commitments, availPercent, staffingTagSelected, availabilityIncludes) {

    // If weekends are not counted as available day then get the first weekday of next week
    if (!availabilityIncludes.includes(AvailabilityIncludes.Weekends) && DateService.isWeekend(date)) {
      date = DateService.getDayInFuture(date, 1);
    }

    const dateWithoutTime = moment(date).startOf('day');

    if (endDate != null && dateWithoutTime.isAfter(endDate)) {
      return { dateFirstAvailable: null, percentAvailable: null };
    }

    const resourceFte = availPercent;

    availPercent = this.updateAvailabilityForTransition(commitments.transition, dateWithoutTime, availPercent, availabilityIncludes);

    if (availPercent > 0) {
      availPercent = this.updateAvailablityForLoAs(commitments.loas, dateWithoutTime, availPercent);
    }

    if (availPercent > 0) {
      availPercent = this.updateAvailablityForNotAvailability(commitments.notAvailability, dateWithoutTime, availPercent);
    }

    if (availPercent > 0) {
      availPercent = this.updateAvailablityForDownDay(commitments.downDay, dateWithoutTime, availPercent);
    }

    if (availPercent > 0 && staffingTagSelected.length > 0) {
      availPercent = this.updateAvailabilityForRingFence(commitments.ringFenceAllocations, dateWithoutTime,
        availPercent, staffingTagSelected);
    }

    if (availPercent > 0) {
      availPercent = this.updateAvailablityForAssignment(commitments.allocations, dateWithoutTime, availPercent, availabilityIncludes);
    }

    if (availPercent > 0) {
      availPercent = this.updateAvailablityForVacations(commitments.vacations, dateWithoutTime, availPercent);
    }

    if (availPercent > 0) {
      availPercent = this.updateAvailablityForTrainings(commitments.trainings, dateWithoutTime, availPercent);
    }

    if (availPercent > 0) {
      return { dateFirstAvailable: dateWithoutTime.format('YYYY-MM-DD'), percentAvailable: availPercent };
    }

    const nextDate = dateWithoutTime.add(1, 'days');

    return this.getFirstAvailableDateAndAllocation(nextDate, endDate, commitments, resourceFte, staffingTagSelected, availabilityIncludes);

  }

  private static updateAvailabilityStatus(resource, commitments) {
    // Update availabilityStatus property. Shows in STA if transition has not started. If transition started then show in transition bucket
    if (commitments.transition && moment(resource.dateFirstAvailable).isSameOrAfter(moment(commitments.transition.startDate), 'day')) {
      resource.availabilityStatus = ConstantsMaster.availabilityBuckets.Transition;
    } else if (commitments.limitedAvailability.length > 0) {
      resource.availabilityStatus = ConstantsMaster.availabilityBuckets.LimitedAvailable;
    } else if (commitments.shortTermAvailability.length > 0) {
      resource.availabilityStatus = ConstantsMaster.availabilityBuckets.ShortTermAvailable;
    } else if (moment(resource.startDate).isSameOrAfter(moment(), 'day')) {
      resource.availabilityStatus = ConstantsMaster.availabilityBuckets.NotYetStarted;
      resource.activeStatus = ConstantsMaster.ResourceActiveStatus.NotYetStarted;
    } else if (this.isResourceOnPlanningCardOrPlaceholder(resource.dateFirstAvailable, commitments.placeholderAllocations)) {
      resource.availabilityStatus = ConstantsMaster.availabilityBuckets.PlaceholderAndPlanningCard;
    } else {
      resource.availabilityStatus = ConstantsMaster.availabilityBuckets.Available;
    }
    return resource;
  }

  private static updateResourceModel(resource, searchStartDate) {
    resource.dateFirstAvailable = searchStartDate == null ? DateService.getFormattedDate(new Date()) : searchStartDate;
    resource.percentAvailable = resource.fte * 100;


    return resource;
  }

  private static setStaffableAsRole(resource, staffableAsRole) {
    if (staffableAsRole) {
      resource.staffableAsTypeName = staffableAsRole.staffableAsTypeName;
    }
    return resource;
  }

  private static isResourceOnPlanningCardOrPlaceholder(dateFirstAvailable, placeholderAllocations) {
    if (placeholderAllocations.length > 0) {
      return placeholderAllocations.some(allocation => {
        return (!allocation.startDate || moment(allocation.startDate).isSameOrBefore(moment(dateFirstAvailable)))
          && (!allocation.endDate || moment(allocation.endDate).isSameOrAfter(moment(dateFirstAvailable)))
      });
    }
    return false;
  }

  private static updateAvailabilityDataForResources(resource, searchStartDate, searchEndDate, resourceCommitments,
    staffingTagSelected, availabilityIncludes) {
    searchStartDate = moment(resource.startDate).isAfter(searchStartDate ?? moment(), 'day')
      ? resource.startDate : searchStartDate;
    let startDate = searchStartDate == null ? moment() : moment(searchStartDate);
    const endDate = searchEndDate == null ? searchEndDate : moment(searchEndDate);

    // For transfer in incoming office, min avail date would be transfer effective date
    if (resourceCommitments.transfer
      && resource.schedulingOffice.officeCode === resourceCommitments.transfer.operatingOfficeProposed.officeCode
      && moment(resourceCommitments.transfer.startDate).startOf('day').isSameOrAfter(resource.dateFirstAvailable)) {
      startDate = moment(resourceCommitments.transfer.startDate);
    }

    if (resource.isTerminated) {
      return resource;
    }

    const availabilityData = this.getFirstAvailableDateAndAllocation(startDate, endDate, resourceCommitments,
      resource.percentAvailable, staffingTagSelected, availabilityIncludes);

    resource.dateFirstAvailable = availabilityData.dateFirstAvailable;
    resource.percentAvailable = availabilityData.percentAvailable;

    return resource;
  }

  private static updateAvailabilityDateForTransfer(resource, transfer) {
    // 2 rows are created for transferred resources on supply panel.
    // Update availability based on office in which resource would be on the date of "date first available"

    // row with scheduling Office = office in which transferred resource currently is.Will not show in this office after transfer date
    if (transfer && resource.schedulingOffice.officeCode === transfer.operatingOfficeCurrent.officeCode
      && moment(resource.dateFirstAvailable).isSameOrAfter(moment(transfer.startDate).startOf('day'))) {

      resource.dateFirstAvailable = null;
      resource.percentAvailable = null;
    }

    return resource;

  }

  public static updateAvailabilityDateForTransition(resource, transition, isTriggeredFromSearch) {
    /*if resource is on transition and their availability date is after their transition end date then,
      1) do no show in supply panel
      2) only show them when searching for them with N/A as availability date and percent
    */
    if (transition && moment(resource.dateFirstAvailable).isAfter(moment(transition.endDate))) {

      if (isTriggeredFromSearch) {
        resource.onTransitionOrTerminationAndNotAvailable = true;
      } else {
        resource.dateFirstAvailable = null;
        resource.percentAvailable = null;
      }

    }

    return resource;
  }

  public static updateAvailabilityDateForTermination(resource, termination, isTriggeredFromSearch) {
    /*if resource's availability date is on or after their termination date then,
      1) do not show in supply panel
      2) only show them when searching for them with N/A as availability date and percent
    */
    if (termination && moment(resource.dateFirstAvailable).isSameOrAfter(moment(termination.endDate))) {

      if (isTriggeredFromSearch) {
        resource.onTransitionOrTerminationAndNotAvailable = true;
      }

      resource.dateFirstAvailable = null;
      resource.percentAvailable = null;
    }
    else if(resource.isTerminated){
      resource.dateFirstAvailable = null;
      resource.percentAvailable = null;
    }

    return resource;
  }


  private static addAlertsForActiveAndFutureCommitments(commitments, availabilityIncludes) {
    const upcomingCommitmentsForAlerts = [];

    if (commitments.transfer && moment(commitments.transfer.startDate).startOf('day').isAfter(moment().format('LL'))) {
      this.addAlertForTransfer(commitments.transfer, upcomingCommitmentsForAlerts);
    }
    if (availabilityIncludes.includes(AvailabilityIncludes.CD) && commitments.allocations) {
      const cdAllocations = commitments.allocations.filter(x => x.caseTypeCode === parseInt(AvailabilityIncludes.CD));
      if (cdAllocations.length > 0) {
        this.addAlertForCD(cdAllocations, upcomingCommitmentsForAlerts);
      }
    }
    if (commitments.loas.length > 0) {
      this.addAlertForLoA(commitments.loas, upcomingCommitmentsForAlerts);
    }
    if (commitments.vacations.length > 0) {
      this.addAlertForVacations(commitments.vacations, upcomingCommitmentsForAlerts);
    }
    if (commitments.trainings.length > 0) {
      this.addAlertForTrainings(commitments.trainings, upcomingCommitmentsForAlerts);
    }
    if (commitments.ringFenceAllocations.length > 0) {
      this.addAlertForRingFenceAllocations(commitments.ringFenceAllocations, upcomingCommitmentsForAlerts);
    }
    if (commitments.notAvailability.length > 0) {
      this.addAlertForNotAvailability(commitments.notAvailability, upcomingCommitmentsForAlerts);
    }
    if (commitments.downDay.length > 0) {
      this.addAlertForDownDay(commitments.downDay, upcomingCommitmentsForAlerts);
    }
    if (commitments.shortTermAvailability.length > 0) {
      this.addAlertForShortTermAvailability(commitments.shortTermAvailability, upcomingCommitmentsForAlerts);
    }
    if (commitments.limitedAvailability.length > 0) {
      this.addAlertForLimitedAvailability(commitments.limitedAvailability, upcomingCommitmentsForAlerts);
    }
    if (commitments.transition && moment(commitments.transition.endDate).startOf('day').isAfter(moment().format('LL'))) {
      this.addAlertForTransition(commitments.transition, upcomingCommitmentsForAlerts);
    } else if (commitments.termination && moment(commitments.termination.endDate).startOf('day').isSameOrAfter(moment().format('LL'))) {
      this.addAlertForTermination(commitments.termination, upcomingCommitmentsForAlerts);
    }
    if (commitments.staffableAsRole) {
      this.addAlertForStaffableAsRole(commitments.staffableAsRole, upcomingCommitmentsForAlerts);
    }

    return upcomingCommitmentsForAlerts;
  }

  private static addAlertForStaffableAsRole(staffableAsRole, upcomingCommitmentsForAlerts) {
    upcomingCommitmentsForAlerts.push(`Staffable as: ${staffableAsRole.staffableAsTypeName}`);
  }

  private static addAlertForTransfer(transfer, upcomingCommitmentsForAlerts) {

    if (this.isFutureCommitment(transfer.startDate)) {
      const dateDiff = moment(transfer.startDate).diff(moment(), 'days') + 1;

      upcomingCommitmentsForAlerts.push(
        this.getAlertMessageForFutureCommitment(`Transfer from ${transfer.operatingOfficeCurrent.officeName} to
            ${transfer.operatingOfficeProposed.officeName} effective from`, transfer.startDate, null, dateDiff)
      );
    }

  }

  private static addAlertForCD(cdAllocations, upcomingCommitmentsForAlerts) {
    cdAllocations.every(allocation => {

      if (this.isFutureCommitment(allocation.startDate)) {
        const dateDiff = moment(allocation.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('CD case from', allocation.startDate, allocation.endDate, dateDiff)
        );
      } else {
        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForActiveCommitment('CD case from', allocation.startDate, allocation.endDate)
        );
      }

      return true;

    });
  }

  private static addAlertForLoA(loas, upcomingCommitmentsForAlerts) {
    loas.every(loa => {

      // people on ACTIVE LOA are not shown on supply so no need for message for Active LOA
      if (this.isFutureCommitment(loa.startDate)) {
        const dateDiff = moment(loa.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('LOA', loa.startDate, loa.endDate, dateDiff)
        );
      }

      return true;
    });
  }

  private static addAlertForVacations(vacations, upcomingCommitmentsForAlerts) {
    vacations.every(vacation => {

      if (this.isFutureCommitment(vacation.startDate)) {
        const dateDiff = moment(vacation.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('Vacation from', vacation.startDate, vacation.endDate, dateDiff)
        );
      } else {
        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForActiveCommitment('Vacation from', vacation.startDate, vacation.endDate)
        );
      }

      return true;

    });
  }

  private static addAlertForTrainings(trainings, upcomingCommitmentsForAlerts) {
    trainings.every(training => {

      if (this.isFutureCommitment(training.startDate)) {
        const dateDiff = moment(training.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('Training from', training.startDate, training.endDate, dateDiff)
        );
      } else {
        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForActiveCommitment('Training from', training.startDate, training.endDate)
        );
      }

      return true;
    });
  }

  private static addAlertForRingFenceAllocations(ringFenceAllocations, upcomingCommitmentsForAlerts) {
    ringFenceAllocations.every(allocation => {
      const commitmentName = this.commitmentTypeLookups.find(x => x.commitmentTypeCode === allocation.commitmentTypeCode).commitmentTypeName;

      if (this.isFutureCommitment(allocation.startDate)) {
        const dateDiff = moment(allocation.startDate).diff(moment(), 'days') + 1;
        let messagePrefix = `Commitment (${commitmentName}) from`;
        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment(messagePrefix, allocation.startDate, allocation.endDate, dateDiff)
        );
        return true;
      } else if (!this.isActivePEGCommitment(commitmentName, allocation.startDate, allocation.endDate)) {
        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForActiveCommitment(`Commitment (${commitmentName}) from`, allocation.startDate, allocation.endDate)
        );
        return true;
      }

      return true;

    });
  }

  private static addAlertForNotAvailability(notAvailabilities, upcomingCommitmentsForAlerts) {
    notAvailabilities.every(nonAvailability => {

      // people who are NOT AVAILABLE today are not shown on supply so no need for message for Active check
      if (this.isFutureCommitment(nonAvailability.startDate)) {
        const dateDiff = moment(nonAvailability.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('Not Available from', nonAvailability.startDate, nonAvailability.endDate, dateDiff)
        );
      }

      return true;
    });

  }

  private static addAlertForDownDay(downDays, upcomingCommitmentsForAlerts) {
    downDays.every(downDay => {

      // people who are on PEG Down Day today are not shown on supply so no need for message for Active check
      if (this.isFutureCommitment(downDay.startDate)) {
        const dateDiff = moment(downDay.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('Down Day', downDay.startDate, downDay.endDate, dateDiff)
        );
      }

      return true;
    });

  }

  private static addAlertForShortTermAvailability(shortTermAvailabilities, upcomingCommitmentsForAlerts) {

    shortTermAvailabilities.every(shortTermAvailability => {

      if (this.isFutureCommitment(shortTermAvailability.startDate)) {
        const dateDiff = moment(shortTermAvailability.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('Short Term Available from', shortTermAvailability.startDate, shortTermAvailability.endDate, dateDiff)
        );
      } else {
        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForActiveCommitment('Short Term Available from', shortTermAvailability.startDate, shortTermAvailability.endDate)
        );
      }

      return true;

    });
  }

  private static addAlertForLimitedAvailability(limitedAvailabilities, upcomingCommitmentsForAlerts) {
    limitedAvailabilities.every(limitedAvailability => {

      if (this.isFutureCommitment(limitedAvailability.startDate)) {
        const dateDiff = moment(limitedAvailability.startDate).diff(moment(), 'days') + 1;

        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForFutureCommitment('Limited Availability from', limitedAvailability.startDate, limitedAvailability.endDate, dateDiff)
        );
      } else {
        upcomingCommitmentsForAlerts.push(
          this.getAlertMessageForActiveCommitment('Limited Availability from', limitedAvailability.startDate, limitedAvailability.endDate)
        );
      }

      return true;

    });
  }

  private static addAlertForTransition(transition, upcomingCommitmentsForAlerts) {

    if (this.isFutureCommitment(transition.startDate)) {
      const dateDiff = moment(transition.startDate).diff(moment(), 'days') + 1;

      upcomingCommitmentsForAlerts.push(
        this.getAlertMessageForFutureCommitment('Transition from', transition.startDate, transition.endDate, dateDiff)
      );
    } else {
      upcomingCommitmentsForAlerts.push(
        this.getAlertMessageForActiveCommitment('Transition from', transition.startDate, transition.endDate)
      );
    }

    return true;
  }

  private static addAlertForTermination(termination, upcomingCommitmentsForAlerts) {
    // Termination don't have start date, so checking on end date
    if (this.isFutureCommitment(termination.endDate)) {
      const dateDiff = moment(termination.endDate).diff(moment(), 'days') + 1;

      upcomingCommitmentsForAlerts.push(
        this.getAlertMessageForFutureCommitment('Termination effective from', termination.endDate, null, dateDiff)
      );
    }

  }

  private static updateAvailabilityForTransition(transition, date, availPercent, availabilityIncludes) {
    if (transition && date.isSameOrAfter(moment(transition.startDate), 'day') &&
      date.isSameOrBefore(moment(transition.endDate), 'day') && !availabilityIncludes.includes(AvailabilityIncludes.Transition)) {
      availPercent = 0;
    }

    return availPercent;

  }

  private static updateAvailablityForLoAs(loas, date, availPercent) {
    loas.forEach(loa => {
      if (date.isSameOrAfter(moment(loa.startDate), 'day') && date.isSameOrBefore(moment(loa.endDate), 'day')) {
        availPercent = 0;
      }
    });

    return availPercent;
  }

  private static updateAvailablityForVacations(vacations, date, availPercent) {
    vacations.forEach(vacation => {
      const startDate = moment(vacation.startDate).startOf('day');
      const endDate = moment(vacation.endDate).startOf('day');
      if (date.isSameOrAfter(startDate) &&
        date.isSameOrBefore(endDate) && endDate.diff(startDate, 'days') >= this.userPreferences.vacationThreshold) {
        availPercent = 0;
      }
    });

    return availPercent;
  }

  private static updateAvailablityForTrainings(trainings, date, availPercent) {
    trainings.forEach(training => {
      const startDate = moment(training.startDate).startOf('day');
      const endDate = moment(training.endDate).startOf('day');
      if (date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)
        && endDate.diff(startDate, 'days') >= this.userPreferences.trainingThreshold) {
        availPercent = 0;
      }
    });

    return availPercent;
  }

  private static updateAvailablityForNotAvailability(notAvailabilities, date, availPercent) {
    notAvailabilities.forEach(notAvailability => {
      if (date.isSameOrAfter(moment(notAvailability.startDate), 'day') &&
        date.isSameOrBefore(moment(notAvailability.endDate), 'day')) {
        availPercent = 0;
      }
    });

    return availPercent;
  }

  private static updateAvailablityForDownDay(downDays, date, availPercent) {
    downDays.forEach(downDay => {
      if (date.isSameOrAfter(moment(downDay.startDate), 'day') &&
        date.isSameOrBefore(moment(downDay.endDate), 'day')) {
        availPercent = 0;
      }
    });

    return availPercent;
  }

  private static updateAvailablityForAssignment(assignments, date, availPercent, availabilityIncludes) {
    assignments.forEach(assignment => {

      if ((assignment.oldCaseCode && availabilityIncludes.includes(assignment.caseTypeCode?.toString()))
        || (!assignment.oldCaseCode && availabilityIncludes.includes(AvailabilityIncludes.Opportunity))
      ) {
        availPercent = availPercent;
      } else if (date.isSameOrAfter(moment(assignment.startDate).startOf('day')) && date.isSameOrBefore(moment(assignment.endDate).startOf('day'))) {
        availPercent = availPercent - assignment.allocation;
      }

    });
    return availPercent;
  }

  private static updateAvailabilityForRingFence(ringFenceAllocations, date, availPercent, staffingTagSelected) {
    if (!ringFenceAllocations.some(r => staffingTagSelected.includes(r.commitmentTypeCode))) {
      ringFenceAllocations.forEach(ringFenceAllocation => {
        if (date.isSameOrAfter(moment(ringFenceAllocation.startDate), 'day') &&
          date.isSameOrBefore(moment(ringFenceAllocation.endDate), 'day')) {
          availPercent = 0;
        }
      });
    }
    return availPercent;

  }

  private static isActiveCommitment(commitmentStartDate, commitmentEndDate) {
    return (moment(commitmentStartDate).startOf('day').isSameOrBefore(moment().format('LL'))
      && moment(commitmentEndDate).startOf('day').isSameOrAfter(moment().format('LL')));
  }

  private static isFutureCommitment(commitmentStartDate) {
    return moment(commitmentStartDate).startOf('day').isAfter(moment().format('LL'));
  }

  private static isActivePEGCommitment(commitmentName: string, commitmentStartDate, commitmentEndDate): boolean {

    return (commitmentName.toUpperCase().includes('PEG') &&
      this.isActiveCommitment(commitmentStartDate, commitmentEndDate));
  }

  private static getAlertMessageForActiveCommitment(messagePrefix, commitmentStartDate, commitmentEndDate) {
    return (`${messagePrefix} ${moment(commitmentStartDate).format('DD-MMM-YYYY')} till ${moment(commitmentEndDate)
      .format('DD-MMM-YYYY')}`);
  }

  private static getAlertMessageForFutureCommitment(messagePrefix, commitmentStartDate, commitmentEndDate, dateDiff) {

    if (commitmentEndDate) {
      return (`${messagePrefix} ${moment(commitmentStartDate).format('DD-MMM-YYYY')} till ${moment(commitmentEndDate)
        .format('DD-MMM-YYYY')} in ${dateDiff} day(s)`);
    } else {
      return (`${messagePrefix} ${moment(commitmentStartDate).format('DD-MMM-YYYY')} in ${dateDiff} day(s)`);
    }


  }

  /*Returns an array with distinct items based on column name*/
  public static getDistinctFromArray(array, col) {
    const flags = {};
    const result = array.filter(function (item) {
      const colValue = item[col];
      if (flags[colValue]) {
        return false;
      }
      flags[colValue] = true;
      return true;
    });

    return result;

  }

}
