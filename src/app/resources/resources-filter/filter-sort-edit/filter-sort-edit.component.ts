import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SortByComponent } from '../sort-by/sort-by.component';
import { FilterByComponent } from '../filter-by/filter-by.component';
import { NotificationService } from 'src/app/shared/notification.service';
import { SortRow } from 'src/app/shared/interfaces/sort-row.interface';

@Component({
  selector: 'app-filter-sort-edit',
  templateUrl: './filter-sort-edit.component.html',
  styleUrls: ['./filter-sort-edit.component.scss']
})
export class FilterSortEditComponent implements OnInit {

  @ViewChild("editSortBy", { static: false }) sortByComponent: SortByComponent;
  @ViewChild("editFilterBy", { static: false }) filterByComponent: FilterByComponent;

  @Input() type: string;
  @Input()
  set sortRows(value: SortRow[]) {
    this._sortRows = value;
    this.getOptionsData();
  }
  get sortRows() {
    return this._sortRows;
  }
  @Input() filterRows: any[] = [];

  @Output() applyChangesEmitter = new EventEmitter();

  _sortRows: SortRow[];
  showHeader: boolean = false;
  isDropdownOpen: boolean = false;
  label: string = "";
  lengthOfArray: number = 0;

  constructor(private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.getOptionsData();
  }

  getOptionsData() {
    switch (this.type) {
      case "sort":
        this.label = "Sort";
        this.lengthOfArray = this.sortRows.length;
        break;
      case "filter":
        this.label = "Filter";
        this.lengthOfArray = this.filterRows.length;
        break;
    }
  }

  toggleDropdownMenu() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Delete all
  deleteAll() {
    if (this.type == 'sort') {
      this.sortRows = [];
      this.applyChangesEmitter.emit({ type: this.type, data: this.sortRows });
    } else if (this.type == 'filter') {
      this.filterRows = [];
      this.applyChangesEmitter.emit({ type: this.type, data: this.filterRows });
    } else {
      return;
    }

    this.getOptionsData();
    this.notifyService.showSuccess(`Your ${this.type} options have been deleted.`);
    this.toggleDropdownMenu();
  }

  // Apply changes
  apply() {
    if (this.type == 'sort') {
      this.sortRows = this.sortByComponent.sortRows;
      this.applyChangesEmitter.emit({ type: this.type, data: this.sortRows });
    } else if (this.type == 'filter') {
      this.filterRows = this.filterByComponent.filterRows;
      this.applyChangesEmitter.emit({ type: this.type, data: this.filterRows });
    } else {
      return;
    }

    this.getOptionsData();
    this.notifyService.showSuccess(`Your ${this.type} changes have been applied.`);
    this.toggleDropdownMenu();
  }
}
