import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { Resource } from "src/app/shared/interfaces/resource.interface";
import { ProfileImageService } from "src/app/shared/services/profileImage.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { PopupModalComponent } from "../popup-modal/popup-modal.component";
import { CommitmentType as CommitmentTypeCodeEnum, EmployeeCaseGroupingEnum, NoteTypeCode } from "src/app/shared/constants/enumMaster";
import { ResourceOrCasePlanningViewNote } from "src/app/shared/interfaces/resource-or-case-planning-view-note.interface";
import { DateService } from "src/app/shared/dateService";
import { ConstantsMaster } from "src/app/shared/constants/constantsMaster";
import { CoreService } from "src/app/core/core.service";
import { CommonService } from "src/app/shared/commonService";

@Component({
  selector: "resources-resource",
  templateUrl: "./resource.component.html",
  styleUrls: ["./resource.component.scss"],
  providers: [ProfileImageService]
})
export class ResourceComponent implements OnInit, OnChanges {
   // -----------------------Input Events-----------------------------------------------//
  @Input() resource: Resource;
  @Input() rowIndex = "";
  @Input() commitments = [];
  @Input() resourceViewNotes: ResourceOrCasePlanningViewNote[] = [];
  @Input() objGanttCollapsedRows;
  @Input() selectedEmployeeCaseGroupingOption: string;

  // -----------------------Output Events-----------------------------------------------//
  @Output() openResourceDetailsDialog = new EventEmitter();
  @Output() upsertResourceViewNote = new EventEmitter<any>();
  @Output() deleteResourceViewNotes = new EventEmitter<any>();
  @Output() expandCollapseGanttRow = new EventEmitter<boolean>();

  isRowCollapsed: boolean = false;
  public lastBillableDate: string;
  accessibleFeatures = ConstantsMaster.appScreens.feature;
  isNotesReadonly: boolean = false;

  constructor(
    private profileImageService: ProfileImageService,
    private modalService: BsModalService,
    private coreService: CoreService
  ) { }

  ngOnInit() {
    this.isNotesReadonly = !this.isNotesAccessible();
    this.setLastBillableDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes.isTopbarCollapsed) {
    //   this.isRowCollapsed = changes.isTopbarCollapsed.currentValue;
    // }
    if (changes.objGanttCollapsedRows && this.objGanttCollapsedRows) {
      if(this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES){
            this.isRowCollapsed = true;
      }else{
          this.isRowCollapsed = this.objGanttCollapsedRows.exceptionRowIndexes.includes(this.resource.employeeCode)
          ? !this.objGanttCollapsedRows.isAllCollapsed : this.objGanttCollapsedRows.isAllCollapsed;
      }
    }
  }

  // Open Commitments Detail Popup
  openCommitmentsDetailPopup(event, commitments) {
    const positionObj = {
      top: event.clientY,
      left: event.clientX
    };

    this.modalService.show(PopupModalComponent, {
      animated: true,
      backdrop: false,
      ignoreBackdropClick: false,
      initialState: {
        commitments: commitments.filter(x => x.commitmentTypeCode === CommitmentTypeCodeEnum.PEG)
      },
      class: `commitments-detail-popup left-${positionObj.left} top-${positionObj.top}`
    });
  }

  showPegIcon(commitments): boolean {
    return commitments.some(this.checkPegAllocation);
  }

  checkPegAllocation(commitment) {
    return commitment.commitmentTypeCode === CommitmentTypeCodeEnum.PEG;
  }

  getImageUrl() {
    this.profileImageService.getImage(this.resource.profileImageUrl);
    this.profileImageService.imgUrl.subscribe((imgUrl) => {
      this.resource.profileImageUrl = imgUrl;
    });
  }

  openResourceDetailsDialogHandler(employeeCode) {
    this.openResourceDetailsDialog.emit(employeeCode);
  }

  // Expand & Collapse Row
  toggleExpandCollapse(event, rowIndex) {
    this.isRowCollapsed = !this.isRowCollapsed;
    this.expandCollapseGanttRow.emit(this.isRowCollapsed);
  }

  setLastBillableDate() {
    this.lastBillableDate = DateService.convertDateInBainFormat(this.resource.lastBillable?.lastBillableDate);

    var date = new Date();
    date.setDate(date.getDate() + 1);

    if (!this.lastBillableDate) {
      this.lastBillableDate = 'N/A';
    }
    else if (DateService.isSameOrAfter(this.lastBillableDate, date)) {
      this.lastBillableDate = 'Staffed'
    }
  }

  upsertResourceViewNoteHandler(event){
    let noteToBeUpserted : ResourceOrCasePlanningViewNote = {
      id: event.id,
      note: event.note,
      employeeCode: this.resource.employeeCode,
      lastUpdated: event.lastUpdated,
      createdBy: event.createdBy,
      createdByName: event.createdByName,
      sharedWith: event.sharedWith,
      sharedWithDetails: event.sharedWithDetails,
      isPrivate: event.isPrivate,
      noteTypeCode: NoteTypeCode.RESOURCE_ALLOCATION_NOTE,   
      lastUpdatedBy: event.lastUpdatedBy
    }
    this.upsertResourceViewNote.emit(noteToBeUpserted);
  }

  deleteResourceViewNotesHandler(event){
    this.deleteResourceViewNotes.emit(event);
  }

  isNotesAccessible() {
    const featureName = this.accessibleFeatures.addResourceViewNotes;

    const accessibleFeaturesForUser = this.coreService.loggedInUserClaims.FeatureAccess;
    const isAccessable = CommonService.isAccessToFeatureReadOnlyOrNone(featureName, accessibleFeaturesForUser);
    return isAccessable;
  }

}
