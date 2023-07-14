import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { ResourceService } from 'src/app/shared/helperServices/resource.service';
import { CommitmentType } from 'src/app/shared/interfaces/commitmentType.interface';
import { CoveoAnalyticsClickParams } from 'src/app/shared/interfaces/coveo-analytics-click-params.interface';
import { Office } from 'src/app/shared/interfaces/office.interface';
import { SupplyFilterCriteria } from 'src/app/shared/interfaces/supplyFilterCriteria.interface';
import { LocalStorageService } from 'src/app/shared/local-storage.service';
import { CoreService } from '../core.service';
import { SeachbarService } from './searchbar.service';
import { UniversalSearchOptions } from 'src/app/shared/constants/enumMaster';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  searchString = "";
  searchInResources = true;
  searchInCases = false;
  changeInSearchQuery$: Subject<string> = new Subject();
  resourceLoader = '';
  activeCaseLoader = '';
  inActiveCaseLoader = '';
  commitmentTypes: CommitmentType[];
  supplyFilterCriteriaObj: SupplyFilterCriteria = {} as SupplyFilterCriteria;
  officeFlatList: Office[];

  public resourcesList = []
  public activeCaseList = []
  public inActiveCaseList = []

  constructor(
    private localStorageService: LocalStorageService,
    private coreService: CoreService,
    private seachbarService: SeachbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.subscribeSearchQueryChanges();
  }

  subscribeSearchQueryChanges() {
    this.changeInSearchQuery$.pipe(debounceTime(500) ).subscribe(() => {
      if(this.searchString.length < 3)
        return;
        
      this.commitmentTypes = this.localStorageService.get(ConstantsMaster.localStorageKeys.commitmentTypes);
      const userPreferences = this.coreService.getUserPreferencesValue();


      if (this.searchInResources && this.searchInCases) {
        this.resourceLoader = 'Loading...';
        this.activeCaseLoader = 'Loading...';
        this.inActiveCaseLoader = 'Loading...';
        this.seachbarService.getSearchByQuery(this.searchString, UniversalSearchOptions.EVERYTHING).subscribe(searchData => {
          this.setOfficeDetailsFromLocalStore(searchData.resources);
          const availableResources = ResourceService.createResourcesDataForStaffing(searchData.resources, null, null,
            this.supplyFilterCriteriaObj, this.commitmentTypes, userPreferences, true);
          this.resourcesList = availableResources;
          this.resourceLoader = this.resourcesList && this.resourcesList.length > 0 ? '' : 'No data found';

          this.activeCaseList = searchData.projects?.filter(activeData => activeData.projectStatus == 'Active');
          this.activeCaseLoader = this.activeCaseList && this.activeCaseList.length > 0 ? '' : 'No data found';

          this.inActiveCaseList = searchData.projects?.filter(activeData => activeData.projectStatus == 'Inactive');
          this.inActiveCaseLoader = this.inActiveCaseList && this.inActiveCaseList.length > 0 ? '' : 'No data found';
        });
      } else if (this.searchInResources) {
        this.resourceLoader = 'Loading...';
        this.seachbarService.getSearchByQuery(this.searchString, UniversalSearchOptions.RESOURCE).subscribe(searchData => {
          this.setOfficeDetailsFromLocalStore(searchData);
          const availableResources = ResourceService.createResourcesDataForStaffing(searchData, null, null,
            this.supplyFilterCriteriaObj, this.commitmentTypes, userPreferences, true);
          this.resourcesList = availableResources;
          this.resourceLoader = this.resourcesList && this.resourcesList.length > 0 ? '' : 'No data found';
        })
      } else if (this.searchInCases) {
        this.activeCaseLoader = 'Loading...';
        this.inActiveCaseLoader = 'Loading...';
        this.seachbarService.getSearchByQuery(this.searchString, UniversalSearchOptions.PROJECT).subscribe(searchData => {
          this.activeCaseList = searchData.filter(activeData => activeData.projectStatus == 'Active');
          this.activeCaseLoader = this.activeCaseList && this.activeCaseList.length > 0 ? '' : 'No data found';
          this.inActiveCaseList = searchData.filter(activeData => activeData.projectStatus == 'Inactive');
          this.inActiveCaseLoader = this.inActiveCaseList && this.inActiveCaseList.length > 0 ? '' : 'No data found';
        })
      }
    });
  }

  changesInQuery() {
    if (this.searchString && this.searchString.length > 2) {
      this.resourcesList = this.activeCaseList = this.inActiveCaseList = [];
      this.changeInSearchQuery$.next();
    }
  }

  toggleSearch(searchInSource) {
    switch (searchInSource) {
      case 'resources':
        {
          this.searchInResources = true;
          this.searchInCases = false;
          break;
        }
      case 'cases':
        {
          this.searchInResources = false;
          this.searchInCases = true;
          break;
        }
      default: {
        this.searchInResources = true;
        this.searchInCases = true;
        break;
      }
    }
    this.changeInSearchQuery$.next();
  }

  openProjectDetailsDialogHandler(projectData) {
    // this.overlayDialogService.openProjectDetailsDialogHandler(projectData);
    const analyticsClickLog: CoveoAnalyticsClickParams = this.setParamsForCoveoAnalyticsClickEvent(projectData);
    this.seachbarService.analyticsClickLog(analyticsClickLog).subscribe(() => { });
    this.searchString = '';
    this.router.navigate(['/overlay'], { queryParams: this.getQueryParamValue(null, projectData) })
    this.closeDialog();
  }

  openResourceDetailsDialogHandler(resource) {
    //this.overlayDialogService.openResourceDetailsDialogHandler(employeeCode);
    const analyticsClickLog: CoveoAnalyticsClickParams = this.setParamsForCoveoAnalyticsClickEvent(resource);
    this.seachbarService.analyticsClickLog(analyticsClickLog).subscribe(() => { });

    this.searchString = '';
    this.router.navigate(['/overlay'], { queryParams: this.getQueryParamValue(resource) })
    this.closeDialog();
  }

  getQueryParamValue(resource = null, projectData = null) {
    if (resource) {
      return { employee: resource.employeeCode };
    }
    else if (projectData) {
      if (projectData.type == 'Opportunity') {
        return { pipelineId: projectData.pipelineId }
      }
      else {
        return { oldCaseCode: projectData.oldCaseCode };
      }
    }
  }

  private setOfficeDetailsFromLocalStore(searchData) {
    if (!searchData) return;

    this.officeFlatList = this.localStorageService.get(ConstantsMaster.localStorageKeys.OfficeList);

    searchData.resources?.forEach(resource => {
      resource.office = this.setOfficeDetailsByOfficeCode(resource.office);
      resource.schedulingOffice = this.setOfficeDetailsByOfficeCode(resource.schedulingOffice);
    });
    searchData.terminations?.forEach(termination => {
      termination.operatingOffice = this.setOfficeDetailsByOfficeCode(termination.operatingOffice);
      return termination;
    });
    searchData.transfers?.forEach(transfer => {
      transfer.operatingOffice = this.setOfficeDetailsByOfficeCode(transfer.operatingOffice);
      transfer.operatingOfficeCurrent = this.setOfficeDetailsByOfficeCode(transfer.operatingOfficeCurrent);
      transfer.operatingOfficeProposed = this.setOfficeDetailsByOfficeCode(transfer.operatingOfficeProposed);
      return transfer;
    });
    searchData.promotions?.forEach(promotion => {
      promotion.operatingOffice = this.setOfficeDetailsByOfficeCode(promotion.operatingOffice);
      return promotion;
    });
    searchData.transitions?.forEach(transition => {
      transition.operatingOffice = this.setOfficeDetailsByOfficeCode(transition.operatingOffice);
      return transition;
    });
  }

  private setOfficeDetailsByOfficeCode(office: Office) {
    if (!office.officeCode || !office.officeAbbreviation || !office.officeName) {
      if (office.officeCode) {
        const officeData = this.officeFlatList.find(x => x.officeCode === office.officeCode)
        office.officeAbbreviation = officeData.officeAbbreviation;
        office.officeName = officeData.officeName;
      }
      else if (office.officeAbbreviation) {
        const officeData = this.officeFlatList.find(x => x.officeAbbreviation === office.officeAbbreviation)
        office.officeCode = officeData.officeCode;
        office.officeName = officeData.officeName;
      }
      else if (office.officeName) {
        const officeData = this.officeFlatList.find(x => x.officeName === office.officeName)
        office.officeCode = officeData.officeCode;
        office.officeAbbreviation = officeData.officeAbbreviation;
      }
    }
    return office;
  }

  private setParamsForCoveoAnalyticsClickEvent(obj) {
    const analyticsClickLog: CoveoAnalyticsClickParams = {
      documentUri: obj.uri,
      documentUriHash: obj.uriHash,
      searchQueryUid: obj.searchUid,
      sourceName: obj.source,
      collectionName: obj.sysCollection,
      anonymous: false,
      userName: this.coreService.loggedInUser.internetAddress,
      userDisplayName: this.coreService.loggedInUser.fullName,
      documentTitle: obj.title,
      originLevel2: this.searchInResources && !this.searchInCases
        ? UniversalSearchOptions.RESOURCE
        : !this.searchInResources && this.searchInCases
          ? UniversalSearchOptions.PROJECT
          : UniversalSearchOptions.EVERYTHING
    }

    return analyticsClickLog;
  }

  closeDialog() {
    this.searchString = '';
  }
}
