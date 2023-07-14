// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';

// ----------------------- Component References ----------------------------------//
import { CaseRollFormComponent } from 'src/app/shared/case-roll-form/case-roll-form.component';
import { ProjectOverlayComponent } from '../project-overlay/project-overlay.component';

// ----------------------- Service References ----------------------------------//
import { CaseRollService } from '../behavioralSubjectService/caseRoll.service';

// --------------------------utilities -----------------------------------------//
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable()
export class CaseRollDialogService {

  constructor(private modalService: BsModalService,
    private caseRollService: CaseRollService) { }

  // --------------------------Local Variable -----------------------------------------//

  bsModalRef: BsModalRef;
  projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
  // --------------------------Overlay -----------------------------------------//

  openCaseRollFormHandler(event) {
    // class is required to center align the modal on large screens
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        project: event.project
      }
    };
    this.bsModalRef = this.modalService.show(CaseRollFormComponent, config);

    this.bsModalRef.content.upsertCaseRollAndAllocations.subscribe(response => {
      this.caseRollService.upsertCaseRollAndAllocationsHandler(response.caseRoll, response.resourceAllocations,
        this.projectDialogRef, response.project, response.allocationDataBeforeSplitting);
    });

    this.bsModalRef.content.revertCaseRollAndAllocations.subscribe(response => {
      this.caseRollService.revertCaseRollAndAllocationsHandler(response.caseRoll, response.resourceAllocations, 
        this.projectDialogRef, response.project);
    });
  }

}
