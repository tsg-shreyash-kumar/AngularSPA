// ----------------------- Angular Package References ----------------------------------//
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, OnChanges, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
// import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

// --------------------------Interfaces -----------------------------------------//
import { SupplyFilterCriteria } from 'src/app/shared/interfaces/supplyFilterCriteria.interface';
import { ResourceAllocation } from 'src/app/shared/interfaces/resourceAllocation.interface';
import { Commitment } from 'src/app/shared/interfaces/commitment.interface';
import { EmployeeCaseGroupingEnum } from 'src/app/shared/constants/enumMaster';
import { GanttBodyComponent } from '../gantt-body/gantt-body.component';
import { Observable, merge, Subscription } from 'rxjs';

@Component({
  selector: 'resources-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit, OnChanges {

  public isLeftSideBarCollapsed = false;
  public objGanttCollapsedRows = {
    isAllCollapsed : false,
    exceptionRowIndexes: []
  };

  public employeeCaseGroupingEnum  = EmployeeCaseGroupingEnum;
  public isTopbarCollapsed: boolean = true;

  // -----------------------Input Events-----------------------------------------------//

  @Input() scrollDistance: number; // how much percentage the scroll event should fire ( 2 means (100 - 2*10) = 80%)
  @Input() resourcesStaffing: any;
  @Input() supplyFilterCriteriaObj: SupplyFilterCriteria;
  @Input() dateRange: [Date, Date];
  @Input() selectedCommitmentTypes: string[];
  @Input() thresholdRangeValue; // Threshold Input
  @Input() selectedEmployeeCaseGroupingOption: string;

  // ------------------------Output Events--------------------------------------------//

  @Output() updateResourceAssignmentToProject = new EventEmitter<ResourceAllocation>();
  @Output() upsertResourceAllocationsToProject = new EventEmitter<ResourceAllocation[]>();
  @Output() updateResourceCommitment = new EventEmitter<Commitment>();
  @Output() openQuickAddForm = new EventEmitter<any>();
  @Output() openResourceDetailsDialog = new EventEmitter();
  @Output() openSplitAllocationPopup = new EventEmitter();
  @Output() loadMoreResourcesEmitter = new EventEmitter();
  @Output() openCaseDetailsDialog = new EventEmitter();
  @Output() upsertResourceViewNote = new EventEmitter<any>();
  @Output() deleteResourceViewNotes = new EventEmitter<any>();
  @Output() ganttBodyLoadedEmitter = new EventEmitter();
  @Output() openOverlappedTeamsForm = new EventEmitter<any>();

  //------------------------Referenced by Parent--------------------------------------------//
  @ViewChild('ganttContainer', { static: false }) ganttContainer: ElementRef; //used by parent to reset scrolling
  @ViewChildren(GanttBodyComponent) caseGroupRowComponents: QueryList<GanttBodyComponent>;

  childrenDetector: Observable<any>;
  private _subscription:Subscription;

  constructor() { }

  trackById(index: number, item: any): number {
    return item.trackById;
  }

  // ------------------------Life Cycle Events--------------------------------------------//
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.childrenDetector = merge(this.caseGroupRowComponents.changes)

    this._subscription = this.childrenDetector.subscribe(() => {
      this.ganttBodyLoadedEmitter.emit();
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.selectedEmployeeCaseGroupingOption && this.selectedEmployeeCaseGroupingOption) {
      if(this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES){
        this.objGanttCollapsedRows =  {
            isAllCollapsed : true,
            exceptionRowIndexes : []
        };
      }else{
        this.objGanttCollapsedRows =  {
          isAllCollapsed : false,
          exceptionRowIndexes : []
      };
      }

      this.isTopbarCollapsed = this.objGanttCollapsedRows.isAllCollapsed;
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  // Export functionality: future requirements, should not be removed
  // ganttBodyLoadedEmitterHandler() {
  //   this.ganttBodyLoadedEmitter.emit();
  // }

  updateResourceAssignmentToProjectHandler(resourceAllocation) {
    this.updateResourceAssignmentToProject.emit(resourceAllocation);
  }

  upsertResourceAllocationsToProjectHandler(resourceAllocations) {
    this.upsertResourceAllocationsToProject.emit(resourceAllocations);
  }

  updateResourceCommitmentHandler(resourceCommitment) {
    this.updateResourceCommitment.emit(resourceCommitment);
  }

  openQuickAddFormHandler(event) {
    this.openQuickAddForm.emit(event);
  }
  openResourceDetailsDialogHandler(event) {
    this.openResourceDetailsDialog.emit(event);
  }

  scrollEvent = (event: any): void => {
    document.dispatchEvent(new Event('click'));
  }

  openSplitAllocationPopupHandler(event) {
    this.openSplitAllocationPopup.emit(event);
  }

  openOverlappedTeamsPopupHandler(event) {
    this.openOverlappedTeamsForm.emit(event);
  }

  loadMoreResources() {
    this.loadMoreResourcesEmitter.emit();
  }

  openCaseDetailsDialogHandler(event) {
    this.openCaseDetailsDialog.emit(event);
  }


  upsertResourceViewNoteHandler(event){
    this.upsertResourceViewNote.emit(event);
  }

  deleteResourceViewNotesHandler(event){
    this.deleteResourceViewNotes.emit(event);
  }

  expandCollapseSidebarHandler(isLeftSideBarCollapsed){
    this.isLeftSideBarCollapsed = isLeftSideBarCollapsed;
  }

  expandCollapseTopbarHandler(isTopbarCollapsed){
    this.objGanttCollapsedRows = {...this.objGanttCollapsedRows, isAllCollapsed: isTopbarCollapsed };
    this.isTopbarCollapsed = isTopbarCollapsed;
  }

  
  collapseExpandIndividualCaseGroupHandler(isGroupCollapsed, rowIndex) {
    let row = document.querySelector<HTMLElement>(
      `#case-group-row-${rowIndex}`
    );

    row.classList.toggle('collapsed');
    
    this.caseGroupRowComponents.toArray()
      .filter( x=> x.rowIndex === rowIndex)
      .map(y =>{
        y.isRowCollapsed = !isGroupCollapsed;
        y.ganttResourceComponent.isRowCollapsed = !isGroupCollapsed;
        y.ganttTaskomponent.isRowCollapsed = !isGroupCollapsed;
    });
    
  }
}
