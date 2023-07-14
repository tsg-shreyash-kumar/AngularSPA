import { Component, EventEmitter, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DemandNotesModalComponent } from '../demand-notes-modal/demand-notes-modal.component';
import { ProjectType } from 'src/app/shared/constants/enumMaster';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ResourceOrCasePlanningViewNote } from 'src/app/shared/interfaces/resource-or-case-planning-view-note.interface';

@Component({
  selector: 'app-ag-grid-note-cell-renderer',
  templateUrl: './ag-grid-note-cell-renderer.component.html',
  styleUrls: ['./ag-grid-note-cell-renderer.component.scss']
})
export class AgGridNoteCellRendererComponent implements ICellRendererAngularComp {

  @Output() updatePlanningCardEmitter = new EventEmitter();
  @Output() updateProjectChanges = new EventEmitter();
  @Output() openNotesModal = new EventEmitter();

  params;
  project: any;
  noteIcon: string = "";
  latestNoteData: any;
  public latestNote: string = "";
  projectNameWithPriority: string = "";
  public caseNotes: ResourceOrCasePlanningViewNote[] = [];


  constructor(private modalService: BsModalService) { }

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.project = params.data;
    this.latestNoteData = params.data.latestCasePlanningBoardViewNote;
    if (this.latestNoteData) {
      this.latestNote = this.latestNoteData.note?.toString();
    }
    this.getNotesIcon();

    if (!this.project.type) {
      this.project.type = ProjectType.PlanningCard;
    }

    this.projectNameWithPriority = this.project.clientName || this.project.name || this.project.projectName;
    if (this.project.clientPriority) {
      this.projectNameWithPriority += ` (${this.project.clientPriority})`;
    }
  }

  getNotesIcon() {
    this.noteIcon = this.latestNote.length ? "assets/img/red-notes-icon.svg" : "assets/img/add-note-icon.svg";
  }

  // Toggle New Note Modal
  toggleNoteModal() {
    this.openNotesModal.emit(this.project);
  }

  refresh(): boolean {
    return true;
  }
}
