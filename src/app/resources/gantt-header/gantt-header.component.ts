// ----------------------- Angular Package References ----------------------------------//
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";

// --------------------------Interfaces -----------------------------------------//
import { SortKey } from "src/app/shared/interfaces/sortKey.interface";

// ----------------------- Service References ----------------------------------//
import { DateService } from "src/app/shared/dateService";
import { EmployeeCaseGroupingEnum } from "src/app/shared/constants/enumMaster";

@Component({
  selector: "[resources-gantt-header]",
  templateUrl: "./gantt-header.component.html",
  styleUrls: ["./gantt-header.component.scss"]
})
export class GanttHeaderComponent implements OnInit, OnChanges {
  public perDayDate = [];
  public isLeftSideBarCollapsed = false;
  public isTopbarCollapsed = false;

  public leftSideHeaders : SortKey[] = [];

  public employeeHeaders: SortKey[] = [
    { label: "Employee", id: "fullName" , sortDirection : ''},
    { label: "Position", id: "position" , sortDirection : ''},
    { label: "Lvl", id: "levelGrade", sortDirection : '' },
    { label: "Off", id: "office", sortDirection : '' },
    { label: "%", id: "percentAvailable", sortDirection : '' },
    { label: "Date", id: "dateFirstAvailable", sortDirection : '' }
  ];

    public caseCodeHeaders: SortKey[] = [
        { label: "Client", id: "client", sortDirection : '' },
        { label: "Code", id: "caseCode", sortDirection : '' },
        { label: "Start", id: "startDate", sortDirection : '' },
        { label: " ", id: " ", sortDirection : '' },
        { label: "End", id: "endDate", sortDirection : '' },
        { label: " ", id: " ", sortDirection : '' }
    ];

// -----------------------Input Variables-----------------------------------------------//
  @Input() dateRange: [Date, Date];
  @Input() selectedEmployeeCaseGroupingOption: string;

// ------------------------Output Events--------------------------------------------//
  @Output() expandCollapseSidebarEmitter = new EventEmitter();
  @Output() expandCollapseTopbarEmitter = new EventEmitter();

  constructor() {}

  // ------------------------Lief Cycle Events--------------------------------------------//
  ngOnInit() {
    this.setGanttHeaders();
  }

  ngOnChanges(changes: SimpleChanges) {
      
    if (changes.dateRange && this.dateRange) {
      this.perDayDate = [];
      this.setPerDayInfo();
    }

    if (changes.selectedEmployeeCaseGroupingOption && changes.selectedEmployeeCaseGroupingOption.currentValue) {
      this.setGanttHeaders();
    }
  }

  // ------------------------Private Helper Methods--------------------------------------------//
  setGanttHeaders(){
    if(this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES){
        this.leftSideHeaders =  this.caseCodeHeaders;
        this.isTopbarCollapsed = true;
    }else{
        this.leftSideHeaders =  this.employeeHeaders;
        this.isTopbarCollapsed = false;
    }
  }

  // Collapse & Expand All Rows
  expandCollapseAllRows() {
    this.isTopbarCollapsed = !this.isTopbarCollapsed;
    this.expandCollapseTopbarEmitter.emit(this.isTopbarCollapsed);
  }

  // Collapse Left Sidebar
  expandCollapseSidebar(event) {
    this.isLeftSideBarCollapsed = !this.isLeftSideBarCollapsed;
    this.expandCollapseSidebarEmitter.emit(this.isLeftSideBarCollapsed);

  }

  setPerDayInfo() {
      const projectStartDate = DateService.getFormattedDate(this.dateRange[0]);
      const projectEndDate = DateService.getFormattedDate(this.dateRange[1]);
      let datesBetweenRange = DateService.getDates(
          projectStartDate,
          projectEndDate
      );
      datesBetweenRange.forEach((date, index, selectedDates) => {
          let day = date._d.toDateString().toLowerCase().split(" ")[0];
          let className =
              day == "sat" ? "weekend" : day == "sun" ? "weekend sunday" : "";
          let datePart = date._d.getDate();
          let monthNumber = date._d.getMonth() + 1; //+ 1 is done as JavaScript getMonth() index is 0 based not 1 based;
          let monthName = "";
          let weekName = "";

          if (
              (index == 0 &&
                  selectedDates.length > 0 &&
                  selectedDates[index + 1]._d.getDate() != 1) ||
              datePart == 1
          ) {
              monthName = DateService.getMonthName(monthNumber);
          }

          if ((index == 0 && selectedDates.length > 1) || day == "mon") {
              weekName = DateService.convertDateInBainFormat(date.toDate());
          }

          day = day[0].toUpperCase() + day.slice(1, 2);
          var dateDetails = {
              date: datePart,
              day: day,
              className: className,
              monthName: monthName,
              weekName: weekName,
              fullDate: DateService.convertDateInBainFormat(date.toDate())
          };
          this.perDayDate.push(dateDetails);
      });
  }

}
