// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';

// ----------------------- Component References ----------------------------------//
import { ProjectOverlayComponent } from '../project-overlay/project-overlay.component';
import { QuickAddFormComponent } from 'src/app/shared/quick-add-form/quick-add-form.component';
import { ResourceOverlayComponent } from '../resource-overlay/resource-overlay.component';

// ----------------------- Service References ----------------------------------//
import { BackfillDialogService } from './backFillDialog.service';
import { ResourceAssignmentService } from '../behavioralSubjectService/resourceAssignment.service';
import { ResourceCommitmentService } from '../behavioralSubjectService/resourceCommitment.service';

// --------------------------utilities -----------------------------------------//
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material/dialog';
import { PlaceholderAssignmentService } from '../behavioralSubjectService/placeholderAssignment.service';
import { OverlappedTeamDialogService } from './overlapped-team-dialog.service';

@Injectable()
export class QuickAddDialogService {

  constructor(private modalService: BsModalService,
    private backfillDialogService: BackfillDialogService,
    private resourceCommitmentService: ResourceCommitmentService,
    private resourceAssignmentService: ResourceAssignmentService,
    private placeholderAssignmentService: PlaceholderAssignmentService,
    private overlappedTeamDialogService: OverlappedTeamDialogService) { }

  // --------------------------Local Variable -----------------------------------------//

  bsModalRef: BsModalRef;
  projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
  dialogRef: MatDialogRef<ResourceOverlayComponent, any>;
  // --------------------------Overlay -----------------------------------------//

  openQuickAddFormHandler(modalData) {
    // class is required to center align the modal on large screens
    let initialState = null;

    if (modalData) {

      initialState = {
        commitmentTypeCode: modalData.commitmentTypeCode,
        resourceAllocationData: modalData.resourceAllocationData,
        isUpdateModal: modalData.isUpdateModal,
        isPlaceholderAllocation: modalData.isPlaceholderAllocation
      };

    }

    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(QuickAddFormComponent, config);

    this.bsModalRef.content.insertResourcesCommitments.subscribe(commitments => {
      this.resourceCommitmentService.insertResourcesCommitments(commitments, this.dialogRef);
    });

    this.bsModalRef.content.updateResourceCommitment.subscribe(updatedCommitment => {
      this.resourceCommitmentService.updateResourceCommitment(updatedCommitment, this.dialogRef, this.projectDialogRef);
    });

    // inserts & updates resource data when changes are made to resource
    this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(updatedCommitment => {
      this.resourceAssignmentService.upsertResourceAllocationsToProject(updatedCommitment, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(updatedCommitment.resourceAllocation);
    });

    // inserts & updates placeholder data when changes are made to resource
    this.bsModalRef.content.upsertPlaceholderAllocationsToProject.subscribe(updatedCommitment => {
      this.placeholderAssignmentService.upsertPlcaeholderAllocations(updatedCommitment, this.dialogRef, this.projectDialogRef);
      });

    this.bsModalRef.content.deleteResourceCommitment.subscribe(deletedObj => {
      this.resourceCommitmentService.deleteResourceCommitment(deletedObj, this.dialogRef);
    });

    this.bsModalRef.content.deleteResourceAllocationFromCase.subscribe(allocation => {
      this.resourceAssignmentService.deleteResourceAssignmentFromCase(allocation.allocationId, this.dialogRef, this.projectDialogRef);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(allocation.resourceAllocation);
    });

    this.bsModalRef.content.openBackFillPopUp.subscribe(result => {
      this.backfillDialogService.dialogRef = this.dialogRef;
      this.backfillDialogService.projectDialogRef = this.projectDialogRef;
      this.backfillDialogService.openBackFillFormHandler(result);
    });

    this.bsModalRef.content.openOverlappedTeamsPopup.subscribe(result => {
      this.overlappedTeamDialogService.dialogRef = this.dialogRef;
      this.overlappedTeamDialogService.projectDialogRef = this.projectDialogRef;
      this.overlappedTeamDialogService.openOverlappedTeamsFormHandler(result);
    });

  }

}
