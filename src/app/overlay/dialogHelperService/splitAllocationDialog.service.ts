// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';

// ----------------------- Component/Service References ----------------------------------//
import { AgGridSplitAllocationPopUpComponent } from '../ag-grid-split-allocation-pop-up/ag-grid-split-allocation-pop-up.component';
import { ProjectOverlayComponent } from '../project-overlay/project-overlay.component';
import { ResourceOverlayComponent } from '../resource-overlay/resource-overlay.component';
import { ResourceAssignmentService } from '../behavioralSubjectService/resourceAssignment.service';

// --------------------------utilities -----------------------------------------//
import { MatDialogRef } from '@angular/material/dialog';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable()
export class SplitAllocationDialogService {

  constructor(private modalService: BsModalService,
    private resourceAssignmentService: ResourceAssignmentService ) { }

  // --------------------------Local Variable -----------------------------------------//

  bsModalRef: BsModalRef;
  projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
  dialogRef: MatDialogRef<ResourceOverlayComponent, any>;
  // --------------------------Overlay -----------------------------------------//
  
  openSplitAllocationDialogHandler(event) {
    // check if the popup is already open
    if (!this.bsModalRef) {
      // class is required to center align the modal on large screens
      const config = {
        class: 'modal-dialog-centered',
        ignoreBackdropClick: true,
        initialState: {
          allocationData: event.allocationData,
          popupType: event.popupType
        }
      };
      this.bsModalRef = this.modalService.show(AgGridSplitAllocationPopUpComponent, config);

      // inserts & updates resource data when changes are made to notes of an allocation
      this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(upsertData => {
        this.resourceAssignmentService.upsertResourceAllocationsToProject(upsertData, this.dialogRef, this.projectDialogRef);
        this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(upsertData.resourceAllocation);
      });

      //clear bsModalRef value on closing modal
      this.modalService.onHidden.subscribe(() => {
        this.bsModalRef = null;
      });
    }
  }
  

}
