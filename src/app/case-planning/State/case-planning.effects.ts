import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { ResourceAssignmentService } from 'src/app/overlay/behavioralSubjectService/resourceAssignment.service';
import { Commitment } from 'src/app/shared/interfaces/commitment.interface';
import { PlanningCard } from 'src/app/shared/interfaces/planningCard.interface';
import { Project } from 'src/app/shared/interfaces/project.interface';
import { ResourceAllocation } from 'src/app/shared/interfaces/resourceAllocation.interface';
import { StaffableAsRole } from 'src/app/shared/interfaces/staffableAsRole.interface';
import { NotificationService } from 'src/app/shared/notification.service';
import { CasePlanningService } from '../case-planning.service';
import * as casePlanningActions from './case-planning.actions';
import { ResourceOrCasePlanningViewNote } from 'src/app/shared/interfaces/resource-or-case-planning-view-note.interface';

@Injectable()
export class CasePlanningEffects {

    constructor(
        private actions$: Actions,
        private notifyService: NotificationService,
        private casePlanningService: CasePlanningService,
        private resourceAssignmentService: ResourceAssignmentService
    ) { }

    @Effect()
    loadActiveProjects$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.LoadProjects),
        map((action: casePlanningActions.LoadProjects) => action.payload),
        mergeMap((payload: any) =>
            this.casePlanningService.getProjectsFilteredBySelectedValues(payload.demandFilterCriteriaObj)
                .pipe(
                    mergeMap((projects: Project[]) => {
                        return (
                            [
                                new casePlanningActions.CasePlanningLoader(false)
                                , new casePlanningActions.LoadProjectsSuccess(projects)
                            ]
                        );
                    }))));

    @Effect()
    loadActivePlanningCards$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.LoadPlanningCards),
        map((action: casePlanningActions.LoadPlanningCards) => action.payload),
        mergeMap((payload: any) =>
            this.casePlanningService.getPlanningCardsBySelectedValues(payload.demandFilterCriteriaObj)
                .pipe(
                    mergeMap((planningCards: PlanningCard[]) => {
                        return (
                            [
                                new casePlanningActions.CasePlanningLoader(false)
                                , new casePlanningActions.LoadPlanningCardsSuccess(planningCards)
                            ]
                        );
                    }))));

    @Effect()
    loadCasesOnScroll$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.LoadCasesOnPageScroll),
        map((action: casePlanningActions.LoadCasesOnPageScroll) => action.payload),
        mergeMap((payload: any) =>
            this.casePlanningService.getProjectsFilteredBySelectedValues(payload.demandFilterCriteriaObj)
                .pipe(
                    mergeMap((projects: Project[]) => {
                        return (
                            [
                                new casePlanningActions.CasePlanningLoader(false)
                                , new casePlanningActions.LoadCasesOnPageScrollSuccess(projects)
                            ]
                        );
                    }))));

    @Effect()
    loadProjectsBySearchString$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.LoadProjectsBySearchString),
        map((action: casePlanningActions.LoadProjectsBySearchString) => action.payload),
        mergeMap((payload: any) =>
            this.casePlanningService.getProjectsBySearchString(payload.searchString).pipe(
                mergeMap((projects: Project[]) => {
                    return (
                        [
                            new casePlanningActions.CasePlanningLoader(false)
                            , new casePlanningActions.LoadProjectsBySearchStringSuccess(projects)
                        ])
                })
            ))
    );

    @Effect()
    UpsertResourceStaffing$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.UpsertResourceStaffing),
        map((action: casePlanningActions.UpsertResourceStaffing) => action.payload),
        mergeMap((payload: ResourceAllocation[]) =>
            this.casePlanningService.upsertResourceAllocations(payload).pipe(
                mergeMap((result) => {
                    //   this.notifyService.showSuccess(`Assignment for ${result[0].employeeName} is Saved`);
                    this.notifyService.showSuccess(`Assignment is Saved`);
                    this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(payload);
                    return (
                        [
                            new casePlanningActions.UpsertResourceStaffingSuccess(result),
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ]
                    );
                })
            ))
    );

    @Effect()
    addResourceCommitment$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.AddResourceCommitment),
        map((action: casePlanningActions.AddResourceCommitment) => action.payload),
        mergeMap((payload: Commitment[]) =>
            this.casePlanningService.upsertResourcesCommitments(payload).pipe(
                mergeMap((result) => {
                    this.notifyService.showSuccess(`Commitment Added Successfully`);
                    return (
                        [
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ]
                    );
                })
            ))
    );

    @Effect()
    updateResourceCommitment$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.UpdateResourceCommitment),
        map((action: casePlanningActions.UpdateResourceCommitment) => action.payload),
        mergeMap((payload: Commitment) =>
            this.casePlanningService.upsertResourcesCommitments([payload]).pipe(
                mergeMap((result) => {
                    this.notifyService.showSuccess(`Commitment Updated Successfully`);
                    return (
                        [
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ]
                    );
                })
            ))
    );

    @Effect()
    deleteResourceCommitment$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.DeleteResourceCommitment),
        map((action: casePlanningActions.DeleteResourceCommitment) => action.payload),
        mergeMap((payload: string) =>
            this.casePlanningService.deleteResourcecommitment(payload).pipe(
                mergeMap(() => {
                    this.notifyService.showSuccess(`Commitment Deleted Successfully`);

                    return (
                        [
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ]
                    );
                })
            ))
    );

    @Effect()
    deleteResourceStaffing$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.DeleteResourceStaffing),
        map((action: casePlanningActions.DeleteResourceStaffing) => action.payload),
        mergeMap((payload: string) =>
            this.casePlanningService.deleteResourceAssignmentFromProject(payload).pipe(
                mergeMap(() => {
                    this.notifyService.showSuccess(`Assignment is Deleted`);

                    return (
                        [
                            new casePlanningActions.DeleteResourceStaffingSuccess(payload),
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ]
                    );
                })
            ))
    );

    @Effect()
    deleteResourcesStaffing$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.DeleteResourcesStaffing),
        map((action: casePlanningActions.DeleteResourcesStaffing) => action.payload),
        mergeMap((payload: string) =>
            this.casePlanningService.deleteResourcesAssignmentsFromProject(payload).pipe(
                mergeMap(() => {
                    this.notifyService.showSuccess(`Assignments are Deleted`);

                    return (
                        [
                            new casePlanningActions.DeleteResourceStaffingSuccess(payload),
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ]
                    );
                })
            ))
    );

    @Effect()
    deleteResourceCommitmentsAllocations$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.DeleteAllocationsCommitmentsStaffing),
        map((action: casePlanningActions.DeleteAllocationsCommitmentsStaffing) => action.payload),
        mergeMap((payload: string) =>
            this.casePlanningService.deleteResourceAllocationsCommitments(payload).pipe(
                mergeMap(() => {
                    this.notifyService.showSuccess(`Allocations(s)/Commitment(s) Deleted Successfully`);
                    return (
                        [
                            new casePlanningActions.DeleteResourceStaffingSuccess(payload),
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ]
                    );
                })
            ))
    );

    @Effect()
    UpsertResourceStaffableAsRole$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.UpsertResourceStaffableAsRole),
        map((action: casePlanningActions.UpsertResourceStaffableAsRole) => action.payload),
        mergeMap((payload: any) =>
            this.casePlanningService.upsertResourceStaffableAsRole(payload).pipe(
                mergeMap((staffableAsRoles: StaffableAsRole[]) => {
                    this.notifyService.showSuccess(`Staffable As Role Saved/Updated Successfully!`);
                    //const updatedStaffableAsRole = {request: payload.staffableRoles, response: staffableAsRoles};
                    return (
                        [
                            new casePlanningActions.CasePlanningLoader(false),
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ])
                })
            ))
    );

    @Effect()
    DeleteResourceStaffableAsRole$ = this.actions$.pipe(
        ofType(casePlanningActions.CasePlanningActionTypes.DeleteResourceStaffableAsRole),
        map((action: casePlanningActions.DeleteResourceStaffableAsRole) => action.payload),
        mergeMap((payload: string) =>
            this.casePlanningService.deleteResourceStaffableAsRoleById(payload).pipe(
                mergeMap(() => {
                    this.notifyService.showSuccess(`Staffable As Role Deleted Successfully!`);
                    return (
                        [
                            new casePlanningActions.CasePlanningLoader(false),
                            new casePlanningActions.RefreshCaseAndResourceOverlay(true)
                        ])
                })
            ))
    );

    @Effect()
    upsertCasePlanningViewNote$ = this.actions$.pipe(
      ofType(casePlanningActions.CasePlanningActionTypes.UpsertCasePlanningViewNote),
      map((action: casePlanningActions.UpsertCasePlanningViewNote) => action.payload),
      mergeMap((payload: ResourceOrCasePlanningViewNote) =>
        this.casePlanningService.upsertCasePlanningViewNote(payload).pipe(
          mergeMap((result: ResourceOrCasePlanningViewNote) => {
            if (payload.id)
              this.notifyService.showSuccess(`Note Updated Successfully`);
            else
              this.notifyService.showSuccess(`Note Added Successfully`);
            return (
              [
                new casePlanningActions.UpsertCasePlanningViewNoteSuccess(result),
                new casePlanningActions.CasePlanningLoader(false)
              ]
            );
          })
        ))
    );
  
    @Effect()
    deleteCasePlanningViewNotes$ = this.actions$.pipe(
      ofType(casePlanningActions.CasePlanningActionTypes.DeleteCasePlanningViewNotes),
      map((action: casePlanningActions.DeleteCasePlanningViewNotes) => action.payload),
      mergeMap((payload: string) =>
        this.casePlanningService.deleteCasePlanningNotes(payload).pipe(
          mergeMap((result: string[]) => {
            if (result.length === 1)
              this.notifyService.showSuccess(`Note Deleted Successfully`);
            else if (result.length > 1)
              this.notifyService.showSuccess(`Notes Deleted Successfully`);
            return (
              [
                new casePlanningActions.DeleteCasePlanningViewNotesSuccess(result),
                new casePlanningActions.CasePlanningLoader(false)
              ]
            );
          })
        ))
    );

}
