import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppSettings } from './interfaces/appSettings.interface';
import { CoreService } from '../core/core.service';
import { Resource } from './interfaces/resource.interface';
import { Project } from './interfaces/project.interface';
import { ResourceAllocation } from './interfaces/resourceAllocation.interface';
import { ResourceFilter } from './interfaces/resource-filter.interface';
import { Commitment } from './interfaces/commitment.interface';
import { PlanningCardModel } from './interfaces/planningCardModel.interface';
import { Client } from './interfaces/client.interface';

@Injectable()
export class SharedService {

  public appSettings: AppSettings;

  constructor(
    private http: HttpClient, 
    private coreService: CoreService) {
    this.appSettings = environment.settings;
  }

  getCasesBySearchString(searchString): Observable<Project[]> {
    const params = new HttpParams({
      fromObject: {
        'searchString': searchString
      }
    });
    return this.http.get<any>(`
    ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/projectAggregator/caseTypeahead`,
      { params: params });
  }

  getResourcesBySearchString(searchString): Observable<Resource[]> {
    const params = new HttpParams({
      fromObject: {
        'searchString': searchString
      }
    });
    return this.http.get<any>(`
    ${this.coreService.appSettings.resourcesApiBaseUrl}/api/resources/employeesBySearchString`, { params: params }).pipe(
      map((data: Resource[]) => {

        data.forEach(resource => {
          resource.employeeSearchData = `${resource.employeeCode} ${resource.fullName} ${resource.firstName} ${resource.lastName}`
        })
        return data;
      })
    );;
  }

  getClientsBySearchString(searchString): Observable<Client[]> {
    const params = new HttpParams({
      fromObject: {
        'searchString': searchString
      }
    });
    return this.http.get<Client[]>(`${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/clientCaseAPI/typeaheadClients`, { params: params });
  }

  getCaseDetailsAndAllocations(oldCaseCode): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        'oldCaseCode': oldCaseCode
      }
    });
    return this.http.get<any>(`
      ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/staffingAggregator/caseandAllocationsbycasecode`, { params: params });
  }

  getOpportunityDetailsAndAllocations(pipelineId): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        'pipelineId': pipelineId
      }
    });
    return this.http.get<any>(
      `${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/staffingAggregator/opportunityAndAllocationsByPipelineId`,
      { params: params });
  }

  getProjectsBySearchString(searchString): Observable<Project[]> {
    // 'encodeURIComponent' to embed special characters in search term
    const params = new HttpParams({
      fromObject: {
        'searchString': encodeURIComponent(searchString)
      }
    });
    return this.http.get<any>(`
    ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/projectAggregator/projectTypeahead`, { params: params }
    ).pipe(
      map((data: Project[]) => {
        data.forEach(project => {
          project.projectName = project.oldCaseCode ? project.caseName : project.opportunityName;
        });
        return data;
      })
    );
  }

  getPlanningCardsBySearchString(searchString): Observable<PlanningCardModel[]> {
        // 'encodeURIComponent' to embed special characters in search term
        return this.http.get<any>(`
        ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/PlanningCard/planningCardTypeAhead?searchString=${encodeURIComponent(searchString)}`);
  }

  getCaseAllocations(oldCaseCode, effectiveFromDate): Observable<ResourceAllocation[]> {
    const params = new HttpParams({
      fromObject: {
        'oldCaseCode': oldCaseCode,
        'effectiveFromDate': effectiveFromDate
      }
    });
    return this.http.get<any>(`
    ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/staffingAggregator/allocationsByCaseCode`, { params: params });
  }

  getSavedResourceFiltersForLoggedInUser() {
    const params = new HttpParams({
      fromObject: {
        'employeeCode': this.coreService.loggedInUser.employeeCode
      }
    });
    return this.http.get<any>(`
    ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/userCustomFilter`, { params: params });
  }

  upsertResourceFiltersForLoggedInUser(resourceFiltersData: ResourceFilter[]) {
    resourceFiltersData.forEach(resourceFilter => resourceFilter.employeeCode = resourceFilter.lastUpdatedBy = this.coreService.loggedInUser.employeeCode);
    return this.http.post<ResourceFilter[]>(
      `${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/userCustomFilter`, resourceFiltersData);
  }

  deleteSavedResourceFilter(filterIdToDelete: string) {
    const params = new HttpParams({
      fromObject: {
        'filterIdToDelete': filterIdToDelete,
        'lastUpdatedBy': this.coreService.loggedInUser.employeeCode
      }
    });
    return this.http.delete<any>(`
    ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/userCustomFilter`, { params: params });
  }

  getOverlappingTeamsInPreviousProjects(employeeCode: string, caseStartDate: string): Observable<ResourceAllocation[]> {
    const params = new HttpParams({
      fromObject: {
        'employeeCode': employeeCode,
        'date': caseStartDate
      }
    });
    return this.http.get<ResourceAllocation[]>(`
    ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/ResourceAllocationAggregator/getLastTeamByEmployeeCode`, { params: params });
  }

  public checkPegRingfenceAllocationAndInsertDownDayCommitments(resourceAllocation : any): Observable<Commitment[]> {
    const requesParam = {
        'resourceAllocations': resourceAllocation
    };
    return this.http.post<Commitment[]>(`
    ${this.coreService.appSettings.ocelotApiGatewayBaseUrl}/api/commitment/checkPegRingfenceAllocationAndInsertDownDayCommitments`, requesParam);
}

}
