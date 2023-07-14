// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';

// ----------------------- Component References ----------------------------------//
import { ProjectOverlayComponent } from '../project-overlay/project-overlay.component';
import { ResourceOverlayComponent } from '../resource-overlay/resource-overlay.component';

// ----------------------- Service References ----------------------------------//
import { CaseRollDialogService } from './caseRollDialog.service';
import { NotesDialogService } from './notesDialog.service';
import { OpportunityService } from '../behavioralSubjectService/opportunity.service';
import { QuickAddDialogService } from './quickAddDialog.service';
import { PlaceholderDialogService } from './placeholderDialog.service';
import { ResourceAssignmentService } from '../behavioralSubjectService/resourceAssignment.service';
import { ResourceCommitmentService } from '../behavioralSubjectService/resourceCommitment.service';
import { SkuCaseTermService } from '../behavioralSubjectService/skuCaseTerm.service';
import { SplitAllocationDialogService } from './splitAllocationDialog.service';
import { UserPreferenceService } from '../behavioralSubjectService/userPreference.service';

// --------------------------utilities -----------------------------------------//
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ResourceStaffableAsService } from '../behavioralSubjectService/resourceStaffableAs.service';
import { PlaceholderAssignmentService } from '../behavioralSubjectService/placeholderAssignment.service';

@Injectable()
export class OverlayDialogService {

  constructor(public dialog: MatDialog,
    private caseRollDialogService: CaseRollDialogService,
    private notesDialogService: NotesDialogService,
    private quickAddDialogService: QuickAddDialogService,
    private placeholderDialogService: PlaceholderDialogService,
    private placeholderAssignmentService: PlaceholderAssignmentService,
    private resourceAssignmentService: ResourceAssignmentService,
    private resourceCommitmentService: ResourceCommitmentService,
    private skuCaseTermService: SkuCaseTermService,
    private splitAllocationDialogService: SplitAllocationDialogService,
    private userPreferenceService: UserPreferenceService,
    private opportunityService: OpportunityService,
    private resourceStaffableAsService: ResourceStaffableAsService
  ) { }

  // --------------------------Local Variable -----------------------------------------//

  projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
  dialogRef: MatDialogRef<ResourceOverlayComponent, any>;
  // --------------------------Overlay -----------------------------------------//

  // Project Overlay
  openProjectDetailsDialogHandler(projectData) {

    // close previous project dialog & open new dialog
    if (this.projectDialogRef) {
      this.projectDialogRef.close('no null');
    }

    // if (this.projectDialogRef == null) {
    this.projectDialogRef = this.dialog.open(ProjectOverlayComponent, {
      closeOnNavigation: true,
      data: {
        projectData: projectData,
        showDialog: true
      }
    });

    // Listens for click on resource name for opening the resource details pop-up
    this.projectDialogRef.componentInstance.openResourceDetailsFromProjectDialog.subscribe(employeeCode => {
      this.openResourceDetailsDialogHandler(employeeCode);
    });

    // Listens for click on notes opening the ag-grid notes pop-up
    this.projectDialogRef.componentInstance.openNotesDialog.subscribe(projectData => {
      this.notesDialogService.dialogRef = this.dialogRef;
      this.notesDialogService.projectDialogRef = this.projectDialogRef;
      this.notesDialogService.openNotesDialogHandler(projectData);
    });

    // Listens for click on split allocation in context menu of ag-grid
    this.projectDialogRef.componentInstance.openSplitAllocationDialog.subscribe(projectData => {
      this.splitAllocationDialogService.dialogRef = this.dialogRef;
      this.splitAllocationDialogService.projectDialogRef = this.projectDialogRef;
      this.splitAllocationDialogService.openSplitAllocationDialogHandler(projectData);
    });

    // inserts & updates resource data when changes are made to resource
    this.projectDialogRef.componentInstance.upsertResourceAllocationsToProject.subscribe(updatedData => {
      this.resourceAssignmentService.upsertResourceAllocationsToProject(updatedData, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(updatedData.resourceAllocation);
    });

    // inserts & updates placeholder data when changes are made to placeholder
    this.projectDialogRef.componentInstance.upsertPlaceholderAllocationsToProject.subscribe(updatedData => {
      this.placeholderAssignmentService.upsertPlcaeholderAllocations(updatedData, null, this.projectDialogRef);
    });

    // delete resource data
    this.projectDialogRef.componentInstance.deleteResourceFromProject.subscribe(allocationId => {
      this.resourceAssignmentService.deleteResourceAssignmentFromCase(allocationId, this.dialogRef, this.projectDialogRef);
    });

    // delete resources data
    this.projectDialogRef.componentInstance.deleteResourcesFromProject.subscribe(updatedData => {
      this.resourceAssignmentService.deleteResourcesAssignmentsFromCase(updatedData.allocationIds, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(updatedData.resourceAllocation);
    });

    // delete placeholder data
    this.projectDialogRef.componentInstance.deletePlaceholdersFromProject.subscribe(placeholderData => {
      this.placeholderAssignmentService.deletePlaceHoldersByIds(placeholderData, this.projectDialogRef);
    });

    // opens add resource popup
    this.projectDialogRef.componentInstance.openQuickAddForm.subscribe(projectData => {
      this.quickAddDialogService.dialogRef = this.dialogRef;
      this.quickAddDialogService.projectDialogRef = this.projectDialogRef;
      this.quickAddDialogService.openQuickAddFormHandler(projectData);
    });

    // insert sku case term
    this.projectDialogRef.componentInstance.insertSkuCaseTermsForProject.subscribe(skuTab => {
      this.skuCaseTermService.insertSKUCaseTerms(skuTab, this.dialogRef, this.projectDialogRef);
    });

    // update sku case term
    this.projectDialogRef.componentInstance.updateSkuCaseTermsForProject.subscribe(skuTab => {
      this.skuCaseTermService.updateSKUCaseTerms(skuTab, this.dialogRef, this.projectDialogRef);
    });

    // delete sku case term
    this.projectDialogRef.componentInstance.deleteSkuCaseTermsForProject.subscribe(skuTab => {
      this.skuCaseTermService.deleteSKUCaseTerms(skuTab, this.dialogRef, this.projectDialogRef);
    });

    // add project to user settings show list
    this.projectDialogRef.componentInstance.addProjectToUserExceptionShowList.subscribe(event => {
      this.userPreferenceService.addCaseOpportunityToUserExceptionShowList(event);
    });

    // remove project to user settings show list
    this.projectDialogRef.componentInstance.removeProjectFromUserExceptionShowList.subscribe(event => {
      this.userPreferenceService.removeCaseOpportunityFromUserExceptionShowList(event);
    });

    // add project to user settings hide list
    this.projectDialogRef.componentInstance.addProjectToUserExceptionHideList.subscribe(event => {
      this.userPreferenceService.addCaseOpportunityToUserExceptionHideList(event);
    });

    // remove project from user settings hide list
    this.projectDialogRef.componentInstance.removeProjectFromUserExceptionHideList.subscribe(event => {
      this.userPreferenceService.removeCaseOpportunityFromUserExceptionHideList(event, true);
    });

    // open case roll pop-up
    this.projectDialogRef.componentInstance.openCaseRollForm.subscribe(event => {
      this.caseRollDialogService.projectDialogRef = this.projectDialogRef;
      this.caseRollDialogService.openCaseRollFormHandler(event);
    });

     // open placeholder pop-up
     this.projectDialogRef.componentInstance.openPlaceholderForm.subscribe(projectData => {
      this.placeholderDialogService.projectDialogRef = this.projectDialogRef;
      this.placeholderDialogService.openPlaceholderFormHandler(projectData);
    });

    // update pipeline data in staffing db
    this.projectDialogRef.componentInstance.updateProjectChanges.subscribe(event => {
      this.opportunityService.updateProjectChangesHandler(event, this.projectDialogRef);
    });

    this.projectDialogRef.beforeClosed().subscribe(result => {
      if (result !== 'no null') {
        this.projectDialogRef = null;
      }
    });
    // }
  }

  openResourceDetailsDialogHandler(employeeCode) {
    // if (this.createTeamDialogRef != null) {
    //   this.createTeamDialogRef.close();
    // }

    // close previous resource dialog & open new dialog
    if (this.dialogRef) {
      this.dialogRef.close('no null');
      this.dialogRef = null;
    }

    this.dialogRef = this.dialog.open(ResourceOverlayComponent, {
      closeOnNavigation: true,
      data: {
        employeeCode: employeeCode,
        showOverlay: true
      }
    });

    this.dialogRef.componentInstance.openResourceDetailsFromProjectDialog.subscribe(projectData => {
      this.openResourceDetailsDialogHandler(projectData);
    });

    // Listens for click on case name for opening the project details pop-up
    this.dialogRef.componentInstance.openProjectDetailsFromResourceDialog.subscribe(projectData => {
      this.openProjectDetailsDialogHandler(projectData);
    });

    // Listens for click on notes opening the ag-grid notes pop-up
    this.dialogRef.componentInstance.openNotesDialog.subscribe(projectData => {
      this.notesDialogService.dialogRef = this.dialogRef;
      this.notesDialogService.projectDialogRef = this.projectDialogRef;
      this.notesDialogService.openNotesDialogHandler(projectData);
    });

    // Listens for click on split allocation in context menu of ag-grid
    this.dialogRef.componentInstance.openSplitAllocationDialog.subscribe(projectData => {
      this.splitAllocationDialogService.dialogRef = this.dialogRef;
      this.splitAllocationDialogService.projectDialogRef = this.projectDialogRef;
      this.splitAllocationDialogService.openSplitAllocationDialogHandler(projectData);
    });

    this.dialogRef.componentInstance.updateResourceCommitment.subscribe(updatedCommitment => {
      this.resourceCommitmentService.updateResourceCommitment(updatedCommitment, this.dialogRef, this.projectDialogRef);
    });

    // inserts & updates resource data when changes are made to resource
    this.dialogRef.componentInstance.upsertResourceAllocationsToProject.subscribe(updatedData => {
      this.resourceAssignmentService.upsertResourceAllocationsToProject(updatedData, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(updatedData.resourceAllocation);
    });

    this.dialogRef.componentInstance.deleteResourceCommitment.subscribe(deletedObj => {
      this.resourceCommitmentService.deleteResourceCommitment(deletedObj, this.dialogRef);
    });

    this.dialogRef.componentInstance.deleteResourceAllocationFromCase.subscribe(allocation => {
      this.resourceAssignmentService.deleteResourceAssignmentFromCase(allocation.allocationId, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(allocation.resourceAllocation);
    });

    this.dialogRef.componentInstance.deleteResourceAllocationFromCases.subscribe(allocation => {
      this.resourceAssignmentService.deleteResourcesAssignmentsFromCase(allocation.allocationIds, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(allocation.resourceAllocation);
    });

    this.dialogRef.componentInstance.deleteResourceAllocationsCommitmentsFromCase.subscribe(dataToDelete => {
      this.resourceAssignmentService.deleteResourcesAllocationsCommitments(dataToDelete, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(dataToDelete.resourceAllocation);
    });

    this.dialogRef.componentInstance.deleteStaffableAsRoleEmitter.subscribe(event => {
      this.resourceStaffableAsService.deleteStaffableAsRole(event, this.dialogRef);
    });

    this.dialogRef.componentInstance.upsertStaffableAsRoleEmitter.subscribe(event => {
      this.resourceStaffableAsService.upsertStaffableAsRoleEventEmitterHandler(event, this.dialogRef);
    });

    this.dialogRef.componentInstance.openQuickAddForm.subscribe(modalData => {
      this.quickAddDialogService.dialogRef = this.dialogRef;
      this.quickAddDialogService.projectDialogRef = this.projectDialogRef;
      this.quickAddDialogService.openQuickAddFormHandler(modalData);
    });

    // updates resource data when changes are made to resource
    this.dialogRef.componentInstance.updateResourceDataForProject.subscribe(updatedData => {
      this.resourceAssignmentService.updateResourceAssignmentToCase(updatedData, this.dialogRef, this.projectDialogRef);
    });

    this.dialogRef.beforeClosed().subscribe((result) => {
      if (result !== 'no null') {
        this.dialogRef = null;
      }
    });
  }

  closeDialogs() {

    this.dialogRef?.close();
    this.projectDialogRef?.close();

  }

}
