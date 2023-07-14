// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';

// ----------------------- Component References ----------------------------------//
import { ResourcesCommitmentsComponent } from 'src/app/shared/resources-commitments/resources-commitments.component';

// --------------------------utilities -----------------------------------------//
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable()
export class ResourcesCommitmentsDialogService {
  // --------------------------Local Variable -----------------------------------------//
  bsModalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  // --------------------------Overlay -----------------------------------------//

  showResourcesCommitmentsDialogHandler(employees) {
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        employees: employees
      }
    };

    this.bsModalRef = this.modalService.show(ResourcesCommitmentsComponent, config);
  }

  closeDialog() {
    this.bsModalRef?.hide();
  }

}
