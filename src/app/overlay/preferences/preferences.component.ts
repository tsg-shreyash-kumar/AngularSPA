import { CdkDragDrop, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConstantsMaster } from "src/app/shared/constants/constantsMaster";
import { EmployeeStaffingPreferences } from "src/app/shared/interfaces/employeeStaffingPreferences";

@Component({
    selector: 'app-preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent {
    public activeTab = "industry";
    accessibleFeatures = ConstantsMaster.appScreens.feature;

    @Input() employeeStaffingPreferences: EmployeeStaffingPreferences[];
    @Output() updateEmployeeStaffingPreferences = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    toggleNav(tabName, event) {
        event.preventDefault()
        this.activeTab = tabName;
    }

    updatePreferencesHandler(event) {
        let currentPreferences = this.employeeStaffingPreferences.find(x => x.preferenceType === event.preferencesType);
        let updatedPreferences = JSON.parse(JSON.stringify(currentPreferences));
        updatedPreferences.staffingPreferences = event.preferences;
        this.updateEmployeeStaffingPreferences.emit(updatedPreferences);
    }
}
