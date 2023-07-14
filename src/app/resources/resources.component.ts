// ----------------------- Angular Package References ----------------------------------//
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Store, select } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ----------------------- Component References ----------------------------------//
import { BackfillFormComponent } from '../shared/backfill-form/backfill-form.component';
import { QuickAddFormComponent } from '../shared/quick-add-form/quick-add-form.component';
import { ResourceOverlayComponent } from '../overlay/resource-overlay/resource-overlay.component';
import { ProjectOverlayComponent } from '../overlay/project-overlay/project-overlay.component';
import { AgGridNotesComponent } from '../overlay/ag-grid-notes/ag-grid-notes.component';
import { CaseRollFormComponent } from '../shared/case-roll-form/case-roll-form.component';
import { AgGridSplitAllocationPopUpComponent } from '../overlay/ag-grid-split-allocation-pop-up/ag-grid-split-allocation-pop-up.component';
import { GanttComponent } from './gantt/gantt.component';

// -----------------------Service References ----------------------------------//
import { CoreService } from '../core/core.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { DateService } from '../shared/dateService';
import { SkuCaseTermService } from '../overlay/behavioralSubjectService/skuCaseTerm.service';
import { UserPreferenceService } from '../overlay/behavioralSubjectService/userPreference.service';
import { CaseRollService } from '../overlay/behavioralSubjectService/caseRoll.service';
import { OpportunityService } from '../overlay/behavioralSubjectService/opportunity.service';
import { ResourceService } from '../shared/helperServices/resource.service';

// --------------------------Redux Component -----------------------------------------//
import * as resourcesActions from './State/resources.actions';
import * as fromResources from './State/resources.reducer';

// --------------------------Interfaces -----------------------------------------//
import { UserPreferences } from '../shared/interfaces/userPreferences.interface';
import { Office } from '../shared/interfaces/office.interface';
import { SupplyFilterCriteria } from '../shared/interfaces/supplyFilterCriteria.interface';
import { ResourceStaffing } from '../shared/interfaces/resourceStaffing.interface';
import { InvestmentCategory } from '../shared/interfaces/investmentCateogry.interface';
import { CaseRoleType } from '../shared/interfaces/caseRoleType.interface';
import { CommitmentType } from '../shared/interfaces/commitmentType.interface';
import { OfficeHierarchy } from '../shared/interfaces/officeHierarchy.interface';
import { ServiceLineHierarchy } from '../shared/interfaces/serviceLineHierarchy';
import { LevelGrade } from '../shared/interfaces/levelGrade.interface';

// ------------------------Constants/Enums---------------------------------------
import { ConstantsMaster } from '../shared/constants/constantsMaster';
import { ServiceLine as ServiceLineCodeEnum, ResourcesSupplyFilterGroupEnum, EmployeeCaseGroupingEnum } from '../shared/constants/enumMaster';



// --------------------------utilities -----------------------------------------//
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { LoaderComponent } from '../shared/loader/loader.component';
import { GoogleAnalytics } from '../shared/google-analytics/googleAnalytics';
import { ActivatedRoute } from '@angular/router';
import { Certificate } from '../shared/interfaces/certificate.interface';
import { Language } from '../shared/interfaces/language';
import { PracticeArea } from '../shared/interfaces/practiceArea.interface';
import { ResourceFilter } from '../shared/interfaces/resource-filter.interface';
import { ServiceLine } from '../shared/interfaces/serviceLine.interface';
import { PlaceholderAssignmentService } from '../overlay/behavioralSubjectService/placeholderAssignment.service';
import { StaffableAsType } from '../shared/interfaces/staffableAsType.interface';
import { PlaceholderFormComponent } from '../shared/placeholder-form/placeholder-form.component';
import { ResourceAssignmentService } from '../overlay/behavioralSubjectService/resourceAssignment.service';
import { BackfillDialogService } from '../overlay/dialogHelperService/backFillDialog.service';
import { OverlappedTeamsFormComponent } from '../shared/overlapped-teams-form/overlapped-teams-form.component';
import { AffiliationRole } from '../shared/interfaces/affiliationRole.interface';
import { PositionHierarchy } from '../shared/interfaces/positionHierarchy.interface';
import { InfoIconModalComponent } from './info-icon-modal/info-icon-modal.component';
import { SupplyGroupFilterCriteria } from '../shared/interfaces/supplyGroupFilterCriteria.interface';
import { UserPreferenceSupplyGroupViewModel } from '../shared/interfaces/userPreferenceSupplyGroupViewModel';
import { CombinedUserPreferences } from '../shared/interfaces/combinedUserPreferences.interface';
import { ResourceOrCasePlanningViewNote } from '../shared/interfaces/resource-or-case-planning-view-note.interface';
import { DropdownFilterOption } from '../shared/interfaces/dropdown-filter-option';
import { CommonService } from '../shared/commonService';
import { ProjectBasic } from '../shared/interfaces/project.interface';
import { ResourceCaseGroup } from '../shared/interfaces/resourceCaseGroup';
import { OverlappedTeamDialogService } from '../overlay/dialogHelperService/overlapped-team-dialog.service';
import { SortRow } from '../shared/interfaces/sort-row.interface';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, OnDestroy {
  // -----------------------Local Variables--------------------------------------------//
  destroy$: Subject<boolean> = new Subject<boolean>();
  webWorker: Worker;
  public highlightResource = false;
  public totalResourceCount = 0;
  public resources: ResourceStaffing[] | ResourceCaseGroup[];
  public allresourcesAfterSorting: ResourceStaffing[];
  public allCaseGroupsAfterSorting: ResourceCaseGroup[];
  public savedResourceFilters: ResourceFilter[];
  userPreferences: UserPreferences;
  supplyGroupPreferences: UserPreferenceSupplyGroupViewModel[] = [];
  supplyFilterCriteriaObj: SupplyFilterCriteria = {} as SupplyFilterCriteria;
  supplyGroupFilterCriteriaObj: SupplyGroupFilterCriteria = {} as SupplyGroupFilterCriteria;
  homeOffice: Office;
  pageNumber = 1;
  scrollDistance: number;
  resourcesPerPage;
  dateRange: [Date, Date];
  storeSub: Subscription = new Subscription();
  showProgressBar = true;
  investmentCategories: InvestmentCategory[];
  caseRoleTypes: CaseRoleType[];
  commitmentTypes: CommitmentType[];
  bsModalRef: BsModalRef;
  officeHierarchy: OfficeHierarchy;
  officeFlatList: Office[];
  staffingTagsHierarchy: ServiceLineHierarchy[];
  staffingTags: ServiceLine[];
  levelGrades: LevelGrade[];
  certificates: Certificate[];
  languages: Language[];
  practiceAreas: PracticeArea[];
  affiliationRoles: AffiliationRole[];
  staffableAsTypes: StaffableAsType[];
  positionsHierarchy: PositionHierarchy[];
  sortsBy = [];
  dialogRef: MatDialogRef<ResourceOverlayComponent, any>;
  //  createTeamDialogRef: MatDialogRef<CreateTeamComponent, any>;
  projectDialogRef: MatDialogRef<ProjectOverlayComponent, any>;
  agGridNotesDialogRef: MatDialogRef<AgGridNotesComponent, any>;
  serviceLineCodeEnum: typeof ServiceLineCodeEnum = ServiceLineCodeEnum;
  currRoute = '';
  defaultCommitmentTypeCodeOption = '';
  defaultSavedFilter: ResourceFilter;
  public selectedCommitmentTypes: string[];
  private isSearchStringExist = false;
  public isPdfExport = false;
  public thresholdRangeValue = '';
  public allSupplyDropdownOptions: DropdownFilterOption[] = [];
  public showFilters = false;
  public sortingDirection = '';
  public selectedEmployeeCaseGroupingOption = '';
  public filterConfig = {
    filtersToShow: [
      ConstantsMaster.resourcesFilter.Offices,
      ConstantsMaster.resourcesFilter.StaffingTags,
      ConstantsMaster.resourcesFilter.LevelGrades,
      ConstantsMaster.resourcesFilter.PositionCodes,
      ConstantsMaster.resourcesFilter.CommitmentTypes,
      ConstantsMaster.resourcesFilter.SortBy,
      ConstantsMaster.resourcesFilter.Languages,
      ConstantsMaster.resourcesFilter.Certificates,
      ConstantsMaster.resourcesFilter.RangeThreshold,
      ConstantsMaster.resourcesFilter.PracticeArea,
      ConstantsMaster.resourcesFilter.EmployeeStatus,
      ConstantsMaster.resourcesFilter.StaffableAs,
      ConstantsMaster.resourcesFilter.AffiliationRole
    ]
  };
  searchString = '';
  selectedFilterName = '';

  //used to identify which type of filter is currently applied
  private selectedFilterType: string;
  private SELECTEDFILTERTYPENUM = {
    SUPPLY_GROUPS: "supplyGroups",
    RESOURCES: "resources",
    SEARCH_STRING: "serachString"
  }

  @ViewChild('resourcesGantt', { static: false }) resourcesGantt: GanttComponent; //used for scrolling
  // ----------------------- Notifiers ------------------------------------------------//
  clearEmployeeSearch: Subject<boolean> = new Subject();

  // -----------------------Constructor--------------------------------------------//
  constructor(
    private store: Store<fromResources.State>,
    private modalService: BsModalService,
    private localStorageService: LocalStorageService,
    private coreService: CoreService,
    public dialog: MatDialog,
    private skuCaseTermService: SkuCaseTermService,
    private userpreferencesService: UserPreferenceService,
    private caseRollService: CaseRollService,
    private opportunityService: OpportunityService,
    private router: Router,
    private placeholderAssignmentService: PlaceholderAssignmentService,
    private resourceAssignmentService: ResourceAssignmentService,
    private backfillDialogService: BackfillDialogService,
    private activatedRoute: ActivatedRoute,
    private overlappedTeamDialogService: OverlappedTeamDialogService,
  ) { }

  // -------------------Component LifeCycle Events and Functions----------------------//

  ngOnInit() {
    GoogleAnalytics.staffingTrackPageView(this.coreService.loggedInUser.employeeCode, 'resources', '');
    //Export functionality: future requirements, should not be removed
    this.activatedRoute.queryParams.subscribe(params => {
      this.isPdfExport = params['export'];
      if (this.isPdfExport) {
        // resources per page has been set to max limit of 500 because pdf export gives issues for more resources
        this.resourcesPerPage = 300;
        this.getDataForExport();
        this.showExportPdfDownloadScreen();
        this.getLookupListFromLocalStorage();
        this.getActiveResourcesFromStore();
        this.getActiveResourcesFromStoreOnSearch();
      } else {
        this.resourcesPerPage = this.coreService.appSettings.resourcesPerPage;
        this.scrollDistance = this.coreService.appSettings.scrollDistance;
        this.currRoute = this.router.url;
        this.homeOffice = this.coreService.loggedInUser.office;
        this.getSavedFiltersForLoggedInResource();
        //this.getDataBasedOnUserPreferences();
        this.getLookupListFromLocalStorage();

        this.selectedCommitmentTypes = this.commitmentTypes.map(item => item.commitmentTypeCode);
        this.coreService.getOldCaseCodeFromNotes().pipe(takeUntil(this.destroy$)).subscribe(value => {
          if (value && this.currRoute.includes('resources')) {
            this.openProjectDetailsDialogHandler(value);
          }
        });
        this.setStoreSuscriptions();
      }
    });
  }

  getDataForExport() {
    this.selectedFilterType = this.localStorageService.get(ConstantsMaster.localStorageKeys.selectedFilterType);
    this.supplyFilterCriteriaObj = this.localStorageService.get(ConstantsMaster.localStorageKeys.supplyFilterCriteriaObj);
    this.thresholdRangeValue = this.localStorageService.get(ConstantsMaster.localStorageKeys.availabilityThreshold);
    this.selectedCommitmentTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.selectedCommitmentTypes);
    const startDate = new Date(this.supplyFilterCriteriaObj.startDate);
    const endDate = new Date(this.supplyFilterCriteriaObj.endDate);
    this.dateRange = [startDate, endDate];
    if (this.selectedFilterType === this.SELECTEDFILTERTYPENUM.RESOURCES) {
      this.getActiveResources(this.supplyFilterCriteriaObj);
    } else if (this.selectedFilterType === this.SELECTEDFILTERTYPENUM.SUPPLY_GROUPS) {
      this.getResourcesByGroup(this.localStorageService.get(ConstantsMaster.localStorageKeys.supplyGroupFilterCriteriaObj));
    } else if (this.selectedFilterType === this.SELECTEDFILTERTYPENUM.SEARCH_STRING) {
      this.getResourcesIncludingTerminatedBySearchStringHandler({
        typeahead: this.localStorageService.get(ConstantsMaster.localStorageKeys.searchString)
      });
    }
  }

  onToggleEmployeeCaseGroupHandler(selectedGroupingOption: string) {
    this.selectedEmployeeCaseGroupingOption = selectedGroupingOption;
    this.allCaseGroupsAfterSorting = [];
    this.resetScroll();
    if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {

      this.allCaseGroupsAfterSorting = this.getResourcesGroupByCase(this.allresourcesAfterSorting);
      this.loadResourcesData(this.allCaseGroupsAfterSorting);
    } else {
      // this.allresourcesAfterSorting = this.getResourcesGroupByCaseOrEmployee(this.allresourcesAfterSorting, this.supplyFilterCriteriaObj.sortBy);
      this.loadResourcesData(this.allresourcesAfterSorting);
    }

  }

  toggleFiltersSection() {
    this.showFilters = !this.showFilters;
  }

  //Export functionality: future requirements, should not be removed
  showExportPdfDownloadScreen() {
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        loaderMessage: 'Your file is being downloaded'
      }
    };
    this.bsModalRef = this.modalService.show(LoaderComponent, config);
  }

  ganttBodyLoadedEmitterHandler() {
    if (this.isPdfExport) {
      this.startExportingPdf();
    }
  }

  private startExportingPdf() {
    var div = document.getElementById('ganttContainerDiv');
    div.style.overflow = 'scroll';
    div.style.height = 'auto';
    div.style.width = 'auto';
    html2canvas(div).then(canvas => {
      let ganttWidth = canvas.width;
      let ganttHeight = canvas.height;
      let top_left_margin = 15;
      var PDF_Width = ganttWidth + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = ganttWidth;
      let canvas_image_height = ganttHeight;
      let totalPDFPages = Math.ceil(ganttHeight / PDF_Height) - 1;
      canvas.getContext('2d');
      let imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }
      // this.selectedFilterName = this.localStorageService.get(ConstantsMaster.localStorageKeys.selectedFilterName);
      let pdfName = 'resources-commitments' + '.pdf';
      pdf.save(pdfName);
      setTimeout(() => {
        window.close();
      }, 0);
    });
  }

  printPdfHandler() {
    this.localStorageService.set(ConstantsMaster.localStorageKeys.supplyFilterCriteriaObj, this.supplyFilterCriteriaObj);
    this.localStorageService.set(ConstantsMaster.localStorageKeys.supplyGroupFilterCriteriaObj, this.supplyGroupFilterCriteriaObj);
    this.localStorageService.set(ConstantsMaster.localStorageKeys.searchString, this.searchString);
    this.localStorageService.set(ConstantsMaster.localStorageKeys.selectedFilterType, this.selectedFilterType);
    this.localStorageService.set(ConstantsMaster.localStorageKeys.availabilityThreshold, this.thresholdRangeValue);
    this.localStorageService.set(ConstantsMaster.localStorageKeys.selectedCommitmentTypes, this.selectedCommitmentTypes);
    //this.localStorageService.set(ConstantsMaster.localStorageKeys.selectedFilterName, this.selectedFilterName);
    const queryParam = window.location.href.indexOf('?') > 0 ? '&' : '?';
    const pdfExportUrl = window.location.href + queryParam + 'export=true';
    window.open(pdfExportUrl);
  }

  private setStoreSuscriptions() {
    this.getSavedResourceFiltersFromStore();
    // if(this.isPdfExport) {
    //   this.resources = this.localStorageService.get(ConstantsMaster.localStorageKeys.allResources);
    // } else {
    //   this.getActiveResourcesFromStore();
    // }
    this.getActiveResourcesFromStore();
    this.getActiveResourcesFromStoreOnSearch();
    this.refreshCaseAndResourceOverlayListener();
    this.refreshLastBillableDateListener();
    this.resourcesLoaderListener();
  }

  private refreshCaseAndResourceOverlayListener() {
    this.storeSub.add(this.store
      .pipe(select(fromResources.refreshCaseAndResourceOverlay))
      .subscribe((refreshNeeded: boolean) => {
        if (!refreshNeeded) {
          return;
        }
        this.refreshCaseAndResourceOverlay();
        this.dispatchRefreshCaseAndResourceOverlayAction(false);
      }));

  }

  private refreshLastBillableDateListener() {
    this.storeSub.add(this.store
      .pipe(select(fromResources.refreshLastBillableDate))
      .subscribe((refreshNeeded: boolean) => {
        if (refreshNeeded && this.resources?.length > 0) {
          let employeeCodes = "";
          if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {
            let tempECodes = [];
            this.resources.map(x => x.members.map(y => tempECodes.push(y.resource.employeeCode)));
            employeeCodes = [... new Set(tempECodes)].join(',');
          } else {
            employeeCodes = this.resources.map(x => x.resource.employeeCode).join(',');
          }

          this.refreshLastBillableDate(employeeCodes);
          this.dispatchRefreshLastBillableDateAction(false);
        }
      }));

  }

  private resourcesLoaderListener() {
    this.storeSub.add(this.store
      .pipe(select(fromResources.resourcesLoader))
      .subscribe((isLoader: boolean) => {
        if (isLoader === false) {
          this.showProgressBar = false;
        }
      }));
  }

  ngOnDestroy() {
    this.store.dispatch(new resourcesActions.ClearResourcesStaffingData());
    this.storeSub.unsubscribe();
    this.destroy$.unsubscribe();
    this.currRoute = '';
  }

  // -------------------------------------Component Events----------------------------------//

  public getResourcesHandler(event) {
    this.setRequestParamsOnFilterChange(event);
    this.clearEmployeeSearch.next(true);
    this.isSearchStringExist = false;
    this.getActiveResources(this.supplyFilterCriteriaObj);
  }

  getResourcesByDateRangeHandler(event) {
    this.setRequestParamsOnFilterChange(event);
    this.clearEmployeeSearch.next(true);
    this.isSearchStringExist = false;

    if (this.selectedFilterType == this.SELECTEDFILTERTYPENUM.SUPPLY_GROUPS) {
      this.getResourcesByGroup(this.supplyGroupFilterCriteriaObj);
    } else {
      this.getActiveResources(this.supplyFilterCriteriaObj);
    }
  }

  getResourcesIncludingTerminatedBySearchStringHandler(event) {
    this.selectedFilterType = this.SELECTEDFILTERTYPENUM.SEARCH_STRING;
    this.searchString = event.typeahead.trim();
    const startDate = DateService.getFormattedDate(this.dateRange[0]);
    const endDate = DateService.getFormattedDate(this.dateRange[1]);
    if (this.searchString.length > 2) {
      this.isSearchStringExist = true;
      this.dispatchResourcesLoaderAction(true);
      this.store.dispatch(
        new resourcesActions.LoadResourcesStaffingBySearchString({
          searchString: this.searchString,
          startDate,
          endDate
        })
      );
    } else {
      this.clearSearchData();
    }
  }

  clearSearchData() {
    this.isSearchStringExist = false;
    // dispatch action to clear search data from store
    this.store.dispatch(
      new resourcesActions.ClearSearchData()
    );
  }

  showCommitmentBySelectedValuesHandler(event) {
    this.selectedCommitmentTypes = event.commitmentTypes;
  }

  loadMoreResources() {
    if (!this.isSearchStringExist) {
      this.setPageNumber();
      //this.getMoreActiveResourcesOnPageScroll(this.supplyFilterCriteriaObj);
      if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {
        this.loadResourcesData(this.allCaseGroupsAfterSorting);
      } else {
        this.loadResourcesData(this.allresourcesAfterSorting);
      }
    }
  }

  // -----------------------Resource Allocations Handlers-----------------------------

  private setRequestParamsOnFilterChange(event) {
    event.dateRange[0] = DateService.getStartOfWeek(event.dateRange[0]);
    event.dateRange[1] = DateService.getEndOfWeek(true, event.dateRange[1]);

    this.supplyFilterCriteriaObj.startDate = DateService.getFormattedDate(event.dateRange[0]) ?? this.supplyFilterCriteriaObj.startDate;
    this.supplyFilterCriteriaObj.endDate = DateService.getFormattedDate(event.dateRange[1]) ?? this.supplyFilterCriteriaObj.endDate;
    this.supplyFilterCriteriaObj.officeCodes = event.officeCodes ?? this.supplyFilterCriteriaObj.officeCodes;
    this.supplyFilterCriteriaObj.levelGrades = event.levelGrades ?? this.supplyFilterCriteriaObj.levelGrades;
    this.supplyFilterCriteriaObj.staffingTags = event.staffingTags ?? this.supplyFilterCriteriaObj.staffingTags;
    this.supplyFilterCriteriaObj.sortBy = event.sortBy ?? this.supplyFilterCriteriaObj.sortBy;
    this.supplyFilterCriteriaObj.certificates = event.certificates ?? this.supplyFilterCriteriaObj.certificates;
    this.supplyFilterCriteriaObj.languages = event.languages ?? this.supplyFilterCriteriaObj.languages;
    this.supplyFilterCriteriaObj.practiceAreaCodes = event.practiceAreas ?? this.supplyFilterCriteriaObj.practiceAreaCodes;
    this.supplyFilterCriteriaObj.affiliationRoleCodes = event.roleCodes ?? this.supplyFilterCriteriaObj.affiliationRoleCodes;
    this.supplyFilterCriteriaObj.employeeStatuses = event.employeeStatuses ?? this.supplyFilterCriteriaObj.employeeStatuses;
    this.supplyFilterCriteriaObj.staffableAsTypeCodes = event.staffableAsTypeCodes ?? this.supplyFilterCriteriaObj.staffableAsTypeCodes;
    this.supplyFilterCriteriaObj.positionCodes = event.positionCodes ?? this.supplyFilterCriteriaObj.positionCodes;
    this.dateRange = event.dateRange;
    this.resetScroll();
  }

  public updateResourceAssignmentToProjectHandler(resourceAllocation) {
    resourceAllocation.allocation = parseInt(resourceAllocation.allocation, 10);
    this.dispatchUpdateResourceAction(resourceAllocation);
  }

  public upsertResourceAllocationsToProjectHandler(resourceAllocation, splitSuccessMessage?, allocationDataBeforeSplitting?) {
    let addedResourceAsArray = [];
    const addedResource = resourceAllocation;
    if (Array.isArray(addedResource)) {
      addedResourceAsArray = addedResource;
    } else {
      addedResourceAsArray.push(addedResource);
    }
    this.dispatchUpsertResourceAction(addedResourceAsArray, splitSuccessMessage, allocationDataBeforeSplitting);
  }

  public upsertPlaceholderAllocationsToProjectHandler(placeholderAllocation) {
    this.dispatchUpsertPlaceholderAction(placeholderAllocation);
  }

  public upsertResourceViewNoteHandler(resourceViewNote: ResourceOrCasePlanningViewNote) {
    if (resourceViewNote) {
      this.dispatchUpsertResourceViewNoteAction(resourceViewNote);
    }
  }

  public deleteResourceViewNotesHandler(idsToBeDeleted: string) {
    if (idsToBeDeleted.length > 0) {
      this.dispatchDeleteResourceViewNotesAction(idsToBeDeleted);
    }
  }

  private deleteResourceAssignmentFromProjectHandler(deletedObjId) {
    this.store.dispatch(
      new resourcesActions.DeleteResourceStaffing(deletedObjId)
    );
  }

  private deleteResourcesAssignmentsFromProjectHandler(deletedObjIds) {
    this.store.dispatch(
      new resourcesActions.DeleteResourcesStaffing(deletedObjIds)
    );
  }

  private deleteResourcesAllocationsCommitments(dataToDelete) {
    this.store.dispatch(
      new resourcesActions.DeleteAllocationsCommitmentsStaffing(dataToDelete)
    );
  }

  // -----------------------End Resource Allocations Handlers-----------------------------

  // -----------------------Resource Commitments-----------------------------

  public addResourceCommitmentHandler(resourceCommitment) {
    this.dispatchAddResourceCommitmentAction(resourceCommitment);
  }

  public updateResourceCommitmentHandler(updatedResourceCommitment) {
    this.dispatchUpdateResourceCommitmentAction(updatedResourceCommitment);
  }

  private deleteResourceCommitmentHandler(deletedCommitmentId) {
    this.dispatchDeleteResourceCommitmentAction(deletedCommitmentId);
  }
  // -----------------------End Resource Commitments Handlers-----------------------------

  // ---------------------------------Redux dispatch/Subscribe------------------------------------------//
  private getActiveResources(supplyFilterCriteriaObj: SupplyFilterCriteria) {
    this.selectedFilterType = this.SELECTEDFILTERTYPENUM.RESOURCES;

    if (this.supplyFilterCriteriaObj.officeCodes === '' ||
      this.supplyFilterCriteriaObj.staffingTags === '' || this.supplyFilterCriteriaObj.employeeStatuses === '') {
      this.resources = [];
      return;
    }

    this.dispatchResourcesLoaderAction(true);

    this.store.dispatch(
      new resourcesActions.LoadResourcesStaffing({
        supplyFilterCriteriaObj,
        pageNumber: null, //passing null so as to fetch all resources data and apply pagination at front end
        resourcesPerPage: null,
      })
    );
  }

  private getResourcesByGroup(supplyGroupFilterCriteriaObj: SupplyGroupFilterCriteria) {
    this.selectedFilterType = this.SELECTEDFILTERTYPENUM.SUPPLY_GROUPS;
    if (!supplyGroupFilterCriteriaObj.employeeCodes) {
      this.resources = [];
      return;
    }

    this.dispatchResourcesLoaderAction(true);

    this.store.dispatch(
      new resourcesActions.LoadGroupedResourcesStaffing({
        supplyGroupFilterCriteriaObj,
        pageNumber: null, //passing null so as to fetch all resources data and apply pagination at front end
        resourcesPerPage: null,
      })
    );
  }

  private getSavedResourceFiltersFromStore() {
    this.storeSub.add(this.store
      .pipe(select(fromResources.getSavedResourceFilters))
      .subscribe((resourceFilters: ResourceFilter[]) => {
        if (resourceFilters) {
          this.savedResourceFilters = resourceFilters;
          if (!this.savedResourceFilters.some(x => x.isDefault == true)) {
            this.defaultSavedFilter = null;
          }
          if (!this.defaultSavedFilter) {
            this.defaultSavedFilter = this.savedResourceFilters.find(x => x.isDefault == true);
            this.getDataBasedOnUserPreferences();

          }
          else {
            this.loadResourcesSupplyGroupDropdown();
          }
          this.resetScroll();
        }
      }));
  }

  private getActiveResourcesFromStoreOnSearch() {
    this.storeSub.add(this.store
      .pipe(select(fromResources.getSearchedResourcesStaffing))
      .subscribe((resourcesData: ResourceStaffing[]) => {
        if (this.isSearchStringExist) {
          if (typeof Worker !== 'undefined') {
            this.runWorkerForSearch(resourcesData);
          } else {
            let resourcesDataWithAvailability = ResourceService.createResourcesDataForResourcesTab(resourcesData, this.supplyFilterCriteriaObj.startDate, this.supplyFilterCriteriaObj.endDate,
              this.supplyFilterCriteriaObj, this.commitmentTypes, this.coreService.getUserPreferencesValue(), false);

            resourcesDataWithAvailability = this.getResourcesSortBySelectedValues(resourcesDataWithAvailability, this.supplyFilterCriteriaObj.sortBy, this.supplyFilterCriteriaObj.sortDirection);
            if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {
              this.resources = this.getResourcesGroupByCase(resourcesDataWithAvailability);
            } else {
              this.resources = resourcesDataWithAvailability;
            }

            this.resetScroll();
          }
        }
      }));
  }

  private runWorkerForSearch(resourcesData: ResourceStaffing[]) {
    this.initializeWorker(resourcesData);
    this.webWorker.onmessage = (response) => {
      let resourcesDataWithAvailability = response.data;
      resourcesDataWithAvailability = this.getResourcesSortBySelectedValues(resourcesDataWithAvailability, this.supplyFilterCriteriaObj.sortBy, this.supplyFilterCriteriaObj.sortDirection);

      if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {
        this.resources = this.getResourcesGroupByCase(resourcesDataWithAvailability);
      } else {
        this.resources = resourcesDataWithAvailability;
      }

      this.resetScroll();
    };
  }

  private getActiveResourcesFromStore() {
    this.storeSub.add(this.store
      .pipe(select(fromResources.getResourcesStaffing))
      .subscribe((resourcesData: ResourceStaffing[]) => {
        /*// Check for filter values as async call might take some time to return data and hence,
        // if user select All Bain Offices and Unselect the next moment, records will show up
        // as first request took some time to return.
        if (this.supplyFilterCriteriaObj.officeCodes === '' ||
          this.supplyFilterCriteriaObj.staffingTags === '' || this.resources === undefined || this.supplyFilterCriteriaObj.employeeStatuses === '') {
          this.resources = [];
        } else {
          if (typeof Worker !== 'undefined') {
            this.runWorker(resourcesData);
          } else {
            this.allresourcesAfterSorting = ResourceService.createResourcesDataForResourcesTab(resourcesData, this.supplyFilterCriteriaObj.startDate, this.supplyFilterCriteriaObj.endDate,
              this.supplyFilterCriteriaObj, this.commitmentTypes, this.coreService.getUserPreferencesValue(), false);

            this.allresourcesAfterSorting = this.getResourcesSortAndGroupBySelectedValues(this.allresourcesAfterSorting, this.supplyFilterCriteriaObj.sortBy);
            this.loadResourcesData(this.allresourcesAfterSorting);
          }
        }
        */
        //this.localStorageService.set(ConstantsMaster.localStorageKeys.allResources, resourcesData);

        if (typeof Worker !== 'undefined') {
          this.runWorker(resourcesData);
        } else {
          this.allresourcesAfterSorting = ResourceService.createResourcesDataForResourcesTab(resourcesData, this.supplyFilterCriteriaObj.startDate, this.supplyFilterCriteriaObj.endDate,
            this.supplyFilterCriteriaObj, this.commitmentTypes, this.coreService.getUserPreferencesValue(), false);

          this.allresourcesAfterSorting = this.getResourcesSortBySelectedValues(this.allresourcesAfterSorting, this.supplyFilterCriteriaObj.sortBy, this.supplyFilterCriteriaObj.sortDirection);

          if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {
            this.allCaseGroupsAfterSorting = this.getResourcesGroupByCase(this.allresourcesAfterSorting);
            this.loadResourcesData(this.allCaseGroupsAfterSorting);
          } else {
            this.loadResourcesData(this.allresourcesAfterSorting);
          }

        }

      }));
  }

  private initializeWorker(resourcesData: ResourceStaffing[]) {
    this.webWorker = new Worker(new URL('../shared/web-workers/resource-view-data.worker', import.meta.url), { type: "module" });
    this.webWorker.postMessage(
      JSON.stringify({
        resourcesData: resourcesData,
        searchStartDate: this.supplyFilterCriteriaObj.startDate,
        searchEndDate: this.supplyFilterCriteriaObj.endDate,
        supplyFilterCriteriaObj: this.supplyFilterCriteriaObj,
        commitmentTypes: this.commitmentTypes,
        userPreferences: this.coreService.getUserPreferencesValue(),
        isTriggeredFromSearch: false
      }));
  }

  private runWorker(resourcesData: ResourceStaffing[]) {
    this.initializeWorker(resourcesData);
    this.webWorker.onmessage = (response) => {
      this.allresourcesAfterSorting = response.data;
      this.allresourcesAfterSorting = this.getResourcesSortBySelectedValues(this.allresourcesAfterSorting, this.supplyFilterCriteriaObj.sortBy, this.supplyFilterCriteriaObj.sortDirection);

      if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {
        this.allCaseGroupsAfterSorting = this.getResourcesGroupByCase(this.allresourcesAfterSorting);
        this.loadResourcesData(this.allCaseGroupsAfterSorting);
      } else {
        this.loadResourcesData(this.allresourcesAfterSorting);
      }
    };
  }

  private loadResourcesData(resourcesData: ResourceStaffing[] | ResourceCaseGroup[]) {
    if (!this.resourcesPerPage) {
      return this.resources = resourcesData;
    }

    if (!this.isSearchStringExist) {
      const pageNumber = this.pageNumber;
      const resourcesPerPage = this.resourcesPerPage;
      const totalRecords = pageNumber * resourcesPerPage;

      this.resources = resourcesData.slice(0, totalRecords);
    }
  }

  getResourcesSortBySelectedValuesHandler(event) {

    this.sortingDirection = event.direction;
    this.supplyFilterCriteriaObj.sortBy = event.sortBy;
    this.supplyFilterCriteriaObj.sortDirection = event.direction;

    if (this.isSearchStringExist) {
      // this.resources = this.getResourcesSortAndGroupBySelectedValues(this.resources, event.sortBy, event.direction);
      this.resources = this.getResourcesSortBySelectedValues(this.resources, event.sortBy, event.direction);
    } else if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {

      this.allCaseGroupsAfterSorting = this.getResourcesSortBySelectedValues(this.allCaseGroupsAfterSorting, event.sortBy, event.direction);
      this.loadResourcesData(this.allCaseGroupsAfterSorting);
    } else {
      // this.allresourcesAfterSorting = this.getResourcesSortAndGroupBySelectedValues(this.allresourcesAfterSorting, event.sortBy, event.direction);
      this.allresourcesAfterSorting = this.getResourcesSortBySelectedValues(this.allresourcesAfterSorting, event.sortBy, event.direction);
      this.loadResourcesData(this.allresourcesAfterSorting);
    }

  }

  sortResourcesBySelectedValuesHandler(event: SortRow[]) {
    let sortRows: SortRow[] = [];
    sortRows = event;

    if (this.isSearchStringExist) {
      this.resources = this.sortResourcesForResourcesView(this.resources, event);
    }
    else if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {

      this.allCaseGroupsAfterSorting = this.sortResourcesForCasesView(this.allCaseGroupsAfterSorting, event);

      this.loadResourcesData(this.allCaseGroupsAfterSorting);
    }
    else {
      this.allresourcesAfterSorting = this.sortResourcesForResourcesView(this.allresourcesAfterSorting, event);
      this.loadResourcesData(this.allresourcesAfterSorting);
    }
  }

  sortResourcesForResourcesView(resources, sortRows) {
    return CommonService.getResourcesSortBySelectedValues(resources, sortRows);
  }

  sortResourcesForCasesView(resources, sortRows) {
    resources.forEach(x => {
      x.members = CommonService.getResourcesSortBySelectedValues(x.members, sortRows)
    });
    return resources;
  }

  getResourcesGroupByCase(resourcesAfterSort) {
    let allCaseGroupsAfterSorting = [];

    Object.entries(this.groupResourcesByCases(resourcesAfterSort)).forEach(([key, value]) => {
      allCaseGroupsAfterSorting.push(value);
    });
    allCaseGroupsAfterSorting = this.getCaseGroupsSortBySelectedValues(allCaseGroupsAfterSorting, "clientName");

    return allCaseGroupsAfterSorting;
  }

  getResourcesSortBySelectedValues(resources, sortBy, sortDirection = 'asc') {
    if (this.selectedEmployeeCaseGroupingOption === EmployeeCaseGroupingEnum.CASES) {

      resources.forEach(x => {
        x.members = this.getResourcesSortAndGroupBySelectedValues(x.members, sortBy, sortDirection);
      })

    } else {
      resources = this.getResourcesSortAndGroupBySelectedValues(resources, sortBy, sortDirection);
    }

    return resources
  }

  getResourcesSortAndGroupBySelectedValues(resources, sortBy = 'fullName', sortDirection = 'asc') {
    sortDirection = sortDirection ?? 'asc';
    sortBy = sortBy ?? 'fullName';

    CommonService.getResourcesSortAndGroupBySelectedValues(resources, sortBy, sortDirection)
    return resources;
  }

  groupResourcesByCases(resources) {
    let groups = [];
    resources.forEach((item) => {
      let includedKeys: string[] = [];
      if (item.allocations.length) {
        item.allocations.forEach(alloc => {
          const key = alloc.oldCaseCode || alloc.pipelineId;
          if (!includedKeys.includes(key)) {
            includedKeys.push(key);
          } else
            return;

          if (groups[key]) {
            groups[key]["members"].push(item);
          } else {
            const caseDetails: ProjectBasic = {
              caseCode: alloc.caseCode,
              clientCode: alloc.clientCode,
              caseTypeCode: alloc.caseTypeCode,
              caseType: alloc.caseType,
              oldCaseCode: alloc.oldCaseCode,
              clientName: alloc.clientName,
              startDate: alloc.caseStartDate || alloc.opportunityStartDate,
              endDate: alloc.caseEndDate || alloc.opportunityEndDate,
              caseName: alloc.caseName,
              pipelineId: alloc.pipelineId,
              opportunityStatus: alloc.opportunityStatus,
              opportunityName: alloc.opportunityName,
              probabilityPercent: alloc.probabilityPercent
            }

            groups[key] = {};
            groups[key]["caseDetails"] = caseDetails;
            groups[key]["members"] = [].concat(item);
          }
        });

      } else {
        const key = "notAllocated";
        if (groups[key]) {
          if (!includedKeys.includes(key)) {
            includedKeys.push(key);

            groups[key]["members"].push(item);
          }
        } else {
          const caseDetails: ProjectBasic = {
            caseCode: null,
            clientCode: null,
            caseTypeCode: null,
            caseType: null,
            oldCaseCode: "NA",
            clientName: "Not Allocated",
            startDate: null,
            endDate: null,
            caseName: "Not Allocated",
            pipelineId: null,
            opportunityStatus: null,
            opportunityName: null,
            probabilityPercent: null
          }

          groups[key] = {};
          groups[key]["caseDetails"] = caseDetails;
          groups[key]["members"] = [].concat(item);
        }
      }

    });

    return groups;
  }

  getCaseGroupsSortBySelectedValues(caseGroups, sortBy = 'clientName') {
    caseGroups.sort((previousElement, nextElement) => {

      //this is done to push "Not Allocated" bucket to bottom
      if (previousElement.caseDetails[sortBy] === "Not Allocated"
      ) {
        return 1;
      }
      if (nextElement.caseDetails[sortBy] === "Not Allocated"
      ) {
        return -1;
      }

      if (
        previousElement.caseDetails[sortBy] >
        nextElement.caseDetails[sortBy]
      ) {
        return 1;
      }
      if (
        previousElement.caseDetails[sortBy] <
        nextElement.caseDetails[sortBy]
      ) {
        return -1;
      }
    });

    return caseGroups;
  }

  private setPageNumber() {
    this.pageNumber = this.pageNumber + 1;
  }

  private resetPageNumber() {
    this.pageNumber = 1;
  }

  private resetScroll() {
    if (this.resourcesGantt) {
      this.resetPageNumber();
      this.resourcesGantt.ganttContainer.nativeElement.scrollTo(0, 0);
    }
  }

  private dispatchAddResourceAction(resourceAllocation) {
    this.store.dispatch(
      new resourcesActions.AddResourceStaffing(resourceAllocation)
    );
  }

  private dispatchUpsertResourceAction(upsertedAllocations, splitSuccessMessage?, allocationDataBeforeSplitting?) {
    this.store.dispatch(
      new resourcesActions.UpsertResourceStaffing({ upsertedAllocations, splitSuccessMessage, allocationDataBeforeSplitting })
    );
  }

  private dispatchUpsertPlaceholderAction(upsertedAllocations) {
    this.store.dispatch(
      new resourcesActions.UpsertPlaceholderStaffing({ upsertedAllocations })
    );
  }

  private dispatchUpsertResourceViewNoteAction(resourceViewNote) {
    this.store.dispatch(
      new resourcesActions.UpsertResourceViewNote(resourceViewNote)
    );
  }

  private dispatchDeleteResourceViewNotesAction(idsToBeDeleted) {
    this.store.dispatch(
      new resourcesActions.DeleteResourceViewNotes(idsToBeDeleted)
    );
  }

  private dispatchUpdateResourceAction(resourceAllocation) {
    this.store.dispatch(
      new resourcesActions.UpdateResource(resourceAllocation)
    );
  }

  private dispatchAddResourceCommitmentAction(resourceCommitment) {
    this.store.dispatch(
      new resourcesActions.AddResourceCommitment(resourceCommitment)
    );
  }

  private dispatchUpdateResourceCommitmentAction(updatedResourceCommitment) {
    this.store.dispatch(
      new resourcesActions.UpdateResourceCommitment(updatedResourceCommitment)
    );
  }

  private dispatchDeleteResourceCommitmentAction(deletedCommitmentId) {
    this.store.dispatch(
      new resourcesActions.DeleteResourceCommitment(deletedCommitmentId)
    );
  }

  private dispatchRefreshCaseAndResourceOverlayAction(refreshNeeded) {
    this.store.dispatch(
      new resourcesActions.RefreshCaseAndResourceOverlay(refreshNeeded)
    );
  }

  private dispatchRefreshLastBillableDateAction(refreshNeeded) {
    this.store.dispatch(
      new resourcesActions.RefreshLastBillableDate(refreshNeeded)
    );
  }

  private upsertStaffableAsRole(staffableAsRole) {
    this.dispatchResourcesLoaderAction(true);
    this.store.dispatch(
      new resourcesActions.UpsertResourceStaffableAsRole(staffableAsRole)
    );
  }

  private deleteStaffableAsRole(staffableAsRole) {
    this.dispatchResourcesLoaderAction(true);
    this.store.dispatch(
      new resourcesActions.DeleteResourceStaffableAsRole(staffableAsRole)
    );
  }

  private dispatchResourcesLoaderAction(isShowProgressBar) {
    this.showProgressBar = isShowProgressBar;
    this.store.dispatch(
      new resourcesActions.ResourcesLoader(true)
    );
  }

  deleteSavedFilterHandler(filterIdToDelete: string) {
    this.deleteSavedFilter(filterIdToDelete);
  }

  // -------------------------------------Helper Functions----------------------------------//
  private refreshCaseAndResourceOverlay() {
    if (this.projectDialogRef &&
      this.projectDialogRef.componentInstance &&
      this.projectDialogRef.componentInstance.project &&
      Object.keys(this.projectDialogRef.componentInstance.project.projectDetails).length > 0) {
      const projectData = this.projectDialogRef.componentInstance.project.projectDetails;
      this.projectDialogRef.componentInstance.getProjectDetails(projectData);
    }

    if (this.dialogRef && this.dialogRef.componentInstance) {
      const employeeCode = this.dialogRef.componentInstance.data.employeeCode;
      this.dialogRef.componentInstance.getDetailsForResource(employeeCode);
    }
  }

  private refreshLastBillableDate(employeeCodes: string) {
    this.dispatchResourcesLoaderAction(true);

    this.store.dispatch(
      new resourcesActions.LoadLastBillableDateForResources({ employeeCodes })
    );
  }

  private getSavedFiltersForLoggedInResource() {
    this.dispatchResourcesLoaderAction(true);

    this.store.dispatch(
      new resourcesActions.LoadSavedResourceFilters({})
    );
  }

  private deleteSavedFilter(filterIdToDelete: string) {

    this.store.dispatch(
      new resourcesActions.DeleteSavedResourceFilter(filterIdToDelete)
    );
  }

  private getDataBasedOnUserPreferences() {
    // this is done so that whenever user changes their user settings, it reflects in the projects and resources data
    this.coreService.getCombinedUserPreferences().subscribe((combinedUserPreferences: CombinedUserPreferences) => {
      this.userPreferences = combinedUserPreferences.userPreferences;
      this.supplyGroupPreferences = combinedUserPreferences.userPreferenceSupplyGroups;

      if (this.isSearchStringExist) {
        this.clearEmployeeSearch.next(true);
        this.clearSearchData();
      }

      this.updateSupplyAndDemandSettings();
      this.updateDefaultSupplyGroupSettings();
      this.resetScroll();
      // load resources data
      this.getResourcesByDefaultSettings();
      this.loadResourcesSupplyGroupDropdown();
    });
  }

  getResourcesByDefaultSettings() {
    if (this.defaultSavedFilter) {
      this.getActiveResources(this.supplyFilterCriteriaObj);
    } else if (this.supplyGroupPreferences.some(x => x.isDefault)) {
      this.getResourcesByGroup(this.supplyGroupFilterCriteriaObj);
    } else {
      this.getActiveResources(this.supplyFilterCriteriaObj);
    }

  }

  loadResourcesSupplyGroupDropdown() {
    let savedFilters: DropdownFilterOption[] = this.savedResourceFilters?.map((data: ResourceFilter) => {
      return {
        text: data.title,
        value: data.id,
        filterGroupId: ResourcesSupplyFilterGroupEnum.SAVED_FILTERS,
        id: data.id,
        selected: false,
        isDefault: false
      };
    });


    let supplygroups: DropdownFilterOption[] = this.supplyGroupPreferences?.map((data: UserPreferenceSupplyGroupViewModel) => {
      return {
        text: data.name,
        value: data.groupMembers.map(x => x.employeeCode).join(","),
        filterGroupId: ResourcesSupplyFilterGroupEnum.SUPPLY_GROUPS,
        id: data.id,
        selected: false,
        isDefault: false
      };
    });

    let staffingSettings: DropdownFilterOption[] = [
      {
        text: "Staffing Settings",
        value: "Staffing Settings Value",
        filterGroupId: ResourcesSupplyFilterGroupEnum.STAFFING_SETTINGS,
        id: ResourcesSupplyFilterGroupEnum.STAFFING_SETTINGS,
        selected: false,
        isDefault: false
      }];

    this.allSupplyDropdownOptions = [...staffingSettings, ...supplygroups, ...savedFilters];

    if (this.defaultSavedFilter) {
      this.allSupplyDropdownOptions.find(x => x.id == this.defaultSavedFilter.id).selected = true;
      this.allSupplyDropdownOptions.find(x => x.id == this.defaultSavedFilter.id).isDefault = true;
    }
    else if (this.supplyGroupPreferences.some(x => x.isDefault)) {
      const defaultSupplyGrpPreference: UserPreferenceSupplyGroupViewModel = this.supplyGroupPreferences.find(x => x.isDefault);
      this.allSupplyDropdownOptions.find(x => x.id == defaultSupplyGrpPreference.id).selected = true;
      this.allSupplyDropdownOptions.find(x => x.id == defaultSupplyGrpPreference.id).isDefault = true;

    } else {
      this.allSupplyDropdownOptions.find(x => x.id == ResourcesSupplyFilterGroupEnum.STAFFING_SETTINGS).selected = true;
      this.allSupplyDropdownOptions.find(x => x.id == ResourcesSupplyFilterGroupEnum.STAFFING_SETTINGS).isDefault = true;
    }

  }

  private updateSupplyGroupFilterCriteria() {
    //for start and end date
    const startDate = DateService.getStartOfWeek(new Date());
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 40);
    endDate = DateService.getEndOfWeek(true, endDate);

    // Default date range will be today + 40 days on load
    const defaultDateRange = DateService.getFormattedDateRange({
      startDate: startDate,
      endDate: endDate,
    });

    this.supplyGroupFilterCriteriaObj.startDate = this.supplyFilterCriteriaObj.startDate ?? defaultDateRange.startDate;
    this.supplyGroupFilterCriteriaObj.endDate = this.supplyFilterCriteriaObj.endDate ?? defaultDateRange.endDate;
    this.supplyGroupFilterCriteriaObj.availabilityIncludes = this.supplyFilterCriteriaObj.availabilityIncludes;
    this.supplyGroupFilterCriteriaObj.sortBy = this.supplyFilterCriteriaObj.sortBy;
    this.supplyGroupFilterCriteriaObj.groupBy = this.supplyFilterCriteriaObj.groupBy;
  }

  private updateSupplyAndDemandSettings() {
    const startDate = DateService.getStartOfWeek(new Date());
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 40);
    endDate = DateService.getEndOfWeek(true, endDate);

    // Default date range will be today + 40 days on load
    const defaultDateRange = DateService.getFormattedDateRange({
      startDate: startDate,
      endDate: endDate,
    });

    if (this.userPreferences && typeof this.userPreferences === 'object') {
      const today = new Date();
      /*-------------- Set user preferences for Supply Side ---------------------*/
      let dateRangeForResources: { startDate: any; endDate: any };

      if (this.userPreferences.supplyWeeksThreshold) {
        const userSettingsEndDate = DateService.getEndOfWeek(true, new Date(
          today.setDate(
            today.getDate() + this.userPreferences.supplyWeeksThreshold * 7
          )
        ));

        const differenceInDays = DateService.getDatesDifferenceInDays(
          startDate,
          userSettingsEndDate
        );
        const minDaysForProperRenderingOfResourcesGantt = 40;
        if (differenceInDays > minDaysForProperRenderingOfResourcesGantt) {
          endDate = userSettingsEndDate;
        }
      }
      const date = { startDate: startDate, endDate: endDate };
      this.dateRange = [startDate, endDate];
      dateRangeForResources = DateService.getFormattedDateRange(date);

      this.supplyFilterCriteriaObj.startDate = dateRangeForResources.startDate;
      this.supplyFilterCriteriaObj.endDate = dateRangeForResources.endDate;
      this.supplyFilterCriteriaObj.officeCodes =
        this.userPreferences.supplyViewOfficeCodes ||
        this.homeOffice.officeCode.toString();
      this.supplyFilterCriteriaObj.levelGrades = this.userPreferences.levelGrades;
      this.supplyFilterCriteriaObj.positionCodes = this.userPreferences.positionCodes;
      this.supplyFilterCriteriaObj.staffingTags =
        this.userPreferences.supplyViewStaffingTags || this.serviceLineCodeEnum.GeneralConsulting;
      this.supplyFilterCriteriaObj.sortBy = this.userPreferences.sortBy;
      this.supplyFilterCriteriaObj.practiceAreaCodes = this.userPreferences.practiceAreaCodes || '';
      this.supplyFilterCriteriaObj.affiliationRoleCodes = this.userPreferences.affiliationRoleCodes || '';
      this.supplyFilterCriteriaObj.availabilityIncludes = this.userPreferences.availabilityIncludes;

    } else {
      /*-------------- Set default search criteria for Supply Side ---------------------*/

      this.dateRange = [startDate, endDate];
      this.supplyFilterCriteriaObj.startDate = defaultDateRange.startDate;
      this.supplyFilterCriteriaObj.endDate = defaultDateRange.endDate;
      this.supplyFilterCriteriaObj.officeCodes = this.homeOffice.officeCode.toString();
      this.supplyFilterCriteriaObj.staffingTags = this.serviceLineCodeEnum.GeneralConsulting;
      this.supplyFilterCriteriaObj.sortBy = 'fullName';
    }
    //below supply properties are not driven by userSettings. They have fixed defaults
    this.supplyFilterCriteriaObj.certificates = '';
    this.supplyFilterCriteriaObj.languages = '';
    this.supplyFilterCriteriaObj.employeeStatuses = ConstantsMaster.employeeStatus.map(x => x.code).join(",");// show all status by default

    // Reset Supply Settings if Default Filter is selected
    this.resetSupplySettingsForDefaultSavedFilter();
  }

  private updateDefaultSupplyGroupSettings() {

    const startDate = DateService.getStartOfWeek(new Date());
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 40);
    endDate = DateService.getEndOfWeek(true, endDate);

    // Default date range will be today + 40 days on load
    const defaultDateRange = DateService.getFormattedDateRange({
      startDate: startDate,
      endDate: endDate,
    });

    const defaultGroupPreferences: UserPreferenceSupplyGroupViewModel = this.supplyGroupPreferences.find(x => x.isDefault);

    if (defaultGroupPreferences && typeof defaultGroupPreferences === 'object') {
      const today = new Date();
      /*-------------- Set user preferences for Supply Side ---------------------*/
      let dateRangeForResources: { startDate: any; endDate: any };

      if (this.userPreferences.supplyWeeksThreshold) {
        const userSettingsEndDate = DateService.getEndOfWeek(true, new Date(
          today.setDate(
            today.getDate() + this.userPreferences.supplyWeeksThreshold * 7
          )
        ));

        const differenceInDays = DateService.getDatesDifferenceInDays(
          startDate,
          userSettingsEndDate
        );
        const minDaysForProperRenderingOfResourcesGantt = 40;
        if (differenceInDays > minDaysForProperRenderingOfResourcesGantt) {
          endDate = userSettingsEndDate;
        }
      }
      const date = { startDate: startDate, endDate: endDate };
      this.dateRange = [startDate, endDate];
      dateRangeForResources = DateService.getFormattedDateRange(date);

      this.supplyGroupFilterCriteriaObj.startDate = dateRangeForResources.startDate;
      this.supplyGroupFilterCriteriaObj.endDate = dateRangeForResources.endDate;
      this.supplyGroupFilterCriteriaObj.employeeCodes = defaultGroupPreferences.groupMembers.map(x => x.employeeCode).join(",");
      this.supplyGroupFilterCriteriaObj.availabilityIncludes = this.supplyFilterCriteriaObj.availabilityIncludes;
      this.supplyGroupFilterCriteriaObj.sortBy = this.supplyFilterCriteriaObj.sortBy;
      this.supplyGroupFilterCriteriaObj.groupBy = this.supplyFilterCriteriaObj.groupBy;
    }
  }

  private resetSupplySettingsForDefaultSavedFilter() {
    if (this.defaultSavedFilter) {
      this.supplyFilterCriteriaObj.officeCodes = this.defaultSavedFilter.officeCodes;
      this.supplyFilterCriteriaObj.levelGrades = this.defaultSavedFilter.levelGrades;
      this.supplyFilterCriteriaObj.positionCodes = this.defaultSavedFilter.positionCodes;
      this.supplyFilterCriteriaObj.staffingTags = this.defaultSavedFilter.staffingTags;
      this.supplyFilterCriteriaObj.sortBy = this.defaultSavedFilter.sortBy;
      this.supplyFilterCriteriaObj.certificates = this.defaultSavedFilter.certificates;
      this.supplyFilterCriteriaObj.languages = this.defaultSavedFilter.languages;
      this.supplyFilterCriteriaObj.employeeStatuses = this.defaultSavedFilter.employeeStatuses;
      this.supplyFilterCriteriaObj.practiceAreaCodes = this.defaultSavedFilter.practiceAreaCodes;
      this.supplyFilterCriteriaObj.affiliationRoleCodes = this.defaultSavedFilter.affiliationRoleCodes;
      this.supplyFilterCriteriaObj.staffableAsTypeCodes = this.defaultSavedFilter.staffableAsTypeCodes;
    }
  }

  private getLookupListFromLocalStorage() {
    this.commitmentTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.commitmentTypes);
    //This is sprecific to Resources tab. Hence adding it here.
    this.investmentCategories = this.localStorageService.get(ConstantsMaster.localStorageKeys.investmentCategories);
    this.caseRoleTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.caseRoleTypes);

    //TODO: Hard coding for now to proivde EMEA practice staffing users access to only EMEA data.
    //DELETE once integrated multiple-role based office security is implemented
    if (this.coreService.loggedInUserClaims.Roles?.includes('PracticeStaffing')) {
      this.officeHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.officeHierarchyEMEA);
    } else {
      this.officeHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.officeHierarchy);
    }

    this.officeFlatList = this.localStorageService.get(ConstantsMaster.localStorageKeys.OfficeList);
    this.levelGrades = this.localStorageService.get(ConstantsMaster.localStorageKeys.levelGradesHierarchy);
    this.staffingTagsHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.staffingTagsHierarchy);
    this.staffingTags = this.localStorageService.get(ConstantsMaster.localStorageKeys.staffingTags);
    this.certificates = this.localStorageService.get(ConstantsMaster.localStorageKeys.certificates);
    this.languages = this.localStorageService.get(ConstantsMaster.localStorageKeys.languages);
    this.practiceAreas = this.localStorageService.get(ConstantsMaster.localStorageKeys.practiceAreas);
    this.affiliationRoles = this.localStorageService.get(ConstantsMaster.localStorageKeys.affiliationRoles);
    this.staffableAsTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.staffableAsTypes);
    this.positionsHierarchy = this.localStorageService.get(ConstantsMaster.localStorageKeys.positionsHierarchy);
    this.sortsBy = ConstantsMaster.sortBy;
  }

  //  -------------------------------Overlay-------------------------------//
  openCaseDetailsDialogHandler(event) {
    this.openProjectDetailsDialogHandler(event);
  }

  openResourceDetailsDialogHandler(employeeCode) {
    // if (this.createTeamDialogRef != null) {
    //   this.createTeamDialogRef.close();
    // }

    // close previous resource dialog & open new dialog
    if (this.dialogRef) {
      this.dialogRef.close('no null');
      this.dialogRef = null;
    }

    this.dialogRef = this.dialog.open(ResourceOverlayComponent, {
      closeOnNavigation: true,
      data: {
        employeeCode: employeeCode,
        investmentCategories: this.investmentCategories,
        caseRoleTypes: this.caseRoleTypes,
        showOverlay: true
      }
    });

    this.storeSub.add(this.dialogRef.componentInstance.openResourceDetailsFromProjectDialog.subscribe(empCode => {
      this.openResourceDetailsDialogHandler(empCode);
    }));

    // Listens for click on case name for opening the project details pop-up
    this.storeSub.add(this.dialogRef.componentInstance.openProjectDetailsFromResourceDialog.subscribe(projectData => {
      this.openProjectDetailsDialogHandler(projectData);
    }));

    // Listens for click on notes opening the ag-grid notes pop-up
    this.storeSub.add(this.dialogRef.componentInstance.openNotesDialog.subscribe(projectData => {
      this.openNotesDialogHandler(projectData);
    }));

    // Listens for click on split allocation in context menu of ag-grid
    this.storeSub.add(this.dialogRef.componentInstance.openSplitAllocationDialog.subscribe(projectData => {
      this.openSplitAllocationDialogHandler(projectData);
    }));

    this.storeSub.add(this.dialogRef.componentInstance.updateResourceCommitment.subscribe(updatedCommitment => {
      this.updateResourceCommitmentHandler(updatedCommitment.resourceAllocation);
    }));

    // this.dialogRef.componentInstance.deleteResourceCommitment.subscribe(deletedObj => {
    //   this.deleteResourceCommitmentHandler(deletedObj);
    // });

    // inserts & updates resource data when changes are made to resource
    this.storeSub.add(this.dialogRef.componentInstance.upsertResourceAllocationsToProject.subscribe(updatedData => {
      this.upsertResourceAllocationsToProjectHandler(updatedData.resourceAllocation, updatedData.splitSuccessMessage);
    }));

    this.storeSub.add(this.dialogRef.componentInstance.deleteResourceAllocationFromCase.subscribe(allocation => {
      this.deleteResourceAssignmentFromProjectHandler(allocation.allocationId);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(allocation.resourceAllocation);
    }));

    this.storeSub.add(this.dialogRef.componentInstance.deleteResourceAllocationFromCases.subscribe(allocation => {
      this.deleteResourcesAssignmentsFromProjectHandler(allocation.allocationIds);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(allocation.resourceAllocation);
    }));

    this.storeSub.add(this.dialogRef.componentInstance.deleteResourceAllocationsCommitmentsFromCase.subscribe(dataToDelete => {
      this.deleteResourcesAllocationsCommitments(dataToDelete);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(dataToDelete.resourceAllocation);
    }));

    this.storeSub.add(this.dialogRef.componentInstance.openQuickAddForm.subscribe(event => {
      this.openQuickAddFormHandler(event);
    }));

    this.dialogRef.componentInstance.upsertStaffableAsRoleEmitter.subscribe(event => {
      this.upsertStaffableAsRole(event);
    });

    this.dialogRef.componentInstance.deleteStaffableAsRoleEmitter.subscribe(event => {
      this.deleteStaffableAsRole(event);
    });

    //// updates resource data when changes are made to resource
    // this.dialogRef.componentInstance.updateResourceDataForProject.subscribe(updatedData => {
    //  this.resourceAssignmentService.updateResourceAssignmentToCase(updatedData, this.dialogRef, this.projectDialogRef);
    // });

    this.storeSub.add(this.dialogRef.beforeClosed().subscribe((result) => {
      if (result !== 'no null') {
        this.dialogRef = null;
      }
    }));

  }

  openProjectDetailsDialogHandler(projectData) {
    // if (this.createTeamDialogRef != null) {
    //   this.createTeamDialogRef.close();
    // }

    // close previous project dialog & open new dialog
    if (this.projectDialogRef) {
      this.projectDialogRef.close('no null');
    }

    // if (this.projectDialogRef == null) {
    this.projectDialogRef = this.dialog.open(ProjectOverlayComponent, {
      closeOnNavigation: true,
      data: {
        projectData: projectData,
        investmentCategories: this.investmentCategories,
        caseRoleTypes: this.caseRoleTypes,
        showDialog: true
      }
    });

    // Listens for click on resource name for opening the resource details pop-up
    this.storeSub.add(this.projectDialogRef.componentInstance.openResourceDetailsFromProjectDialog.subscribe(employeeCode => {
      this.openResourceDetailsDialogHandler(employeeCode);
    }));

    //// updates resource data when changes are made to resource
    // this.projectDialogRef.componentInstance.updateResourceAssignmentToProject.subscribe(updatedData => {
    //  this.resourceAssignmentService.updateResourceAssignmentToCase(updatedData, this.dialogRef, this.projectDialogRef);
    // });

    // Listens for click on notes opening the ag-grid notes pop-up
    this.storeSub.add(this.projectDialogRef.componentInstance.openNotesDialog.subscribe(projectData => {
      this.openNotesDialogHandler(projectData);
    }));

    // Listens for click on split allocation in context menu of ag-grid
    this.storeSub.add(this.projectDialogRef.componentInstance.openSplitAllocationDialog.subscribe(projectData => {
      this.openSplitAllocationDialogHandler(projectData);
    }));

    // inserts & updates resource data when changes are made to resource
    this.storeSub.add(this.projectDialogRef.componentInstance.upsertResourceAllocationsToProject.subscribe(updatedData => {
      this.upsertResourceAllocationsToProjectHandler(updatedData.resourceAllocation);
    }));

    // inserts & updates placeholder data when changes are made to placeholder
    this.storeSub.add(this.projectDialogRef.componentInstance.upsertPlaceholderAllocationsToProject.subscribe(updatedData => {
      this.placeholderAssignmentService.upsertPlcaeholderAllocations(updatedData, null, this.projectDialogRef);
    }));

    // deletes resource data
    this.storeSub.add(this.projectDialogRef.componentInstance.deleteResourceFromProject.subscribe(allocation => {
      this.deleteResourceAssignmentFromProjectHandler(allocation.allocationId);
    }));

    // deletes resources data
    this.storeSub.add(this.projectDialogRef.componentInstance.deleteResourcesFromProject.subscribe(updatedData => {
      this.deleteResourcesAssignmentsFromProjectHandler(updatedData.allocationIds);
      this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(updatedData.resourceAllocation);
    }));

    // opens add resource popup
    this.storeSub.add(this.projectDialogRef.componentInstance.openQuickAddForm.subscribe(projectData => {
      this.openQuickAddFormHandler(projectData);
    }));

    this.storeSub.add(this.projectDialogRef.componentInstance.openPlaceholderForm.subscribe(projectData => {
      this.openPlaceholderFormHandler(projectData);
    }));

    // insert sku case term
    this.storeSub.add(this.projectDialogRef.componentInstance.insertSkuCaseTermsForProject.subscribe(skuTab => {
      this.skuCaseTermService.insertSKUCaseTerms(skuTab, this.dialogRef, this.projectDialogRef);
    }));

    // update sku case term
    this.storeSub.add(this.projectDialogRef.componentInstance.updateSkuCaseTermsForProject.subscribe(skuTab => {
      this.skuCaseTermService.updateSKUCaseTerms(skuTab, this.dialogRef, this.projectDialogRef);
    }));

    // delete sku case term
    this.storeSub.add(this.projectDialogRef.componentInstance.deleteSkuCaseTermsForProject.subscribe(skuTab => {
      this.skuCaseTermService.deleteSKUCaseTerms(skuTab, this.dialogRef, this.projectDialogRef);
    }));

    // add project to user settings show list
    this.storeSub.add(this.projectDialogRef.componentInstance.addProjectToUserExceptionShowList.subscribe(event => {
      this.userpreferencesService.addCaseOpportunityToUserExceptionShowList(event);
    }));

    // remove project to user settings show list
    this.storeSub.add(this.projectDialogRef.componentInstance.removeProjectFromUserExceptionShowList.subscribe(event => {
      this.userpreferencesService.removeCaseOpportunityFromUserExceptionShowList(event);
    }));

    // add project to user settings hide list
    this.storeSub.add(this.projectDialogRef.componentInstance.addProjectToUserExceptionHideList.subscribe(event => {
      this.userpreferencesService.addCaseOpportunityToUserExceptionHideList(event);
    }));

    // remove project from user settings hide list
    this.storeSub.add(this.projectDialogRef.componentInstance.removeProjectFromUserExceptionHideList.subscribe(event => {
      this.userpreferencesService.removeCaseOpportunityFromUserExceptionHideList(event, true);
    }));

    // open case roll pop-up
    this.storeSub.add(this.projectDialogRef.componentInstance.openCaseRollForm.subscribe(event => {
      this.openCaseRollFormHandler(event);
    }));

    // update pipeline data in staffing db
    this.storeSub.add(this.projectDialogRef.componentInstance.updateProjectChanges.subscribe(event => {
      this.opportunityService.updateProjectChangesHandler(event, this.projectDialogRef);
      this.getActiveResources(this.supplyFilterCriteriaObj);
    }));

    this.storeSub.add(this.projectDialogRef.beforeClosed().subscribe(result => {
      if (result !== 'no null') {
        this.projectDialogRef = null;
      }
    }));
    // } else {
    //   this.notifyService.showValidationMsg('Opening multiple cases/opporutnities not allowed.');
    // }
  }

  private openNotesDialogHandler(event) {
    // class is required to center align the modal on large screens
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        projectData: event.projectData,
        popupType: event.popupType
      }
    };
    this.bsModalRef = this.modalService.show(AgGridNotesComponent, config);

    // inserts & updates resource data when changes are made to notes of an allocation
    this.storeSub.add(this.bsModalRef.content.updateNotesForAllocation.subscribe(updatedData => {
      this.upsertResourceAllocationsToProjectHandler(updatedData.resourceAllocation);
    }));
  }

  // opens from - resource-overlay.component, project-overlay.component
  openSplitAllocationDialogHandler(event) {
    // check if the popup is already open
    // if (!this.bsModalRef) {
    // class is required to center align the modal on large screens
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        allocationData: event.allocationData,
        popupType: event.popupType
      }
    };
    this.bsModalRef = this.modalService.show(AgGridSplitAllocationPopUpComponent, config);

    // inserts & updates resource data when changes are made to notes of an allocation
    this.storeSub.add(this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(upsertData => {
      this.upsertResourceAllocationsToProjectHandler(upsertData.resourceAllocation);
    }));

    // clear bsModalRef value on closing modal
    this.storeSub.add(this.modalService.onHidden.subscribe(() => {
      this.bsModalRef = null;
    }));
    // }
  }


  private openCaseRollFormHandler(event) {
    // class is required to center align the modal on large screens
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        project: event.project
      }
    };
    this.bsModalRef = this.modalService.show(CaseRollFormComponent, config);

    this.storeSub.add(this.bsModalRef.content.upsertCaseRollAndAllocations.subscribe(response => {
      this.caseRollService.upsertCaseRollAndAllocationsHandler(response.caseRoll, response.resourceAllocations, this.projectDialogRef);
    }));

    this.storeSub.add(this.bsModalRef.content.revertCaseRollAndAllocations.subscribe(response => {
      this.caseRollService.revertCaseRollAndAllocationsHandler(response.caseRoll, response.resourceAllocations, this.projectDialogRef);
    }));
  }

  // ------------------Pop-Ups -----------------------------------------------------------
  public openInfoModal(data) {

    this.modalService.show(InfoIconModalComponent, {
      animated: true,
      backdrop: true,
      ignoreBackdropClick: false,
      initialState: {
      },
    });
  }

  public openQuickAddFormHandler(modalData) {
    // class is required to center align the modal on large screens
    if (modalData) {

      const config = {
        class: 'modal-dialog-centered',
        ignoreBackdropClick: true,
        initialState: {
          commitmentTypeCode: modalData.commitmentTypeCode,
          commitmentData: modalData.commitmentData,
          resourceAllocationData: modalData.resourceAllocationData,
          isUpdateModal: modalData.isUpdateModal
        }
      };
      this.bsModalRef = this.modalService.show(QuickAddFormComponent, config);

    } else {

      const config = {
        class: 'modal-dialog-centered',
        ignoreBackdropClick: true
      };

      this.bsModalRef = this.modalService.show(QuickAddFormComponent, config);

    }

    // TODO: Same functionality is available in QuickAddDialog.Service file
    // There should be one place to register all emitter events to prevent functionality split
    // from different parts of the screen like
    // open overlay from home vs resource tab
    this.storeSub.add(this.bsModalRef.content.insertResourcesCommitments.subscribe(
      (commitment) => {
        this.addResourceCommitmentHandler(commitment);
      }));

    this.storeSub.add(this.bsModalRef.content.updateResourceCommitment.subscribe(updatedCommitment => {
      this.updateResourceCommitmentHandler(updatedCommitment.resourceAllocation);
    }));


    this.storeSub.add(this.bsModalRef.content.deleteResourceCommitment.subscribe(deletedObjId => {
      this.deleteResourceCommitmentHandler(deletedObjId);
    }));

    // inserts & updates resource data when changes are made to resource
    this.storeSub.add(this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(
      (upsertedAllocations) => {
        this.upsertResourceAllocationsToProjectHandler(
          upsertedAllocations.resourceAllocation, upsertedAllocations.splitSuccessMessage,
          upsertedAllocations.allocationDataBeforeSplitting
        );
      }
    ));

    // inserts & updates placeholder data when changes are made to resource
    this.storeSub.add(this.bsModalRef.content.upsertPlaceholderAllocationsToProject.subscribe(
      (upsertedAllocations) => {
        this.upsertPlaceholderAllocationsToProjectHandler(
          upsertedAllocations
        );
      }
    ));

    this.storeSub.add(this.bsModalRef.content.deleteResourceAllocationFromCase.subscribe(
      (allocation) => {
        this.deleteResourceAssignmentFromProjectHandler(allocation.allocationId);
        this.resourceAssignmentService.deletePlaygroundAllocationsForCasePlanningMetrics(allocation.resourceAllocation);
      }
    ));

    this.storeSub.add(this.bsModalRef.content.openBackFillPopUp.subscribe((result) => {
      this.openBackFillFormHandler(result);
    }));

    this.storeSub.add(this.bsModalRef.content.openOverlappedTeamsPopup.subscribe((result) => {
      this.openOverlappedTeamsFormHandler(result);
    }));
  }

  public openPlaceholderFormHandler(modalData) {
    // class is required to center align the modal on large screens
    let initialState = null;

    if (modalData) {

      initialState = {
        projectData: modalData.project,
        placeholderAllocationData: modalData.placeholderAllocationData,
        isUpdateModal: modalData.isUpdateModal
      };

    }

    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(PlaceholderFormComponent, config);

    // inserts & updates resource data when changes are made to resource
    this.bsModalRef.content.upsertPlaceholderAllocationsToProject.subscribe(updatedCommitment => {
      this.placeholderAssignmentService.upsertPlcaeholderAllocations(updatedCommitment, null, this.projectDialogRef);
    });

    this.bsModalRef.content.deletePlaceholderAllocationByIds.subscribe(event => {
      this.placeholderAssignmentService.deletePlaceHoldersByIds(event, this.projectDialogRef);
    });

    this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe(event => {
      this.resourceAssignmentService.upsertResourceAllocationsToProject(event, null, this.projectDialogRef);
      this.resourceAssignmentService.upsertPlaygroundAllocationsForCasePlanningMetrics(event.resourceAllocation);
    });

    this.bsModalRef.content.openBackFillPopUp.subscribe(result => {
      this.backfillDialogService.projectDialogRef = this.projectDialogRef;
      this.backfillDialogService.openBackFillFormHandler(result);
    });
  }

  private openBackFillFormHandler(event) {
    // class is required to center align the modal on large screens
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        project: event.project,
        resourceAllocation: event.resourceAllocation,
        showMoreThanYearWarning: event.showMoreThanYearWarning,
        allocationDataBeforeSplitting: event.allocationDataBeforeSplitting
      },
    };
    this.bsModalRef = this.modalService.show(BackfillFormComponent, config);

    this.storeSub.add(this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe((data) => {
      event.project.allocatedResources = event.project.allocatedResources.concat(
        data.resourceAllocation
      );
      this.upsertResourceAllocationsToProjectHandler(data.resourceAllocation, null, data.allocationDataBeforeSplitting);
    }));
  }
  

  private openOverlappedTeamsFormHandler(event) {
    // class is required to center align the modal on large screens
    const config = {
      class: 'modal-dialog-centered',
      ignoreBackdropClick: true,
      initialState: {
        projectData: event.projectData,
        overlappedTeams: event.overlappedTeams,
        allocation: event.allocation
      },
    };
    this.bsModalRef = this.modalService.show(OverlappedTeamsFormComponent, config);

    this.storeSub.add(this.bsModalRef.content.upsertResourceAllocationsToProject.subscribe((data) => {
      this.upsertResourceAllocationsToProjectHandler(data.resourceAllocation);
    }));
  }

  openSplitAllocationPopupHandler(event) {
    this.openSplitAllocationDialogHandler(event);
  }
  
  openOverlappedTeamsPopupHandler(event) {
    this.overlappedTeamDialogService.openOverlappedTeamsFormHandler(event);
  }

  updateThresholdRangeHandler(event) {
    this.thresholdRangeValue = event
  }

  upsertResourceFilterHandler(resourceFiltersData: ResourceFilter[]) {
    this.dispatchResourcesLoaderAction(true);

    this.store.dispatch(
      new resourcesActions.UpsertResourceFilters(resourceFiltersData)
    );
  }

  userPreferencesSupplyGroupsRefreshHandler(userPreferenceSupplyGroups) {
    if (!!userPreferenceSupplyGroups && userPreferenceSupplyGroups.length > 0) {
      this.coreService.setUserPreferenceSupplyGroups(userPreferenceSupplyGroups);
      this.supplyGroupPreferences = userPreferenceSupplyGroups;

      this.loadResourcesSupplyGroupDropdown();
    }
  }

  deleteSupplyGroupsRefreshHandler(groupIds: string[]) {
    if (!!groupIds && groupIds.length > 0) {
      this.coreService.loadUserPreferenceSupplyGroups().subscribe(userPreferencesSupplyGroups => {
        userPreferencesSupplyGroups = userPreferencesSupplyGroups.filter(x => !groupIds.includes(x.id));
        this.coreService.setUserPreferenceSupplyGroups(userPreferencesSupplyGroups);
        this.supplyGroupPreferences = userPreferencesSupplyGroups;
      });

      this.loadResourcesSupplyGroupDropdown();
    }
  }

  onSupplyGroupFilterChangedHandler(selectedSupplyDropdownId) {
    let selectedFilterObj = this.allSupplyDropdownOptions.find(x => x.id == selectedSupplyDropdownId);
    selectedFilterObj.selected = true;
    this.selectedFilterName = selectedFilterObj.text;

    switch (selectedFilterObj.filterGroupId) {
      case ResourcesSupplyFilterGroupEnum.SUPPLY_GROUPS: {
        this.supplyGroupFilterCriteriaObj.employeeCodes = selectedFilterObj.value;
        this.updateSupplyGroupFilterCriteria();
        this.getResourcesByGroup(this.supplyGroupFilterCriteriaObj);
        break;
      }

      case ResourcesSupplyFilterGroupEnum.SAVED_FILTERS: {
        const selectedsavedResourceFilters = this.savedResourceFilters.find(x => x.id == selectedFilterObj.id);

        this.supplyFilterCriteriaObj.officeCodes = selectedsavedResourceFilters.officeCodes;
        this.supplyFilterCriteriaObj.levelGrades = selectedsavedResourceFilters.levelGrades;
        this.supplyFilterCriteriaObj.positionCodes = selectedsavedResourceFilters.positionCodes;
        this.supplyFilterCriteriaObj.staffingTags = selectedsavedResourceFilters.staffingTags;
        this.supplyFilterCriteriaObj.sortBy = selectedsavedResourceFilters.sortBy;
        this.supplyFilterCriteriaObj.certificates = selectedsavedResourceFilters.certificates;
        this.supplyFilterCriteriaObj.languages = selectedsavedResourceFilters.languages;
        this.supplyFilterCriteriaObj.employeeStatuses = selectedsavedResourceFilters.employeeStatuses;
        this.supplyFilterCriteriaObj.practiceAreaCodes = selectedsavedResourceFilters.practiceAreaCodes;
        this.supplyFilterCriteriaObj.affiliationRoleCodes = selectedsavedResourceFilters.affiliationRoleCodes;
        this.supplyFilterCriteriaObj.staffableAsTypeCodes = selectedsavedResourceFilters.staffableAsTypeCodes;

        this.getActiveResources(this.supplyFilterCriteriaObj);

        break;
      }

      case ResourcesSupplyFilterGroupEnum.STAFFING_SETTINGS: {

        this.updateSupplyAndDemandSettings();
        this.getActiveResources(this.supplyFilterCriteriaObj);

        break;
      }

    }
  }
}
