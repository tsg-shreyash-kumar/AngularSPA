// -------------------Angular Operators---------------------------------------//
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild,
  OnDestroy,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { BsModalService } from "ngx-bootstrap/modal";
import { Subject, fromEvent } from "rxjs";
import { map, debounceTime } from "rxjs/operators";
import { BS_DEFAULT_CONFIG } from "src/app/shared/constants/bsDatePickerConfig";
import { ConstantsMaster } from "src/app/shared/constants/constantsMaster";
import { EmployeeCaseGroupingEnum, ResourcesSupplyFilterGroupEnum } from "src/app/shared/constants/enumMaster";
import { DropdownFilterOption } from "src/app/shared/interfaces/dropdown-filter-option";
import { UserPreferenceSupplyGroupViewModel } from "src/app/shared/interfaces/userPreferenceSupplyGroupViewModel";
import { NotificationService } from "src/app/shared/notification.service";
import { CustomGroupModalComponent } from "../resources-filter/custom-group-modal/custom-group-modal.component";
import { SavedGroupModalComponent } from "../resources-filter/saved-group-modal/saved-group-modal.component";
import { ResourceFilter } from "src/app/shared/interfaces/resource-filter.interface";
import { SystemconfirmationFormComponent } from "src/app/shared/systemconfirmation-form/systemconfirmation-form.component";
import { UserPreferenceSupplyGroup } from "src/app/shared/interfaces/userPreferenceSupplyGroup";
import { UserPreferencesService } from "src/app/core/user-preferences.service";
import { LocalStorageService } from "src/app/shared/local-storage.service";
import { UserPreferencesMessageService } from "src/app/core/user-preferences-message.service";
import { UserPreferences } from "src/app/shared/interfaces/userPreferences.interface";
import { SortRow } from "src/app/shared/interfaces/sort-row.interface";
import { DateService } from "src/app/shared/dateService";

@Component({
  selector: "resources-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"]
})
export class FilterComponent implements OnInit, OnDestroy, OnChanges {
  // -----------------------Input Variables--------------------------------------------//
  @Input() clearSearch: Subject<boolean>;
  @Input() dateRange: [Date, Date];
  @Input() thresholdRangeValue: any;
  @Input()
  set allSupplyDropdownOptions(value: DropdownFilterOption[]) {
    this._allSupplyDropdownOptions = value;
    this.loadDisplayingDropdown();
    this.refreshSortByFilter();
  }
  get allSupplyDropdownOptions() {
    return this._allSupplyDropdownOptions;
  }
  @Input()
  set savedResourceFilters(value: ResourceFilter[]) {
    this._savedResourceFilters = this.filteredItems = value;
    this.refreshSortByFilter();
  }
  get savedResourceFilters() {
    return this._savedResourceFilters;
  }
  @Input()
  set supplyGroupPreferences(value: UserPreferenceSupplyGroupViewModel[]) {
    this._supplyGroupPreferences = this.filteredGroups = value;
    this.refreshSortByFilter();
  }
  get supplyGroupPreferences() {
    return this._supplyGroupPreferences;
  }
  @Input() userPreferences: UserPreferences;

  // -----------------------Output Events--------------------------------------------//
  @Output() getResourcesIncludingTerminatedBySearchString = new EventEmitter<any>();
  @Output() openQuickAddFormEmitter = new EventEmitter<any>();
  @Output() toggleFiltersSection = new EventEmitter<any>();
  @Output() openInfoModal = new EventEmitter<any>();
  @Output() printPdfEmitter = new EventEmitter<any>();
  @Output() getResourcesByDateRange = new EventEmitter();
  @Output() updateThresholdRangeEmitter = new EventEmitter();
  @Output() onSupplyGroupFilterChanged = new EventEmitter<any>();
  @Output() getResourcesSortBySelectedValues = new EventEmitter();
  @Output() onToggleEmployeeCaseGroup = new EventEmitter<string>();
  @Output() upsertResourceFilter = new EventEmitter<any>();
  @Output() deleteSavedFilter = new EventEmitter<any>();
  @Output() userPreferencesSupplyGroupsRefresh = new EventEmitter<any>();
  @Output() deleteSupplyGroupsRefresh = new EventEmitter<any>();
  @Output() sortResourcesBySelectedValues = new EventEmitter<any>();

  // -----------------------Templare Reference Variables--------------------------------------------//
  @ViewChild("employeeSearchInput", { static: true })
  employeeSearchInput: ElementRef;

  // -----------------------Local Variables--------------------------------------------//
  public accessibleFeatures = ConstantsMaster.appScreens.feature;
  public selectedDateRange: any;
  public bsConfig: Partial<BsDatepickerConfig>;
  displayGroups = [];
  public readonly eployeeCaseGroupingEnum = EmployeeCaseGroupingEnum;

  public selectedGroupingOption: string = this.eployeeCaseGroupingEnum.RESOURCES;

  public activeGroup = {
    type: "",
    selected: false,
    group: {} as UserPreferenceSupplyGroupViewModel
  };

  public tempActiveGroup = {
    type: "",
    group: {}
  };

  public selectedGroupItem: SortRow[] = [];

  public filteredItems: ResourceFilter[];
  public _savedResourceFilters: ResourceFilter[];

  public filteredGroups: UserPreferenceSupplyGroupViewModel[];
  public _supplyGroupPreferences: UserPreferenceSupplyGroupViewModel[];

  public _allSupplyDropdownOptions: DropdownFilterOption[];

  public mockViewingGroupsArray = [
    {
      label: "Custom Groups",
      id: "customGroup",
      groups: []
    },
    {
      label: "Saved Groups",
      id: "savedGroup",
      groups: []
    }
  ];

  public areChangesMade: boolean = false;

  staffingSettingsEnum = ResourcesSupplyFilterGroupEnum.STAFFING_SETTINGS;
  supplyGroupsEnum = ResourcesSupplyFilterGroupEnum.SUPPLY_GROUPS;
  savedFiltersEnum = ResourcesSupplyFilterGroupEnum.SAVED_FILTERS;
  savedGroupEnum = ResourcesSupplyFilterGroupEnum.SAVED_GROUP;
  customGroupEnum = ResourcesSupplyFilterGroupEnum.CUSTOM_GROUP;
  // --------------------------Constructor----------------------------//
  constructor(
    private modalService: BsModalService,
    private notifyService: NotificationService,
    private userPreferencesService: UserPreferencesService,
    private userPreferencesMessageService: UserPreferencesMessageService,
    private localStorageService: LocalStorageService
  ) { }

  // --------------------------Component LifeCycle Events----------------------------//
  ngOnInit() {
    this.attachEventToSearchBox();
    this.initializeDateConfig();
  }

  ngOnChanges(change: SimpleChanges) {
    let currentDateRange = null;
    let previousDateRange = null;

    if (change.dateRange && this.dateRange) {
      currentDateRange = change.dateRange.currentValue;
      previousDateRange = change.dateRange.previousValue;
      this.selectedDateRange = this.dateRange;
    }

    let changesInDateRange = this.isChangesInDateRange(currentDateRange, previousDateRange);

    if ((!change.dateRange || (change.dateRange && changesInDateRange))) {
      this.loadDisplayingDropdown();
    }
  }

  isChangesInDateRange(currentDateRange, previousDateRange) {
    let changesInDateRange = false;
    if (currentDateRange || previousDateRange) {
      const currentStartDate = !!currentDateRange ? DateService.convertDateInBainFormat(currentDateRange[0]) : null;
      const currentEndDate = !!currentDateRange ? DateService.convertDateInBainFormat(currentDateRange[1]) : null;
      const previousStartDate = !!previousDateRange ? DateService.convertDateInBainFormat(previousDateRange[0]) : null;
      const previousEndDate = !!previousDateRange ? DateService.convertDateInBainFormat(previousDateRange[1]) : null;

      if (!DateService.isSame(currentStartDate, previousStartDate) || !DateService.isSame(currentEndDate, previousEndDate)) {
        changesInDateRange = true;
      }
      return changesInDateRange;
    }
  }

  loadDisplayingDropdown() {
    this.displayGroups = [];
    if (this.allSupplyDropdownOptions && this.allSupplyDropdownOptions.length > 0) {
      const staffingSettings: DropdownFilterOption[] = this.allSupplyDropdownOptions.filter(
        (x) => x.filterGroupId === this.staffingSettingsEnum
      );
      const supplyGroups: DropdownFilterOption[] = this.allSupplyDropdownOptions.filter(
        (x) => x.filterGroupId === this.supplyGroupsEnum
      );
      const savedFilters: DropdownFilterOption[] = this.allSupplyDropdownOptions.filter(
        (x) => x.filterGroupId === this.savedFiltersEnum
      );

      this.displayGroups.push(
        {
          group: this.staffingSettingsEnum,
          items: staffingSettings
        },
        {
          group: this.supplyGroupsEnum,
          items: supplyGroups
        },
        {
          group: this.savedFiltersEnum,
          items: savedFilters
        }
      );

      this.displayGroups = this.displayGroups.filter((x) => x.items.length > 0);
    }
  }

  applyFilterSortEdits($event) {
    if ($event.type === 'sort') {
      this.sortResourcesBySelectedValues.emit($event.data);
    }
  }

  refreshSortByFilter() {
    if (!!this.allSupplyDropdownOptions && this.allSupplyDropdownOptions.length > 0) {
      this.selectedGroupItem = [];
      const selectedOption = this.allSupplyDropdownOptions.find(x => x.selected);
      if (selectedOption.filterGroupId === this.savedFiltersEnum) {
        const savedFilterSortByOptions = this.savedResourceFilters.find(x => x.id === selectedOption.id).sortBy;
        const sortByOptions = !savedFilterSortByOptions ? [] : savedFilterSortByOptions.split(',');
        this.addSortByOptions(sortByOptions);
      }
      else if (selectedOption.filterGroupId === this.supplyGroupsEnum) {
        this.selectedGroupItem = null;
      }
      // else if (selectedOption.filterGroupId === this.staffingSettingsEnum) {
      //   const sortByOptions = this.userPreferences.sortBy.split(',');
      //   this.addSortByOptions(sortByOptions);
      // }
    }
  }

  addSortByOptions(sortByOptions) {
    sortByOptions.forEach(x => {
      const option: SortRow = {
        field: x,
        direction: 'asc'
      }
      this.selectedGroupItem.push(option);
    });
  }

  handleCreateMoreSelection(groupType) {
    switch (groupType) {
      case "customGroup":
        this.handleCreateNewCustomGroup();
        break;
      case "savedGroup":
        this.handleCreateNewSavedGroup();
        break;
    }
  }

  handleCreateNewCustomGroup() {
    const modalRef = this.modalService.show(CustomGroupModalComponent, {
      backdrop: false,
      class: "custom-group-modal modal-dialog-centered"
    });

    modalRef.content.upsertUserPreferenceSupplyGroups.subscribe((upsertedData) => {
      this.upsertUserPreferenceSupplyGroupsEmitterHandler(upsertedData.supplyGroupsDataToUpsert, upsertedData.allGroupsArray);
    });
  }

  handleCreateNewSavedGroup() {
    const modalRef = this.modalService.show(SavedGroupModalComponent, {
      backdrop: false,
      class: "saved-group-modal modal-dialog-centered"
    });

    modalRef.content.upsertResourceFilter.subscribe((group) => {
      this.upsertResourceFilter.emit(group);
    });
  }

  upsertUserPreferenceSupplyGroupsEmitterHandler(userPreferencesSupplyGroups: UserPreferenceSupplyGroup[], allGroupsArray = null) {
    this.userPreferencesService.upsertUserPreferencesSupplyGroups(userPreferencesSupplyGroups)
      .subscribe(upsertedData => {
        if (!!allGroupsArray && allGroupsArray.some(x => !x.id)) {
          const insertedData = allGroupsArray.find(x => !x.id);
          insertedData.id = upsertedData[0].id;
          insertedData.createdBy = upsertedData[0].createdBy;
        }
        this.userPreferencesMessageService.triggerUserPreferencesSupplyGroupsRefresh(upsertedData);
        this.userPreferencesSupplyGroupsRefresh.emit(allGroupsArray);
        this.notifyService.showSuccess('Supply Group Saved successfully');
        this.setStaffingSettingsLastUpdatedTimeStampInLocalStorage();
      });
  }

  setStaffingSettingsLastUpdatedTimeStampInLocalStorage() {
    //This is done so that tableau  reports load with latest staffing settings on load
    this.localStorageService.set(ConstantsMaster.localStorageKeys.userPreferencesLastUpdatedTimestamp, new Date().getTime());
  }

  updateGroupSessionStorage(groupObj) {
    var existingGroups: any[] = JSON.parse(window.sessionStorage.getItem("mockViewingGroups")) || [];
    existingGroups.push(groupObj);

    existingGroups.forEach((option) => {
      if (groupObj.group.name == option.group.name && groupObj.selected) {
        this.activeGroup = option;
      } else {
        option.group.isDefault = false;
        option.selected = false;
      }
    });

    this.notifyService.showSuccess("New group has been created.");
    window.sessionStorage.setItem("mockViewingGroups", JSON.stringify(existingGroups));
    this.getNewViewingOptions();
  }

  getNewViewingOptions() {
    // window.sessionStorage.setItem("mockViewingGroups", JSON.stringify(this.allViewingGroups));

    let allViewingGroups: any[] = JSON.parse(window.sessionStorage.getItem("mockViewingGroups")) || [];

    this.mockViewingGroupsArray.forEach((x) => {
      x.groups = [];

      allViewingGroups.forEach((options) => {
        if (options.type == x.id) {
          x.groups.push(options);
        }

        if (options.selected) {
          this.activeGroup = options;
        }
      });
    });
  }

  // Handle group editing
  handleEditGroupSelection(groupObj, secondPage: false) {
    if (groupObj.type == "customGroup") {
      let groupToEdit = this.filteredGroups.find(x => x.id == groupObj.group.id);

      const modalRef = this.modalService.show(CustomGroupModalComponent, {
        backdrop: false,
        class: "custom-group-modal modal-dialog-centered",
        initialState: {
          isEditMode: true,
          groupToEdit: groupToEdit
        }
      });

      modalRef.content.upsertUserPreferenceSupplyGroups.subscribe((upsertedData) => {
        this.upsertUserPreferenceSupplyGroupsEmitterHandler(upsertedData.supplyGroupsDataToUpsert, upsertedData.allGroupsArray);
      });
    } else {
      let groupToEdit;

      this.filteredItems.forEach((item) => {
        if (item.id == groupObj.group.id) {
          groupToEdit = item;
        }
      });

      const modalRef = this.modalService.show(SavedGroupModalComponent, {
        backdrop: false,
        class: "saved-group-modal modal-dialog-centered",
        initialState: {
          isEditMode: true,
          groupToEdit: groupToEdit,
          onSecondPage: secondPage
        }
      });

      modalRef.content.upsertResourceFilter.subscribe((group) => {
        this.upsertResourceFilter.emit(group);
      });
    }
  }

  // Save group changes (renames, sharing, filtering, etc)
  saveGroup(groupToEdit) {
    try {
      let allViewingGroups: any[] = JSON.parse(window.sessionStorage.getItem("mockViewingGroups")) || [];
      let edited = allViewingGroups.findIndex((option) => option.group.name == groupToEdit.name);

      allViewingGroups[edited].group = groupToEdit;
      window.sessionStorage.setItem("mockViewingGroups", JSON.stringify(allViewingGroups));

      this.notifyService.showSuccess("Your changes have been saved.");
      this.getNewViewingOptions();
      this.areChangesMade = false;
    } catch (e) {
      console.error("Failed to save changes", e);
    }
  }

  deleteGroup() {
    const confirmationPopUpBodyMessage = 'Are you sure you want to delete "' + this.tempActiveGroup.group["text"] + '" filter ?';
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        confirmationPopUpBodyMessage: confirmationPopUpBodyMessage
      }
    };

    const bsModalRef = this.modalService.show(SystemconfirmationFormComponent, config);
    bsModalRef.content.deleteResourceNote.subscribe(() => {
      if (this.tempActiveGroup.type == this.savedGroupEnum) {
        this.deleteSavedFilter.emit(this.tempActiveGroup.group["id"]);
      } else if (this.tempActiveGroup.type == this.customGroupEnum) {
        this.deleteUserPreferenceSupplyGroupByIds(this.tempActiveGroup.group["id"]);
      }
    });
  }

  deleteUserPreferenceSupplyGroupByIds(deletedGroupIds) {
    this.userPreferencesService.deleteUserPreferenceSupplyGroupByIds(deletedGroupIds)
      .subscribe((deletedData => {
        this.notifyService.showSuccess('Supply Group Deleted successfully');
        this.deleteSupplyGroupsRefresh.emit([].concat(deletedGroupIds));
      }));
  }

  selectOption(event) {
    const groupType = event.type;
    const selectedId = event.group.id;

    this.displayGroups.forEach((x) => {
      x.items.forEach((item) => {
        if (item.id != selectedId) {
          item.selected = false;
        } else {
          item.selected = true;

          this.tempActiveGroup = {
            type: groupType,
            group: event.group
          };
        }
      });
    });

    this.toggleSupplyGroupingSelection(selectedId);
    this.refreshSortByFilter();

    // const selectedValue = event.value;

    // this.displayGroups.forEach((x) => {
    //     x.items.forEach((item) => {
    //         if (item.value != selectedValue) item.selected = false;
    //         else item.selected = true;
    //     });
    // });

    // this.toggleSupplyGroupingSelection(selectedValue);
  }

  updateThresholdRangeHandler(data) {
    this.updateThresholdRangeEmitter.emit(data);
  }

  shiftDateRange(shiftDate) {
    if (shiftDate === "left") {
      const startDate = this.selectedDateRange[0];
      const endDate = this.selectedDateRange[1];

      startDate.setDate(startDate.getDate() - 7);
      endDate.setDate(endDate.getDate() - 7);

      this.selectedDateRange = [startDate, endDate];
    } else {
      const startDate = this.selectedDateRange[0];
      const endDate = this.selectedDateRange[1];

      startDate.setDate(startDate.getDate() + 7);
      endDate.setDate(endDate.getDate() + 7);

      this.selectedDateRange = [startDate, endDate];
    }

    this.getFilteredResourcesByDateRange();
  }

  onDateRangeChange(selectedDateRange) {
    // To avoid API call during initialization we check for non nullable start and end dates
    if (!selectedDateRange || this.selectedDateRange.toString() === selectedDateRange.toString()) {
      return;
    }

    this.selectedDateRange = selectedDateRange;

    this.getFilteredResourcesByDateRange();
  }

  private getFilteredResourcesByDateRange() {
    const dateRange = this.selectedDateRange;

    this.getResourcesByDateRange.emit({
      dateRange
    });
  }

  //loadSupplyGroupDropDown(){

  //  //this.allSupplyDropdownOptions;

  //}

  //Export functionality: future requirements, should not be removed
  printPdfHandler() {
    this.printPdfEmitter.emit();
  }


  // -----------------------Component Event Handlers----------------------------//
  searchEmployee(searchText = "") {
    this.getResourcesIncludingTerminatedBySearchString.emit({
      typeahead: searchText
    });
  }

  clearSearchBox(clearSearchOnly) {
    this.employeeSearchInput.nativeElement.value = "";
    if (!clearSearchOnly) {
      this.searchEmployee();
    }
  }

  attachEventToSearchBox() {
    this.clearSearch.subscribe((value) => {
      this.clearSearchBox(value);
    });

    fromEvent(this.employeeSearchInput.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(500)
        // ,distinctUntilChanged() //removing this as it was craeting testin to and fro resources
      )
      .subscribe((text: string) => {
        this.searchEmployee(text);
      });
  }

  addResourceCommitment(event) {
    this.openQuickAddFormEmitter.emit(event);
  }

  showInformation(event) {
    this.openInfoModal.emit(event);
  }

  openFilterSection() {
    this.toggleFiltersSection.emit();
  }

  toggleSupplyGroupingSelection(event) {
    this.onSupplyGroupFilterChanged.emit(event);
  }

  private initializeDateConfig() {
    this.bsConfig = Object.assign({}, BS_DEFAULT_CONFIG);
    this.bsConfig.containerClass = "theme-dark-blue calendar-dropdown calendar-align-left";
  }

  getResourcesSortBySelectedValuesHandler(event) {
    this.getResourcesSortBySelectedValues.emit(event);
  }

  // Handle grouping selection
  toggleEmployeeCaseGroupHandler(selectedGroupingOption: string) {
    this.selectedGroupingOption = selectedGroupingOption;

    this.onToggleEmployeeCaseGroup.emit(selectedGroupingOption);
  }

  // ---------------------------Component Unload--------------------------------------------//

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.clearSearch.unsubscribe();
  }
}
