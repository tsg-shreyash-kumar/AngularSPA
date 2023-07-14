import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { ResourceFiltersBasicMenu } from 'src/app/shared/interfaces/resource-filters-basic-menu.interface';
import { SortRow } from 'src/app/shared/interfaces/sort-row.interface';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.scss']
})
export class SortByComponent implements OnInit {

  @Input() menuPosition: string = "down";
  @Input() showHeader: boolean = true;
  @Input()
  set rowsToEdit(value: SortRow[]) {
    this._rowsToEdit = value;
    this.sortRows = this._rowsToEdit;
  }
  get rowsToEdit() {
    return this._rowsToEdit;
  }

  public _rowsToEdit: SortRow[];

  sortRows: SortRow[] = [];

  sortFieldOptions: ResourceFiltersBasicMenu[] = [
    { label: "Employee", value: "fullName", selected: false },
    { label: "Position", value: "position", selected: false },
    { label: "Level", value: "levelGrade", selected: false },
    { label: "Office", value: "office", selected: false },
    { label: "Availability Percentage", value: "percentAvailable", selected: false },
    { label: "Date", value: "dateFirstAvailable", selected: false },
    { label: "Hire Date", value: "startDate", selected: false },
    { label: "Last Staffed on Billable", value: 'lastBillableDate', selected: false }
  ];

  sortDirectionOptions: ResourceFiltersBasicMenu[] = [
    { label: "Ascending", value: "asc", selected: true },
    { label: "Descending", value: "desc", selected: false }
  ]

  constructor(private notifyService: NotificationService) { }

  ngOnInit(): void {
    if (this.rowsToEdit) {
      this.sortRows = this.rowsToEdit;
    } else {
      this.sortRows = [];
    }
  }

  handleSortingFieldSelection(field: ResourceFiltersBasicMenu, sortRow: number) {
    this.sortFieldOptions.forEach((option) => {
      if (option.value == field.value) {
        option.selected = true;
        this.sortRows[sortRow].field = option.value;
      } else {
        option.selected = false;
      }
    });
  }

  handleSortingDirectionelection(direction: ResourceFiltersBasicMenu, sortRow: number) {
    this.sortDirectionOptions.forEach((option) => {
      if (option.value == direction.value) {
        option.selected = true;
        this.sortRows[sortRow].direction = option.value;
      } else {
        option.selected = false;
      }
    });
  }

  // Add new sort row
  addSortRow() {
    this.sortRows.push(
      { field: "", direction: "asc" }
    );
  }

  // Delete single or all sort row(s)
  deleteRow(index) {
    this.sortRows.splice(index, 1);
  }
  deleteAll() {
    this.sortRows = [];
    this.toggleToastNotification("All sort conditions have been deleted.");
  }

  // Drop sort row
  drop(event: CdkDragDrop<string[]>) {
    try {
      moveItemInArray(this.sortRows, event.previousIndex, event.currentIndex);
    } catch (e) {
      console.error("Error moving sort row", e);
    }
  }

  toggleToastNotification(message: string) {
    this.notifyService.showSuccess(message);
  }
}
