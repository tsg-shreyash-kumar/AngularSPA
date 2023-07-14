import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { EmployeeCaseGroupingEnum } from "src/app/shared/constants/enumMaster";

@Component({
  selector: "resources-grouping",
  templateUrl: "./grouping.component.html",
  styleUrls: ["./grouping.component.scss"]
})
export class GroupingComponent implements OnInit {
  @Output() onToggleEmployeeCaseGroup = new EventEmitter<string>();

  selectedGroupingOption = "employee";

  constructor() {}

  ngOnInit(): void {}

  onModeChange(event) {
    if (event.target.checked === true) {
      this.selectedGroupingOption = EmployeeCaseGroupingEnum.CASES
    } else {
      this.selectedGroupingOption = EmployeeCaseGroupingEnum.RESOURCES;
    }

    this.onToggleEmployeeCaseGroup.emit(this.selectedGroupingOption);
  }
}
