// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';

// ----------------------- Component References ----------------------------------//
import { ProjectOverlayComponent } from '../project-overlay/project-overlay.component';

// ----------------------- Service References ----------------------------------//
import { BackfillDialogService } from './backFillDialog.service';
import { ResourceAssignmentService } from '../behavioralSubjectService/resourceAssignment.service';
import { ResourceCommitmentService } from '../behavioralSubjectService/resourceCommitment.service';

// --------------------------utilities -----------------------------------------//
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialogRef } from '@angular/material/dialog';
import { PlaceholderAssignmentService } from '../behavioralSubjectService/placeholderAssignment.service';
import { PlaceholderFormComponent } from 'src/app/shared/placeholder-form/placeholder-form.component';

@Injectable()
export class PlaceholderDialogService {

    constructor(private modalService: BsModalService,
        private backfillDialogService: BackfillDialogService,
        private resourceAssignmentService: ResourceAssignmentService,
        private placeholderAssignmentService: PlaceholderAssignmentService) { }

    // --------------------------Local Variable -----------------------------------------//

    bsModalRef: BsModalRef;
    projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
    // --------------------------Overlay -----------------------------------------//

    openPlaceholderFormHandler(modalData) {
        // class is required to center align the modal on large screens
        let initialState = null;

        if (modalData) {

            initialState = {
                projectData: modalData.project,
                planningCardData: modalData.planningCardData,
                placeholderAllocationData: modalData.placeholderAllocationData,
                isUpdateModal: modalData.isUpdateModal
            };

        }

        const config = {
            class: 'modal-dialog-centered',
            ignoreBackdropClick: true,
            initialState: initialState
        };

        this.bsModalRef = this.modalService.show(PlaceholderFormComponent, config);

        // inserts & updates resource data when changes are made to resource
        this.bsModalRef.content.upsertPlaceholderAllocationsToProject.subscribe(updatedCommitment => {
            this.placeholderAssignmentService.upsertPlcaeholderAllocations(updatedCommitment, null,this.projectDialogRef);
        });

        this.bsModalRef.content.deletePlaceholderAllocationByIds.subscribe(event => {
            this.placeholderAssignmentService.deletePlaceHoldersByIds(event, this.projectDialogRef);
        });

        this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(event => {
            this.resourceAssignmentService.upsertResourceAllocationsToProject(event, null, this.projectDialogRef);
            this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(event.resourceAllocation);
        });

        this.bsModalRef.content.openBackFillPopUp.subscribe(result => {
            this.backfillDialogService.projectDialogRef = this.projectDialogRef;
            this.backfillDialogService.openBackFillFormHandler(result);
        });
    }

}
