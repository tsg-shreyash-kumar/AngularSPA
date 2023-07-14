import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Project } from "src/app/shared/interfaces/project.interface";
import { ProjectBasic } from "src/app/shared/interfaces/project.interface";

@Component({
  selector: "resources-case",
  templateUrl: "./case.component.html",
  styleUrls: ["./case.component.scss"]
})
export class CaseComponent implements OnInit {
   // -----------------------Input Events-----------------------------------------------//
  @Input() case: ProjectBasic;
  @Input() rowIndex = "";
  @Input() isCaseGroupCollapsed: boolean;
  @Input() projectmembers: Project[];
  
  // -----------------------Output Events-----------------------------------------------//
  @Output() collapseExpandCaseGroupEmitter = new EventEmitter<boolean>();
  @Output() openOverlappedTeamsPopup = new EventEmitter<any>();

  // -----------------------Life Cycle Events-----------------------------------------------//
  constructor(
  ) { }

  
  ngOnInit() {
  }

  // -----------------------Event Handlers-----------------------------------------------//
  toggleExpandCollapseCaseGroup(){
    this.isCaseGroupCollapsed = !this.isCaseGroupCollapsed;
    this.collapseExpandCaseGroupEmitter.emit(this.isCaseGroupCollapsed);
  }

  openPersistentTeamPopupHandler(){
    const modalData = {
      projectData: this.case,
      overlappedTeams : null,
      allocation: this.projectmembers[0].allocations[0]
    };

    this.openOverlappedTeamsPopup.emit(modalData);
  }

  // private expandRow(rowElement: HTMLElement = null, resourceElement: HTMLElement = null) {
  //   // Row Element "tr"
  //   if (!rowElement) {
  //     rowElement = document.querySelector<HTMLElement>(
  //       `#gantt-row-${this.rowIndex}`
  //     );
  //   }

  //   // Element that was clicked
  //   if (!resourceElement) {
  //     resourceElement = document.querySelector<HTMLElement>(
  //       `#btn-expand-collapse-${this.rowIndex}`
  //     );
  //   }

  //   // People Wrapper
  //   const peopleWrapperElement = document.querySelector<HTMLElement>(
  //     `#gantt-row-${this.rowIndex} .people-wrapper`
  //   );

  //   // Utilization Rows
  //   const utilizationRowsElement = document.querySelector<HTMLElement>(
  //     `#utilization-index-${this.rowIndex}`
  //   );

  //   let elements: HTMLElement[] = []
  //   elements.push(rowElement, resourceElement, utilizationRowsElement, peopleWrapperElement);

  //   CommonService.toggleClass(elements, 'collapsed');
  // }

}
