import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
    selector: "app-range-slider",
    templateUrl: "./range-slider.component.html",
    styleUrls: ["./range-slider.component.scss"]
})
export class RangeSliderComponent implements OnInit {
    isThresholdDropdownActive: boolean = false;
    minValue: number = 0;
    maxValue: number = 100;
    selectedLeftValue: number;
    selectedRightValue: number;
    isFilterApplied: boolean = false;

    @Output() updateThresholdRange = new EventEmitter();

    constructor() {}

    ngOnInit(): void {
        this.selectedLeftValue = this.minValue;
        this.selectedRightValue = this.maxValue;
    }

    getRightValue() {
        return this.maxValue - this.selectedRightValue;
    }

    getInRangeValue(val: number): number {
        val = val < 0 ? (val = 0) : val;
        val > 100 ? (val = 100) : val;
        return val;
    }

    applyThreshold() {
        this.isFilterApplied = true;
        this.updateThresholdRange.emit({
            min: this.selectedLeftValue,
            max: this.selectedRightValue,
            isFilterApplied: this.isFilterApplied
        });
        this.toggleThresholdDropdown();
    }

    clearThreshold() {
        this.selectedLeftValue = this.minValue;
        this.selectedRightValue = this.maxValue;
        this.isFilterApplied = false;

        this.updateThresholdRange.emit({
            min: this.selectedLeftValue,
            max: this.selectedRightValue,
            isFilterApplied: this.isFilterApplied
        });
    }

    toggleThresholdDropdown() {
        this.isThresholdDropdownActive = !this.isThresholdDropdownActive;
    }
}
