// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';

// ----------------------- Component References ----------------------------------//
import { BackfillFormComponent } from 'src/app/shared/backfill-form/backfill-form.component';
import { ProjectOverlayComponent } from '../project-overlay/project-overlay.component';
import { ResourceOverlayComponent } from '../resource-overlay/resource-overlay.component';

// ----------------------- Service References ----------------------------------//
import { ResourceAssignmentService } from '../behavioralSubjectService/resourceAssignment.service';

// --------------------------utilities -----------------------------------------//
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material/dialog';
import { PlaceholderAssignmentService } from '../behavioralSubjectService/placeholderAssignment.service';

@Injectable()
export class BackfillDialogService {

  constructor(private modalService: BsModalService,
    private resourceAssignmentService: ResourceAssignmentService,
    private placeholderAssignmentService: PlaceholderAssignmentService ) { }

  // --------------------------Local Variable -----------------------------------------//

  bsModalRef: BsModalRef;
  projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
  dialogRef: MatDialogRef<ResourceOverlayComponent, any>;
  // --------------------------Overlay -----------------------------------------//
  
  openBackFillFormHandler(event) {
    // class is required to center align the modal on large screens
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        project: event.project,
        resourceAllocation: event.resourceAllocation,
        showMoreThanYearWarning: event.showMoreThanYearWarning,
        isPlaceholderAllocation: event.isPlaceholderAllocation,
        allocationDataBeforeSplitting: event.allocationDataBeforeSplitting
      }
    };
    this.bsModalRef = this.modalService.show(BackfillFormComponent, config);

    this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(data => {
      event.project.allocatedResources = event.project.allocatedResources.concat(data.resourceAllocation);
      this.resourceAssignmentService.upsertResourceAllocationsToProject(data, this.dialogRef, this.projectDialogRef);    
      this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(data.resourceAllocation);
    });

    this.bsModalRef.content.deletePlaceHoldersByIds.subscribe(event => {
      this.placeholderAssignmentService.deletePlaceHoldersByIds(event);
    });

  }

  closeDialog(){
    this.bsModalRef?.hide();
  }

}
