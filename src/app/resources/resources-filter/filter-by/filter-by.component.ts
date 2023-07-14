import { Component, Input, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BS_DEFAULT_CONFIG } from 'src/app/shared/constants/bsDatePickerConfig';
import { FilterRow } from 'src/app/shared/interfaces/filter-row.interface';
import { ResourceFiltersBasicMenu } from 'src/app/shared/interfaces/resource-filters-basic-menu.interface';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-filter-by',
  templateUrl: './filter-by.component.html',
  styleUrls: ['./filter-by.component.scss']
})
export class FilterByComponent implements OnInit {

  @Input() date = [Date];
  @Input() menuPosition: string = "down";
  @Input() showHeader: boolean = true;
  @Input() rowsToEdit: FilterRow[] = [];

  filterRows: FilterRow[] = [];
  andOrLabel: string = "";
  andOrOptions: ResourceFiltersBasicMenu[] = [
    { label: "and", value: "and", selected: false },
    { label: "or", value: "or", selected: false }
  ]

  filterFieldOptions: ResourceFiltersBasicMenu[] = [
    { label: "Availability %", value: "availabilityPercentage", selected: false },
    { label: "Availability Date", value: "availabilityDate", selected: false },
    { label: "Hire Date", value: "hireDate", selected: false },
    { label: "Last date staffed on billable", value: "lastDateStaffed", selected: false },
    { label: "Commitment", value: "commitment", selected: false },
    { label: "Certification", value: "certification", selected: false },
    { label: "Language", value: "language", selected: false }
  ];

  filterOperatorOptions: ResourceFiltersBasicMenu[] = [
    { label: "Contains", value: "contains", selected: false },
    { label: "Does not contain", value: "notContains", selected: false }
  ];

  filterValueOptions: ResourceFiltersBasicMenu[] = [
    { label: "Contains", value: "contains", selected: false },
    { label: "Does not contain", value: "notContains", selected: false }
  ];

  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.getData();
    this.initializeDateConfig();
  }

  getData() {
    if (this.rowsToEdit) {
      this.filterRows = this.rowsToEdit;

      this.filterRows.forEach((row, index) => {
        row.date = new Date(this.rowsToEdit[index].date);
      });
    } else {
      this.filterRows = [];
    }
  }

  initializeDateConfig() {
    this.bsConfig = Object.assign({}, BS_DEFAULT_CONFIG);
    this.bsConfig.containerClass = "theme-dark-blue calendar-dropdown calendar-align-left";
  }

  handleMenuSelection(event: ResourceFiltersBasicMenu, index: number, type: string) {
    let dataToParse = [];

    switch (type) {
      case "andOr":
        dataToParse = this.andOrOptions;
        this.andOrLabel = event.value;
        this.filterRows.forEach((row) => {
          row.andOr = event.value
        });
        break;
      case "field":
        dataToParse = this.filterFieldOptions;
        this.filterRows[index].field = event.value;
        break;
      case "operator":
        dataToParse = this.filterOperatorOptions;
        this.filterRows[index].operator = event.value;
        break;
      case "value":
        dataToParse = this.filterValueOptions;
        this.filterRows[index].value = event.value;
        break;
    };

    dataToParse.forEach((option) => {
      if (option.value == event.value) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
  }

  onDateChange(selectedDate, index) {
    // To avoid API call during initialization we check for non nullable start and end dates
    if (!selectedDate || this.filterRows[index].date.toString() == selectedDate.toString()) {
      return;
    }

    this.filterRows[index].date = selectedDate;
  }

  // Add new filter row
  addFilterRow() {
    if (this.filterRows.length > 1) {
      this.filterRows.push(
        { andOr: this.andOrLabel, field: "", operator: "", value: "", date: "" }
      );
    } else {
      this.filterRows.push(
        { andOr: "", field: "", operator: "", value: "", date: "" }
      );
    }
  }

  // Delete single or all filter row(s)
  deleteRow(index) {
    this.filterRows.splice(index, 1);
  }
  deleteAll() {
    this.filterRows = [];
    this.toggleToastNotification("All filter conditions have been deleted.");
  }

  toggleToastNotification(message: string) {
    this.notifyService.showSuccess(message);
  }
}
