// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from "@angular/core";

// ----------------------- Service References ----------------------------------//
import { ResourceAssignmentService } from "../behavioralSubjectService/resourceAssignment.service";

// ----------------------- Component References ----------------------------------//
import { ProjectOverlayComponent } from "../project-overlay/project-overlay.component";
import { ResourceOverlayComponent } from "../resource-overlay/resource-overlay.component";
import { OverlappedTeamsFormComponent } from "src/app/shared/overlapped-teams-form/overlapped-teams-form.component";

// --------------------------utilities -----------------------------------------//
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { MatDialogRef } from "@angular/material/dialog";

@Injectable()
export class OverlappedTeamDialogService {

    constructor(private modalService: BsModalService,
        private resourceAssignmentService: ResourceAssignmentService) { }

    // --------------------------Local Variable -----------------------------------------//

    bsModalRef: BsModalRef;
    projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
    dialogRef: MatDialogRef<ResourceOverlayComponent, any>;

    // --------------------------Overlay -----------------------------------------//

    openOverlappedTeamsFormHandler(modalData) {
        // class is required to center align the modal on large screens
        let initialState = null;

        if (modalData) {

            initialState = {
                projectData: modalData.projectData,
                overlappedTeams: modalData.overlappedTeams,
                allocation: modalData.allocation
            };

        }

        const config = {
            class: 'modal-dialog-centered',
            ignoreBackdropClick: true,
            initialState: initialState
        };

        this.bsModalRef = this.modalService.show(OverlappedTeamsFormComponent, config);

        // inserts & updates resource data when changes are made to resource
        this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(updatedCommitment => {
            this.resourceAssignmentService.upsertResourceAllocationsToProject(updatedCommitment, this.dialogRef, this.projectDialogRef);
            this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(updatedCommitment.resourceAllocation);
        });

    }
}
