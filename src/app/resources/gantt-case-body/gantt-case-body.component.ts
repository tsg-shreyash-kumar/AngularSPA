// ----------------------- Angular Package References ----------------------------------//
import {
    Component,
    OnInit,
    Input,
    OnChanges,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    SimpleChanges  } from "@angular/core";
  
  // ----------------------- Component References ----------------------------------//
  
  // --------------------------Interfaces -----------------------------------------//
  import { ResourceStaffing } from "src/app/shared/interfaces/resourceStaffing.interface";
  // ----------------------- Service References ----------------------------------//
  import { BsModalService } from "ngx-bootstrap/modal";
  import { PopupModalComponent } from "../popup-modal/popup-modal.component";
  import * as moment from "moment";
  import { StaffingCommitment } from "src/app/shared/interfaces/staffingCommitment.interface";
  import { ResourceAllocation } from "src/app/shared/interfaces/resourceAllocation.interface";

  @Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "[resources-gantt-case-body]",
    templateUrl: "./gantt-case-body.component.html",
    styleUrls: ["./gantt-case-body.component.scss"]
  })
  export class GanttCaseBodyComponent implements OnInit, OnChanges {
    public isCaseGroupCollapsed = false;
    className = "";
    public commitmentDurationInDays: any;
    offsetLeft;
    gridSize = 32; 
    gridCellMargin = 6;
    numClicks = 0;
  
    // -----------------------Input Events-----------------------------------------------//
  
    @Input() resourceStaffing: any;
    @Input() isLeftSideBarCollapsed = false;
    @Input() objGanttCollapsedRows;
    @Input() rowIndex: number;
    @Input() commitment: StaffingCommitment;
    @Input() dateRange: [Date, Date];
  
    // ------------------------Output Events---------------------------------------
    @Output() collapseExpandCaseGroupEmitter = new EventEmitter<boolean>();
    @Output() openQuickAddForm = new EventEmitter<any>();
    @Output() openOverlappedTeamsForm = new EventEmitter<any>();

    constructor(
      private modalService: BsModalService
    ) {}
  
    ngOnInit() {
      this.setCommitmentClasses();
    }

    ngOnChanges(changes: SimpleChanges) {
  
      if (changes.objGanttCollapsedRows && this.objGanttCollapsedRows) {
        this.isCaseGroupCollapsed = this.objGanttCollapsedRows.isAllCaseGroupsCollapsed;
      }
    }

    collapseExpandCaseGroupHandler(isCaseGroupCollapsed) {
      this.isCaseGroupCollapsed = isCaseGroupCollapsed;
      this.collapseExpandCaseGroupEmitter.emit(isCaseGroupCollapsed);

    }

    openMembersPopup(event,caseDetails, members){
      //DO not open pop-up for NOT Allocated case group
      if(caseDetails.oldCaseCode === "NA" || caseDetails.clientName === "Not Allocated")
        return;

      const positionObj = {
          top: event.clientY,
          left: event.clientX,
          right: 0
        };

        let memberCommitments = [];

        members.forEach( x=>{
          const allocations = x.allocations.filter( y=> (y.oldCaseCode && y.oldCaseCode === caseDetails.oldCaseCode) || (y.pipelineId && y.pipelineId === caseDetails.pipelineId));

          allocations.forEach( z => {
            memberCommitments.push({
              commitmentTypeName: 'Resource',
              employeeName: x.resource.fullName,
              startDate: z.startDate,
              endDate: z.endDate,
              allocation: z.allocation
            });
          });
        });

        this.openPopUpDialogHandler({positionObj, commitment: memberCommitments})
    }

    openPopUpDialogHandler(event) {
      const windowWidth = window.innerWidth;
      const positionObj = event.positionObj;
      const commitmentsData = event.commitment;
  
      let classToUse = `commitments-detail-popup left-${positionObj.left} top-${positionObj.top}`;
  
      if (windowWidth - positionObj.left < 270) {
        positionObj.right = windowWidth - positionObj.left;
        positionObj.left = 0;
        classToUse = `commitments-detail-popup right-${positionObj.right} top-${positionObj.top}`;
      }
  
      this.modalService.show(PopupModalComponent, {
        animated: true,
        backdrop: false,
        ignoreBackdropClick: false,
        initialState: {
          commitments: commitmentsData
        },
        class: classToUse
      });
    }

    private setCommitmentClasses(reAdjustClass = false, $event = null) {

      const caseStartDate = this.resourceStaffing.caseDetails?.startDate;
      const caseEndDate = this.resourceStaffing.caseDetails?.endDate;
      let startCount = 0;
      const commitmentStartDate = moment(caseStartDate).startOf(
        "day"
      );
      const dateRangeStartDate = moment(this.dateRange[0]).startOf("day");
      const commitmentEndDate = moment(caseEndDate).startOf(
        "day"
      );
      const dateRangeEndDate = moment(this.dateRange[1]).startOf("day");
      this.commitmentDurationInDays = commitmentEndDate.diff(
        commitmentStartDate,
        "days"
      );
  
      if (commitmentStartDate.isAfter(dateRangeStartDate)) {
        startCount =
          commitmentStartDate.diff(dateRangeStartDate, "days") + 1;
      }
  
      const end = commitmentEndDate.isAfter(dateRangeEndDate)
        ? dateRangeEndDate
        : commitmentEndDate;
      const start = commitmentStartDate.isAfter(dateRangeStartDate)
        ? commitmentStartDate
        : dateRangeStartDate;
      const duration = end.diff(start, "days") + 1;
      //this.commitment["duration"] = duration;
      if (reAdjustClass) {
        this.offsetLeft =
          (startCount - 1) * this.gridSize + this.gridCellMargin;
        $event.host.classList.add(`duration-${duration}`);
      }
  
      let border = "";
      this.className =
        "start-" +
        startCount +
        " duration-" +
        duration +
        " commitment-" 
        " " +
        border;
    } 

    openOverlappedTeamsPopupHandler(event) {
      this.openOverlappedTeamsForm.emit(event);
    }
  }
