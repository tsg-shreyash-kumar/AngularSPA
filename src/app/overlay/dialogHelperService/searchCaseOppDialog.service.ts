import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { SearchCaseOppComponent } from 'src/app/shared/search-case-opp/search-case-opp.component';

@Injectable()
export class SearchCaseOppDialogService {
    searchCaseOppDialogRef: MatDialogRef<SearchCaseOppComponent, any>;
    bsModalRef: BsModalRef;
    selectedCaseOppPlanningCard = new Subject();

    constructor(public dialog: MatDialog,
        private modalService: BsModalService) { }

    setSelectedCaseOpp(value) {
        this.selectedCaseOppPlanningCard.next(value);
    }

    getSelectedCaseOpp(): Observable<any> {
        return this.selectedCaseOppPlanningCard.asObservable();
    }

    openSearchCaseOppDialogHandler(initialConfig?) {

        const config = {
            class: 'modal-dialog-centered',
            ignoreBackdropClick: true,
            initialState: {
                modalHeaderText: 'Merge Planning Card allocation(s)',
                showMergeAndCopy : initialConfig?.showMergeAndCopy,
                searchCases: initialConfig?.searchCases,
                searchOpps: initialConfig?.searchOpps
              }
        };

        this.bsModalRef = this.modalService.show(SearchCaseOppComponent, config);

        this.bsModalRef.content.addCaseOppEmitter.subscribe(
            (selectedCaseOpp) => {
                this.setSelectedCaseOpp( selectedCaseOpp);
            });
    }
}
