import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourcesSupplyFilterGroupEnum } from 'src/app/shared/constants/enumMaster';

@Component({
  selector: 'app-viewing-dropdown-menu',
  templateUrl: './viewing-dropdown-menu.component.html',
  styleUrls: ['./viewing-dropdown-menu.component.scss']
})
export class ViewingDropdownMenuComponent implements OnInit {

  // Inputs
  @Input()
  set viewingOptions(value: any[]) {
    this._viewingOptions = value;
    this.loadDataOnLoad();
  }
  get viewingOptions() {
    return this._viewingOptions;
  }

  // Outputs
  @Output() selectViewEmitter = new EventEmitter();
  @Output() createNewEmitter = new EventEmitter();
  @Output() editGroupEmitter = new EventEmitter();

  public _viewingOptions: any[];
  isDropdownOpen: boolean = false;
  groupNameQuery: string = "";

  selectedGroup: any;
  selectedOption: any;

  staffingSettingsEnum = ResourcesSupplyFilterGroupEnum.STAFFING_SETTINGS;
  savedGroupEnum = ResourcesSupplyFilterGroupEnum.SAVED_GROUP;
  savedFiltersEnum = ResourcesSupplyFilterGroupEnum.SAVED_FILTERS;
  customGroupEnum = ResourcesSupplyFilterGroupEnum.CUSTOM_GROUP;

  constructor() { }

  ngOnInit(): void {
    this.loadDataOnLoad();
  }

  loadDataOnLoad() {
    this.setSelectedGroup();
    this.toggleEditButtonOnLoad();
  }

  toggleEditButtonOnLoad() {
    this.selectViewEmitterHandler(this.selectedOption.group, this.selectedGroup);
  }

  getSelectedGroup() {
    this.setSelectedGroup();
    this.toggleDropdownMenu();
  }

  setSelectedGroup() {
    this.viewingOptions.forEach((option) => {
      option.items.forEach((group) => {
        if (group.selected) {
          this.selectedGroup = group;
          this.selectedOption = option;
        }
      });
    });
  }

  toggleDropdownMenu() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleViewSelection(option, groupType: string, viewingGroup) {
    this.selectViewEmitterHandler(groupType, viewingGroup);
    this.selectedOption = option;
    this.selectedGroup = viewingGroup;
    this.toggleDropdownMenu();
  }

  selectViewEmitterHandler(groupType: string, viewingGroup) {
    let groupObj = {
      type: groupType == this.staffingSettingsEnum ? this.staffingSettingsEnum : groupType == this.savedFiltersEnum ? this.savedGroupEnum : this.customGroupEnum,
      group: viewingGroup
    };

    this.selectViewEmitter.emit(groupObj);
  }

  handleCreateNewSelection(groupType: string) {
    this.createNewEmitter.emit(groupType);
    this.toggleDropdownMenu();
  }

  handleGroupEditSelected(groupType: string, viewingGroup) {
    const groupObj = {
      type: groupType == this.staffingSettingsEnum ? this.staffingSettingsEnum : groupType == this.savedFiltersEnum ? this.savedGroupEnum : this.customGroupEnum,
      group: viewingGroup
    };

    this.editGroupEmitter.emit(groupObj);
    this.toggleDropdownMenu();
  }
}
