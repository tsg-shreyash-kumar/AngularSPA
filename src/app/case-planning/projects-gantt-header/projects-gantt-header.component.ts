import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DateService } from 'src/app/shared/dateService';

@Component({
  selector: 'app-projects-gantt-header',
  templateUrl: './projects-gantt-header.component.html',
  styleUrls: ['./projects-gantt-header.component.scss']
})
export class ProjectsGanttHeaderComponent implements OnInit {

  public perDayDates = [];
  public isLeftSideCollapsed: boolean = false;
  // public allRowsCollapsed: boolean = false;

  //------------------- Input Event ----------------------- //
  @Input() dateRange: [Date, Date];

  // Outputs
  // @Output() toggleAllRowsEmitter = new EventEmitter();
  @Output() expandCollapseSidebarEmitter = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateRange && this.dateRange) {
      this.perDayDates = [];
      this.setPerDayInfo();
    }
  }

  setPerDayInfo() {
    const projectStartDate = DateService.getFormattedDate(this.dateRange[0]);
    const projectEndDate = DateService.getFormattedDate(this.dateRange[1]);
    let datesBetweenRange = DateService.getDates(projectStartDate, projectEndDate);

    datesBetweenRange.forEach((date, index, selectedDates) => {
      let day = date._d.toDateString().toLowerCase().split(" ")[0];
      let className =
        day == "sat" ? "weekend" : day == "sun" ? "weekend sunday" : "weekdays";
      let datePart = date._d.getDate();
      let monthNumber = date._d.getMonth() + 1; //+ 1 is done as JavaScript getMonth() index is 0 based not 1 based;
      let monthName = "";
      let weekName = "";
      let weekLength = 0;

      if (
        (index == 0 &&
          selectedDates.length > 1
          && selectedDates[index + 1]._d.getDate() != 1) ||
        datePart == 1
      ) {
        monthName = DateService.getMonthName(monthNumber);
      }

      if ((index == 0 && selectedDates.length > 1) || day == "mon") {
        weekName = DateService.convertDateInBainFormat(date.toDate());
      }
      weekLength = (7 - date.day()) + 1; //If week starts on Monday, then week length should be 7 i.e (7 -1 + 1)

      day = day[0].toUpperCase() + day.slice(1, 2);
      var dateDetails = {
        date: datePart,
        day: day,
        className: "week-length-" + weekLength + " " + className,
        monthName: monthName,
        weekName: weekName,
        weekLength: weekName.length ? weekLength : "",
        fullDate: DateService.convertDateInBainFormat(date.toDate())
      };
      this.perDayDates.push(dateDetails);
    });
  }

  // Expand & Collapse All Rows
  // toggleAllRows(event) {
  //   // If collapsed, expand
  //   if (event.currentTarget.classList.contains("collapsed")) {
  //     this.allRowsCollapsed = false;
  //     this.toggleAllRowsEmitter.emit(false);
  //     event.currentTarget.classList.remove("collapsed");
  //   } else {
  //     this.allRowsCollapsed = true;
  //     this.toggleAllRowsEmitter.emit(true);
  //     event.currentTarget.classList.add("collapsed");
  //   }
  // }

  // Expand & Collapse Left Sidebar
  expandCollapseSidebar(event) {
    this.isLeftSideCollapsed = !this.isLeftSideCollapsed;
    this.expandCollapseSidebarEmitter.emit(this.isLeftSideCollapsed);
  }

}
