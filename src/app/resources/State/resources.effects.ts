import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ResourcesService } from '../resources.service';
import * as resourcesActions from '../State/resources.actions';
import { mergeMap, map, switchMap } from 'rxjs/operators';
import { ResourceStaffing } from 'src/app/shared/interfaces/resourceStaffing.interface';
import { ResourceAllocation } from 'src/app/shared/interfaces/resourceAllocation.interface';
import { NotificationService } from 'src/app/shared/notification.service';
import { Commitment } from 'src/app/shared/interfaces/commitment.interface';
import { ResourceFilter } from 'src/app/shared/interfaces/resource-filter.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { StaffableAsRole } from 'src/app/shared/interfaces/staffableAsRole.interface';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { ResourceOrCasePlanningViewNote } from 'src/app/shared/interfaces/resource-or-case-planning-view-note.interface';
import { ResourceLastBillableDate } from 'src/app/shared/interfaces/resource-last-billable-date.interface';
import { ResourceAssignmentService } from 'src/app/overlay/behavioralSubjectService/resourceAssignment.service';

@Injectable()
export class ResourcesEffects {
  constructor(private actions$: Actions,
    private resourcesService: ResourcesService,
    private notifyService: NotificationService,
    private sharedService: SharedService,
    private resourceAssignmentService: ResourceAssignmentService) { }

  @Effect()
  loadActiveResources$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.LoadResourcesStaffing),
    map((action: resourcesActions.LoadResourcesStaffing) => action.payload),
    switchMap((payload: any) =>
      this.resourcesService.getActiveResources(payload.supplyFilterCriteriaObj, payload.pageNumber,
        payload.resourcesPerPage).pipe(
          mergeMap((resources: ResourceStaffing[]) => {
            return (
              [
                new resourcesActions.ResourcesLoader(false)
                , new resourcesActions.LoadResourcesStaffingSuccess(resources)
              ]
            );
          }))));

  @Effect()
  loadGroupedResourcesResources$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.LoadGroupedResourcesStaffing),
    map((action: resourcesActions.LoadGroupedResourcesStaffing) => action.payload),
    switchMap((payload: any) =>
      this.resourcesService.getGroupedResources(payload.supplyGroupFilterCriteriaObj, payload.pageNumber,
        payload.resourcesPerPage).pipe(
          mergeMap((resources: ResourceStaffing[]) => {
            return (
              [
                new resourcesActions.ResourcesLoader(false)
                , new resourcesActions.LoadResourcesStaffingSuccess(resources)
              ]
            );
          }))));

  @Effect()
  loadActiveResourcesOnPageScroll$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.LoadResourcesStaffingOnPageScroll),
    map((action: resourcesActions.LoadResourcesStaffingOnPageScroll) => action.payload),
    mergeMap((payload: any) =>
      this.resourcesService.getActiveResources(payload.supplyFilterCriteriaObj, payload.pageNumber,
        payload.resourcesPerPage).pipe(
          mergeMap((resources: ResourceStaffing[]) => {
            return (
              [
                new resourcesActions.ResourcesLoader(false)
                , new resourcesActions.LoadResourcesStaffingOnPageScrollSuccess(resources)
              ]
            );
          }))));

  @Effect()
  loadResourcesBySearchString$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.LoadResourcesStaffingBySearchString),
    map((action: resourcesActions.LoadResourcesStaffingBySearchString) => action.payload),
    mergeMap((payload: any) =>
      this.resourcesService.getResourcesIncludingTerminatedBySearchString(payload.searchString, payload.startDate, payload.endDate).pipe(
        mergeMap((resources: ResourceStaffing[]) => {
          return (
            [
              new resourcesActions.ResourcesLoader(false)
              , new resourcesActions.LoadResourcesStaffingBySearchStringSuccess(resources)
            ])
        })
      ))
  );

  @Effect()
  loadCustomResourceFilters$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.LoadSavedResourceFilters),
    map((action: resourcesActions.LoadSavedResourceFilters) => action.payload),
    mergeMap(() =>
      this.sharedService.getSavedResourceFiltersForLoggedInUser().pipe(
        mergeMap((resourceFilters: ResourceFilter[]) => {
          return (
            [
              new resourcesActions.ResourcesLoader(false)
              , new resourcesActions.LoadSavedResourceFiltersSuccess(resourceFilters)
            ])
        })
      ))
  );

  @Effect()
  UpsertResourceFilters$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.UpsertResourceFilters),
    map((action: resourcesActions.UpsertResourceFilters) => action.payload),
    mergeMap((payload: ResourceFilter[]) =>
      this.sharedService.upsertResourceFiltersForLoggedInUser(payload).pipe(
        mergeMap((resourceFilters: ResourceFilter[]) => {
          this.notifyService.showSuccess(`Filters Saved/Updated Sucessfully!`);
          return (
            [
              new resourcesActions.ResourcesLoader(false)
              , new resourcesActions.UpsertResourceFiltersSuccess(resourceFilters)
            ])
        })
      ))
  );

  @Effect()
  UpsertResourceStaffableAsRole$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.UpsertResourceStaffableAsRole),
    map((action: resourcesActions.UpsertResourceStaffableAsRole) => action.payload),
    mergeMap((payload: any) =>
      this.resourcesService.upsertResourceStaffableAsRole(payload).pipe(
        mergeMap((staffableAsRoles: StaffableAsRole[]) => {
          this.notifyService.showSuccess(`Staffable As Role Saved/Updated Successfully!`);
          const updatedStaffableAsRole = { request: payload.staffableRoles, response: staffableAsRoles };
          return (
            [
              new resourcesActions.ResourcesLoader(false),
              new resourcesActions.UpsertResourceStaffableAsRoleSuccess(updatedStaffableAsRole),
              new resourcesActions.RefreshCaseAndResourceOverlay(true)
            ])
        })
      ))
  );

  @Effect()
  DeleteResourceStaffableAsRole$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.DeleteResourceStaffableAsRole),
    map((action: resourcesActions.DeleteResourceStaffableAsRole) => action.payload),
    mergeMap((payload: string) =>
      this.resourcesService.deleteResourceStaffableAsRoleById(payload).pipe(
        mergeMap(() => {
          this.notifyService.showSuccess(`Staffable As Role Deleted Successfully!`);
          return (
            [
              new resourcesActions.ResourcesLoader(false),
              new resourcesActions.DeleteResourceStaffableAsRoleSuccess(payload),
              new resourcesActions.RefreshCaseAndResourceOverlay(true)
            ])
        })
      ))
  );

  @Effect()
  updateResource$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.UpdateResource),
    map((action: resourcesActions.UpdateResource) => action.payload),
    mergeMap((payload: ResourceAllocation) =>
      this.resourcesService.updateResourceAssignmentToCase(payload).pipe(
        map((updatedResource: ResourceAllocation) => {
          this.notifyService.showSuccess(`Assignment for ${updatedResource.employeeName} is updated`);
          return (
            [
              new resourcesActions.UpdateResourceSuccess(payload),
              new resourcesActions.RefreshLastBillableDate(true)
            ]
          );
        })
      ))
  );

  @Effect()
  deleteResourceStaffing$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.DeleteResourceStaffing),
    map((action: resourcesActions.DeleteResourceStaffing) => action.payload),
    mergeMap((payload: string) =>
      this.resourcesService.deleteResourceAssignmentFromProject(payload).pipe(
        mergeMap(() => {
          this.notifyService.showSuccess(`Assignment is Deleted`);

          return (
            [
              new resourcesActions.DeleteResourceStaffingSuccess(payload),
              new resourcesActions.RefreshCaseAndResourceOverlay(true),
              new resourcesActions.RefreshLastBillableDate(true)
            ]
          );
        })
      ))
  );

  @Effect()
  deleteResourcesStaffing$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.DeleteResourcesStaffing),
    map((action: resourcesActions.DeleteResourcesStaffing) => action.payload),
    mergeMap((payload: string) =>
      this.resourcesService.deleteResourcesAssignmentsFromProject(payload).pipe(
        mergeMap(() => {
          this.notifyService.showSuccess(`Assignments are Deleted`);

          return (
            [
              new resourcesActions.DeleteResourceStaffingSuccess(payload),
              new resourcesActions.RefreshCaseAndResourceOverlay(true),
              new resourcesActions.RefreshLastBillableDate(true)
            ]
          );
        })
      ))
  );

  @Effect()
  addResourceStaffing$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.AddResourceStaffing),
    map((action: resourcesActions.AddResourceStaffing) => action.payload),
    mergeMap((payload: ResourceAllocation[]) =>
      this.resourcesService.mapResourceToProject(payload).pipe(
        map((result) => {
          this.notifyService.showSuccess(`Assignment for ${result[0].employeeName} is Added`);
          const employeeCodes = result.map(x => x.employeeCode).join(',');

          return (
            [
              new resourcesActions.AddResourceStaffingSuccess(result),
              new resourcesActions.RefreshLastBillableDate(true)
            ]
          );
        })
      ))
  );

  @Effect()
  UpsertResourceStaffing$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.UpsertResourceStaffing),
    map((action: resourcesActions.UpsertResourceStaffing) => action.payload),
    mergeMap((payload: any) =>
      this.resourcesService.upsertResourceAllocations(payload.upsertedAllocations).pipe(
        mergeMap((result) => {
          if (payload.splitSuccessMessage) {
            this.notifyService.showStickySuccess(payload.splitSuccessMessage);
          } else {
            this.notifyService.showSuccess(`Assignment is Saved`);
          }
          if (payload.allocationDataBeforeSplitting != null) {
            let allocationData = payload.allocationDataBeforeSplitting;
            if (allocationData.every((r) => r.oldCaseCode)) {
              this.sharedService.checkPegRingfenceAllocationAndInsertDownDayCommitments(allocationData).subscribe(commitments => {
                if (commitments?.length > 0) {
                  this.notifyService.showSuccess(ConstantsMaster.Messages.DownDaySaved);
                }
              });
            }
          }

          this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(payload.upsertedAllocations);
          const employeeCodes = result.map(x => x.employeeCode).join(',');

          return (
            [
              new resourcesActions.UpsertResourceStaffingSuccess(result),
              new resourcesActions.RefreshCaseAndResourceOverlay(true),
              new resourcesActions.RefreshLastBillableDate(true)
            ]
          );
        })
      ))
  );

  @Effect()
  UpsertPlaceholderStaffing$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.UpsertPlaceholderStaffing),
    map((action: resourcesActions.UpsertPlaceholderStaffing) => action.payload),
    mergeMap((payload: any) =>
      this.resourcesService.upsertPlaceholderAllocations(payload.upsertedAllocations).pipe(
        mergeMap((result) => {
          if (payload.splitSuccessMessage) {
            this.notifyService.showStickySuccess(payload.splitSuccessMessage);
          } else {
            this.notifyService.showSuccess(`Placeholder assignment is created/updated/deleted`);
          }

          return (
            [
              new resourcesActions.UpsertPlaceholderStaffingSuccess(result)
            ]
          );
        })
      ))
  );

  @Effect()
  addResourceCommitment$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.AddResourceCommitment),
    map((action: resourcesActions.AddResourceCommitment) => action.payload),
    mergeMap((payload: Commitment[]) =>
      this.resourcesService.upsertResourcesCommitments(payload).pipe(
        mergeMap((result) => {
          this.notifyService.showSuccess(`Commitment Added Successfully`);
          return (
            [
              new resourcesActions.AddResourceCommitmentSuccess(result),
              new resourcesActions.RefreshCaseAndResourceOverlay(true)
            ]
          );
        })
      ))
  );

  @Effect()
  updateResourceCommitment$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.UpdateResourceCommitment),
    map((action: resourcesActions.UpdateResourceCommitment) => action.payload),
    mergeMap((payload: Commitment) =>
      this.resourcesService.upsertResourcesCommitments([payload]).pipe(
        mergeMap((result) => {
          this.notifyService.showSuccess(`Commitment Updated Successfully`);
          return (
            [
              new resourcesActions.UpdateResourceCommitmentSuccess(result),
              new resourcesActions.RefreshCaseAndResourceOverlay(true)
            ]
          );
        })
      ))
  );

  @Effect()
  deleteResourceCommitment$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.DeleteResourceCommitment),
    map((action: resourcesActions.DeleteResourceCommitment) => action.payload),
    mergeMap((payload: string) =>
      this.resourcesService.deleteResourcecommitment(payload).pipe(
        mergeMap(() => {
          this.notifyService.showSuccess(`Commitment Deleted Successfully`);

          return (
            [
              new resourcesActions.DeleteResourceCommitmentSuccess(payload),
              new resourcesActions.RefreshCaseAndResourceOverlay(true)
            ]
          );
        })
      ))
  );

  @Effect()
  deleteResourceCommitmentsAllocations$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.DeleteAllocationsCommitmentsStaffing),
    map((action: resourcesActions.DeleteAllocationsCommitmentsStaffing) => action.payload),
    mergeMap((payload: string) =>
      this.resourcesService.deleteResourceAllocationsCommitments(payload).pipe(
        mergeMap(() => {
          this.notifyService.showSuccess(`Allocations(s)/Commitment(s) Deleted Successfully`);

          return (
            [
              new resourcesActions.DeleteAllocationsCommitmentsStaffingSuccess(payload),
              new resourcesActions.RefreshCaseAndResourceOverlay(true),
              new resourcesActions.RefreshLastBillableDate(true)
            ]
          );
        })
      ))
  );

  @Effect()
  deleteSavedResourceFilter$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.DeleteSavedResourceFilter),
    map((action: resourcesActions.DeleteSavedResourceFilter) => action.payload),
    mergeMap((payload: string) =>
      this.sharedService.deleteSavedResourceFilter(payload).pipe(
        map((result) => {
          this.notifyService.showSuccess(`Saved filter successfully deleted`);
          return (new resourcesActions.DeleteSavedResourceFilterSuccess(result));
        })
      ))
  );

  @Effect()
  upsertResourceViewNote$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.UpsertResourceViewNote),
    map((action: resourcesActions.UpsertResourceViewNote) => action.payload),
    mergeMap((payload: ResourceOrCasePlanningViewNote) =>
      this.resourcesService.upsertResourceViewNote(payload).pipe(
        mergeMap((result: ResourceOrCasePlanningViewNote) => {
          if (payload.id)
            this.notifyService.showSuccess(`Note Updated Successfully`);
          else
            this.notifyService.showSuccess(`Note Added Successfully`);
          return (
            [
              new resourcesActions.UpsertResourceViewNoteSuccess(result),
              new resourcesActions.RefreshCaseAndResourceOverlay(true)
            ]
          );
        })
      ))
  );

  @Effect()
  deleteResourceViewNotes$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.DeleteResourceViewNotes),
    map((action: resourcesActions.DeleteResourceViewNotes) => action.payload),
    mergeMap((payload: string) =>
      this.resourcesService.deleteResourceViewNotes(payload).pipe(
        mergeMap((result: string[]) => {
          if (result.length === 1)
            this.notifyService.showSuccess(`Note Deleted Successfully`);
          else if (result.length > 1)
            this.notifyService.showSuccess(`Notes Deleted Successfully`);
          return (
            [
              new resourcesActions.DeleteResourceViewNotesSuccess(result),
              new resourcesActions.RefreshCaseAndResourceOverlay(true)
            ]
          );
        })
      ))
  );

  @Effect()
  loadLastBillableDateForResources$ = this.actions$.pipe(
    ofType(resourcesActions.ResourcesActionTypes.LoadLastBillableDateForResources),
    map((action: resourcesActions.LoadLastBillableDateForResources) => action.payload),
    switchMap((payload: any) =>
      this.resourcesService.getLastBillableDateByEmployeeCodes(payload.employeeCodes).pipe(
          mergeMap((resources: ResourceLastBillableDate[]) => {
            return (
              [
                new resourcesActions.ResourcesLoader(false)
                , new resourcesActions.LoadLastBillableDateForResourcesSuccess(resources, payload.employeeCodes)
              ]
            );
          }))));
}
