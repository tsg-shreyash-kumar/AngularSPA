import { Component, ViewChild } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { forkJoin } from "rxjs/internal/observable/forkJoin";
import { OverlayService } from "src/app/overlay/overlay.service";
import { CommitmentsService } from "../commitments.service";
import { CommitmentType } from "../constants/enumMaster";
import { DateService } from "../dateService";
import { HtmlGridComponent } from "../html-table-grid/html-table-grid.component";
import { ResourceCommitment } from "../interfaces/resourceCommitment";
import { PopupDragService } from "../services/popupDrag.service";
import { ConstantsMaster } from "../constants/constantsMaster";


@Component({
  selector: 'app-resources-commitments',
  templateUrl: './resources-commitments.component.html',
  styleUrls: ['./resources-commitments.component.scss']
})
export class ResourcesCommitmentsComponent {

  @ViewChild('htmlTableGridRef', {static: false}) htmlTableGridRef: HtmlGridComponent;
  employees: any;
  upcomingCommitments = [];
  recentCommitments = [];
  employeesWithLanguages = [];
  employeesTimeInLevel = [];
  combinedResourcesCommitmentsData = [];
  modalHeaderText: string;
  isDataLoading = true;
  dataToExport = [
    { text: 'Time In Levels', value: 'employeeTimeInLevel', label: 'Time In level' },
    { text: 'Upcoming Commitments', value: 'upcomingCommitments', label: 'Commitment (Next 12 Weeks)' },
    { text: 'Recent Commitments', value: 'recentCommitments', label: 'Commitment (Past 30 Days)' },
    { text: 'Languages', value: 'employeeLanguages', label: 'Language' }];

  htmlTableDef = [
    {
      columnHeaderText: 'Resource',
      columnMappingValue: 'employeeName',
      isVisible: true
    },
    {
      columnHeaderText: 'Level Grade',
      columnMappingValue: 'levelGrade',
      isVisible: true
    },
    {
      columnHeaderText: 'Time In Level',
      columnMappingValue: 'employeeTimeInLevel',
      toolTipText: ConstantsMaster.TimeInLevelDefination,
      isVisible: true
    },
    {
      columnHeaderText: 'Commitment (Next 12 Weeks)',
      columnMappingValue: 'upcomingCommitments',
      isVisible: true
    },
    {
      columnHeaderText: 'Commitment (Past 30 Days)',
      columnMappingValue: 'recentCommitments',
      isVisible: true
    },
    {
      columnHeaderText: 'Language',
      columnMappingValue: 'employeeLanguages',
      isVisible: true
    },
    {
      columnHeaderText: 'Notes',
      columnMappingValue: 'notes',
      isVisible: false
    }
  ];

  constructor(public bsModalRef: BsModalRef,
    private commitmentService: CommitmentsService,
    private _popupDragService: PopupDragService,
    private overlayService: OverlayService) { }

  ngOnInit(): void {
    this.modalHeaderText = 'Resources Data';
    this._popupDragService.dragEvents();
    this.fetchResourcesData()
  }

  sendMail() {
    let tableRef = this.htmlTableGridRef.tableRef.nativeElement;
    this.includeInvisibleColumnInExport(tableRef);
    window.getSelection().selectAllChildren(tableRef);
    document.execCommand('copy');
    let emailSubject = 'Available Resources Data as of ' + DateService.convertDateInBainFormat(new Date());
    let emailBody = encodeURIComponent('NOTE: Press Ctrl+V to paste the copied data.')
    let emailString = 'mailto:?subject=' + emailSubject + '&body=' + emailBody;
    window.location.href = emailString;
    this.closeDialogHandler();
  }

  includeInvisibleColumnInExport(table) {
    for (let i = 0; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        if (table.rows[i].cells[j].classList.value.indexOf('export-to-mail') > 0) {
          table.rows[i].cells[j].classList.remove('hide-column');
        }
      }
    }
  }

  onExportCheckboxChange(option) {
    this.htmlTableDef.forEach(item => {
      if (item.columnHeaderText === option.srcElement.label) {
        item.isVisible = option.target.checked;
      }
      if (item.columnMappingValue === option.srcElement.value) {
        item.isVisible = option.target.checked;
      }
    });
  }

  private fetchResourcesData() {
    const employeeCodes = this.getEmployeeCodesString();

    const startDateForUpcomingCommitments = DateService.getBainFormattedToday();
    const endDateForUpcomingCommitments = DateService.addWeeks(startDateForUpcomingCommitments, 12);
    const startDateForRecentCommitments = DateService.addDays(startDateForUpcomingCommitments, -30);
    const endDateForRecentCommitments = startDateForUpcomingCommitments;

    forkJoin([
      this.commitmentService.getResourcesCommitmentsWithinDateRangeByCommitmentTypes(
        employeeCodes, startDateForRecentCommitments, endDateForRecentCommitments, 'allocation'),
      this.commitmentService.getResourcesCommitmentsWithinDateRangeByCommitmentTypes(
        employeeCodes, startDateForUpcomingCommitments, endDateForUpcomingCommitments),
      this.overlayService.getEmployeeLanguagesByEmployeeCodes(employeeCodes),
      this.overlayService.getEmployeeTimeInLevelByEmployeeCodes(employeeCodes)
    ]).subscribe(data => {
      this.deriveFetchedResourcesData(data);
    });
  }

  private deriveFetchedResourcesData(data) {
    this.getRecentResourcesCommitments(data[0]);
    this.getUpcomingResourcesCommitments(data[1]);
    this.getEmployeesLanguages(data[2]);
    this.getEmployeesTimeInLevel(data[3]);
    this.getCombinedData();
  }

  getCombinedData() {
    this.employees.forEach(employee => {
      let employeeRecentCommitments = this.recentCommitments.find(rc => rc.employeeCode === employee.employeeCode).commitments;
      let employeeUpcomingCommitments = this.upcomingCommitments.find(c => c.employeeCode === employee.employeeCode).commitments;
      let employeeLanguages = this.employeesWithLanguages.find(el => el.employeeCode === employee.employeeCode).employeeLanguages;
      let employeeTimeInLevel = this.employeesTimeInLevel.find(el => el.employeeCode === employee.employeeCode);

      this.combinedResourcesCommitmentsData.push({
        employeeName: employee.employeeName,
        levelGrade: employee.levelGrade,
        upcomingCommitments: employeeUpcomingCommitments,
        recentCommitments: employeeRecentCommitments,
        employeeLanguages: employeeLanguages,
        employeeTimeInLevel: employeeTimeInLevel?.timeInLevel.toFixed(2).toString(),
        notes: ''
      });
    });
    this.isDataLoading = false;
  }

  getEmployeesLanguages(employeesLanguages) {
    this.employees.forEach(employee => {
      const employeeLanguage = this.deriveResourcesLanagues(employee, employeesLanguages)
      if (employeeLanguage !== null) {
        this.employeesWithLanguages.push(employeeLanguage);
      }
    });
  }

  getEmployeesTimeInLevel(employeesTimeInLevel) {
    this.employeesTimeInLevel = employeesTimeInLevel;
  }

  deriveResourcesLanagues(employee, employeesLangauages) {
    const employeeLangauge = employeesLangauages.find(employeeLangauge => { return employeeLangauge.employeeCode === employee.employeeCode; });
    const languages = employeeLangauge?.languages?.map(language => {
      return language.name + ' - ' + language.proficiencyName;
    });
    return {
      employeeCode: employee.employeeCode,
      employeeName: employee.employeeName,
      employeeLanguages: languages
    };
  }

  getRecentResourcesCommitments(recentCommitments) {
    this.employees.forEach(employee => {
      const resourceCommitments = this.deriveResourceCommitments(employee, recentCommitments);
      if (resourceCommitments !== null) {
        this.recentCommitments.push(resourceCommitments);
      }
    });
  }

  getUpcomingResourcesCommitments(upcomingCommitments) {
    this.employees.forEach(employee => {
      const resourceCommitments = this.deriveResourceCommitments(employee, upcomingCommitments);
      if (resourceCommitments !== null) {
        this.upcomingCommitments.push(resourceCommitments);
      }
    });
  }

  closeDialogHandler() {
    this.bsModalRef.hide();
  }

  private getEmployeeCodesString() {
    // NOTE: This is done as a resource can have mutiple active allocations in a case
    if (this.employees) {
      this.employees = this.employees.filter(
        (employee, index, employeeArrayCopy) => employeeArrayCopy
          .findIndex(employeeCopy => employeeCopy.employeeCode === employee.employeeCode) === index
      );
    }
    return this.employees?.map(x => x.employeeCode).toString();
  }

  private deriveResourceCommitments(employee, resourcesCommitments: ResourceCommitment) {
    let commitments = [];
    commitments = commitments.concat(this.getResourcesAssignmentsOnCase(employee, resourcesCommitments));
    commitments = commitments.concat(this.getResourcesLoAs(employee, resourcesCommitments));
    commitments = commitments.concat(this.getResourcesVacations(employee, resourcesCommitments));
    commitments = commitments.concat(this.getResourcesTrainings(employee, resourcesCommitments));
    commitments = commitments.concat(this.getResourcesRecruitments(employee, resourcesCommitments));
    commitments = commitments.concat(this.getResourcesShortTermAvailability(employee, resourcesCommitments));
    commitments = commitments.concat(this.getResourcesLimitedAvailability(employee, resourcesCommitments));
    commitments = commitments.concat(this.getResourcesNotAvailability(employee, resourcesCommitments));

    return {
      employeeCode: employee.employeeCode,
      employeeName: employee.employeeName,
      levelGrade: employee.levelGrade,
      commitments: commitments,
      notes: '',
    };

  }

  private getResourcesLoAs(employee, resourcesCommitments) {
    let loAs = resourcesCommitments.loAs?.filter(x => x.employeeCode === employee.employeeCode)?.map(x => {
      return {
        type: x.type,
        startDate: DateService.convertDateInBainFormat(x.startDate),
        endDate: DateService.convertDateInBainFormat(x.endDate)
      };
    });

    const loASavedInBoss = resourcesCommitments.commitments
      ?.filter(x => x.employeeCode === employee.employeeCode && x.commitmentTypeCode === CommitmentType.LOA)
      ?.map(x => {
        return {
          type: 'LOA',
          startDate: DateService.convertDateInBainFormat(x.startDate),
          endDate: DateService.convertDateInBainFormat(x.endDate)
        };
      });

    loAs = loAs.concat(loASavedInBoss);
    loAs = loAs.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    loAs.forEach(loa => {
      mergedColumnValues.push(loa.type + ': ' + loa.startDate + ' - ' + loa.endDate);
    });
    return mergedColumnValues;
  }


  private getResourcesVacations(employee, resourcesCommitments: ResourceCommitment) {
    let vacations = resourcesCommitments.vacations?.filter(x => x.employeeCode === employee.employeeCode)?.map(x => {
      return {
        type: x.type,
        startDate: DateService.convertDateInBainFormat(x.startDate),
        endDate: DateService.convertDateInBainFormat(x.endDate)
      };
    });

    const vacationsSavedInBoss = resourcesCommitments.commitments
      ?.filter(x => x.employeeCode === employee.employeeCode && x.commitmentTypeCode === CommitmentType.VACATION)
      ?.map(x => {
        return {
          type: 'Vacation',
          startDate: DateService.convertDateInBainFormat(x.startDate),
          endDate: DateService.convertDateInBainFormat(x.endDate)
        };
      });

    vacations = vacations.concat(vacationsSavedInBoss);

    const vacationsSavedInWorkday = resourcesCommitments.timeOffs?.filter(x => x.employeeCode === employee.employeeCode)?.map(x => {
      return {
        type: x.type,
        startDate: DateService.convertDateInBainFormat(x.startDate),
        endDate: DateService.convertDateInBainFormat(x.endDate)
      };
    });
    vacations = vacations.concat(vacationsSavedInWorkday);
    vacations = vacations.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    vacations.forEach(vacation => {
      mergedColumnValues.push(vacation.type + ': ' + vacation.startDate + ' - ' + vacation.endDate);
    });
    return mergedColumnValues;
  }

  private getResourcesTrainings(employee, resourcesCommitments: ResourceCommitment) {
    let trainings = resourcesCommitments.trainings?.filter(x => x.employeeCode === employee.employeeCode)?.map(x => {
      return {
        type: x.type,
        startDate: DateService.convertDateInBainFormat(x.startDate),
        endDate: DateService.convertDateInBainFormat(x.endDate)
      };
    });

    const trainingsSavedInBoss = resourcesCommitments.commitments
      ?.filter(x => x.employeeCode === employee.employeeCode && x.commitmentTypeCode === CommitmentType.TRAINING)
      ?.map(x => {
        return {
          type: 'Trainings',
          startDate: DateService.convertDateInBainFormat(x.startDate),
          endDate: DateService.convertDateInBainFormat(x.endDate)
        };
      });

    trainings = trainings.concat(trainingsSavedInBoss);

    trainings = trainings.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    trainings.forEach(training => {
      mergedColumnValues.push(training.type + ': ' + training.startDate + ' - ' + training.endDate);
    });
    return mergedColumnValues;
  }

  private getResourcesAssignmentsOnCase(employee, resourcesCommitments: ResourceCommitment) {
    let assignments = resourcesCommitments.allocations?.filter(x => x.employeeCode === employee.employeeCode)?.map(x => {
      return {
        type: x.oldCaseCode ? `Case ${x.oldCaseCode} - ${x.caseName}` : `Opp ${x.opportunityName}`,
        startDate: DateService.convertDateInBainFormat(x.startDate),
        endDate: DateService.convertDateInBainFormat(x.endDate)
      };
    });

    assignments = assignments.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    assignments.forEach(assignment => {
      mergedColumnValues.push(assignment.type + ': ' + assignment.startDate + ' - ' + assignment.endDate);
    });
    return mergedColumnValues;
  }



  private getResourcesShortTermAvailability(employee, resourcesCommitments: ResourceCommitment) {
    let commitments = resourcesCommitments.commitments
      ?.filter(x => x.employeeCode === employee.employeeCode && x.commitmentTypeCode === CommitmentType.SHORT_TERM_AVAILABLE)
      ?.map(x => {
        return {
          type: `Short Term Available`,
          startDate: DateService.convertDateInBainFormat(x.startDate),
          endDate: DateService.convertDateInBainFormat(x.endDate)
        };
      });

    commitments = commitments.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    commitments.forEach(commitment => {
      mergedColumnValues.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
    });
    return mergedColumnValues;
  }


  private getResourcesLimitedAvailability(employee, resourcesCommitments: ResourceCommitment) {
    let commitments = resourcesCommitments.commitments
      ?.filter(x => x.employeeCode === employee.employeeCode && x.commitmentTypeCode === CommitmentType.LIMITED_AVAILABILITY)
      ?.map(x => {
        return {
          type: `Limited Available`,
          startDate: DateService.convertDateInBainFormat(x.startDate),
          endDate: DateService.convertDateInBainFormat(x.endDate)
        };
      });

    commitments = commitments.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    commitments.forEach(commitment => {
      mergedColumnValues.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
    });
    return mergedColumnValues;
  }


  private getResourcesNotAvailability(employee, resourcesCommitments: ResourceCommitment) {
    let commitments = resourcesCommitments.commitments
      ?.filter(x => x.employeeCode === employee.employeeCode && x.commitmentTypeCode === CommitmentType.NOT_AVAILABLE)
      ?.map(x => {
        return {
          type: `Not Available`,
          startDate: DateService.convertDateInBainFormat(x.startDate),
          endDate: DateService.convertDateInBainFormat(x.endDate)
        };
      });

    commitments = commitments.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    commitments.forEach(commitment => {
      mergedColumnValues.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
    });
    return mergedColumnValues;
  }


  private getResourcesRecruitments(employee, resourcesCommitments: ResourceCommitment) {
    let commitments = resourcesCommitments.commitments
      ?.filter(x => x.employeeCode === employee.employeeCode && x.commitmentTypeCode === CommitmentType.RECRUITING)
      ?.map(x => {
        return {
          type: `Recruiting`,
          startDate: DateService.convertDateInBainFormat(x.startDate),
          endDate: DateService.convertDateInBainFormat(x.endDate)
        };
      });

    commitments = commitments.sort((first, second) => {
      return <any>new Date(first.startDate) - <any>new Date(second.startDate);
    });

    const mergedColumnValues = [];
    commitments.forEach(commitment => {
      mergedColumnValues.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
    });
    return mergedColumnValues;
  }
}
