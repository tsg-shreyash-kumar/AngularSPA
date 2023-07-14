import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { PlanningCard } from 'src/app/shared/interfaces/planningCard.interface';
import { SharePlanningCardComponent } from 'src/app/shared/share-planning-card/share-planning-card.component';

@Injectable()
export class SharePlanningCardDialogService {
  sharedPlanningCard = new Subject();

  constructor(private modalService: BsModalService) { }

  setSharedPlanningCardData(value) {
    this.sharedPlanningCard.next(value);
  }

  getSharedPlanningCardData(): Observable<any> {
    return this.sharedPlanningCard.asObservable();
  }

  openSharePlanningCardDialogHandler(planningCard: PlanningCard) {
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        modalHeaderText: 'Share Planning Card',
        planningCard: planningCard
      }
    };

    const bsModalRef = this.modalService.show(SharePlanningCardComponent, config);

    bsModalRef.content.sharePlanningCardEmitter.subscribe(
      (event) => {
        this.setSharedPlanningCardData(event);
      });

  }
}
