import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { CommitmentsService } from "../commitments.service";
import { CommitmentType } from "../constants/enumMaster";
import { DateService } from "../dateService";
import { ResourceCommitment } from "../interfaces/resourceCommitment";
import { PopupDragService } from "../services/popupDrag.service";

@Component({
    selector: 'app-quick-peek',
    templateUrl: './quick-peek.component.html',
    styleUrls: ['./quick-peek.component.scss']
})
export class QuickPeekComponent implements OnInit {
    employees: any;
    commitments = [];
    modalHeaderText: string;
    isUpcomingCommitmentsLoading = true;
    // Default weeks will be 12,Min-1,Max-52
    durationInWeeks = 12;
    changeInDuration$: Subject<string> = new Subject();
    htmlTableDef = [];

    constructor(public bsModalRef: BsModalRef,
        private commitmentService: CommitmentsService,
        private _popupDragService: PopupDragService) { }

    ngOnInit() {
        this.modalHeaderText = 'Resources Commitments';
        this._popupDragService.dragEvents();
        this.getUpcomingResourcesCommitments(this.durationInWeeks);
        this.subscribeDurationChanges();
        this.setHTMLTableDef(this.durationInWeeks);
    }

    closeDialogHandler() {
        this.bsModalRef.hide();
    }

    getUpcomingResourcesCommitments(resourcesCommitmentWeeks) {
        const employeeCodes = this.getEmployeeCodesString();
        const startDate = DateService.getBainFormattedToday();
        const endDate = DateService.addWeeks(startDate, resourcesCommitmentWeeks);
        this.commitments = [];

        this.commitmentService.getResourcesCommitmentsWithinDateRangeByCommitmentTypes(employeeCodes, startDate, endDate).subscribe(resourcesCommitments => {
            this.employees.forEach(employee => {
                const resourceCommitments = this.deriveResourceCommitments(employee, resourcesCommitments);
                if (resourceCommitments !== null) {
                    this.commitments.push(resourceCommitments);
                }
            });
            this.isUpcomingCommitmentsLoading = false;
        });
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
        commitments = commitments.concat(this.getResourcesOfficeHolidays(employee, resourcesCommitments));

        return {
            employeeName: employee.employeeName,
            levelGrade: employee.levelGrade,
            commitments: commitments
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

        const columnValue = [];
        loAs.forEach(loa => {
            columnValue.push(loa.type + ': ' + loa.startDate + ' - ' + loa.endDate);
        });
        return columnValue;
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

        const columnValue = [];
        vacations.forEach(vacation => {
            columnValue.push(vacation.type + ': ' + vacation.startDate + ' - ' + vacation.endDate);
        });
        return columnValue;
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

        const columnValue = [];
        trainings.forEach(training => {
            columnValue.push(training.type + ': ' + training.startDate + ' - ' + training.endDate);
        });
        return columnValue;
    }

    private getResourcesAssignmentsOnCase(employee, resourcesCommitments: ResourceCommitment) {
        let assignments = resourcesCommitments.allocations?.filter(x => x.employeeCode === employee.employeeCode)?.map(x => {
            return {
                type: x.oldCaseCode ? `Case ${x.oldCaseCode}` : `Opp ${x.opportunityName}`,
                startDate: DateService.convertDateInBainFormat(x.startDate),
                endDate: DateService.convertDateInBainFormat(x.endDate)
            };
        });

        assignments = assignments.sort((first, second) => {
            return <any>new Date(first.startDate) - <any>new Date(second.startDate);
        });

        const columnValue = [];
        assignments.forEach(assignment => {
            columnValue.push(assignment.type + ': ' + assignment.startDate + ' - ' + assignment.endDate);
        });
        return columnValue;
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

        const columnValue = [];
        commitments.forEach(commitment => {
            columnValue.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
        });
        return columnValue;
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

        const columnValue = [];
        commitments.forEach(commitment => {
            columnValue.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
        });
        return columnValue;
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

        const columnValue = [];
        commitments.forEach(commitment => {
            columnValue.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
        });
        return columnValue;
    }

    private getResourcesOfficeHolidays(employee, resourcesCommitments: ResourceCommitment) {
        let commitments = resourcesCommitments.holidays
            ?.filter(x => x.employeeCode === employee.employeeCode)
            ?.map(x => {
                return {
                    type: `Office Closure`,
                    startDate: DateService.convertDateInBainFormat(x.startDate),
                    endDate: DateService.convertDateInBainFormat(x.endDate)
                };
            });

        commitments = commitments.sort((first, second) => {
            return <any>new Date(first.startDate) - <any>new Date(second.startDate);
        });

        const columnValue = [];
        commitments.forEach(commitment => {
            columnValue.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
        });
        return columnValue;
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

        const columnValue = [];
        commitments.forEach(commitment => {
            columnValue.push(commitment.type + ': ' + commitment.startDate + ' - ' + commitment.endDate);
        });
        return columnValue;
    }

    setIntervalThreshold(event) {
        if(!isNaN(event)){
            this.durationInWeeks = parseInt(event);
            this.changeInDuration$.next();
        }
    }

    subscribeDurationChanges(){
        this.changeInDuration$.pipe(debounceTime(500)).subscribe((value) => {
            this.setHTMLTableDef(this.durationInWeeks);
            this.getUpcomingResourcesCommitments(this.durationInWeeks)
        });
    }

    setHTMLTableDef(durationInWeeks){
        this.htmlTableDef = [
            { columnHeaderText: 'Resource', columnMappingValue: 'employeeName', isVisible: true },
            { columnHeaderText: 'Level Grade', columnMappingValue: 'levelGrade', isVisible: true },
            { columnHeaderText: 'Commitment (Next ' + durationInWeeks +' Weeks)', columnMappingValue: 'commitments', isVisible: true},
        ];

    }

}
