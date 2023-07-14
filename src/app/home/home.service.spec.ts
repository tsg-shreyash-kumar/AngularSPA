//// ----------------------- Angular Package References ----------------------------------//
//import { TestBed, inject } from '@angular/core/testing';
//import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

//// ----------------------- Application References ----------------------------------//
//import { HomeService } from './home.service';
//import { CoreService } from '../core/core.service';
//import { MockCoreService, FAKE_EMPLOYEE } from '../shared/mocks/mock-core-service';
//import { FAKE_PROJECTS, FAKE_CASES, FAKE_RESOURCEGROUPS, FAKE_OFFICES, FAKE_SEARCHED_RESOURCES } from '../shared/mocks/mock-home-service';
//import { ResourceAllocation } from '../shared/interfaces/resourceAllocation.interface';

//describe('HomeService', () => {
//  let homeService: HomeService = null;
//  let coreService: CoreService = null;
//  let httpMock: HttpTestingController;  // to mock requests and the flush method to provide dummy values as responses

//  beforeEach(() => TestBed.configureTestingModule({
//    imports: [HttpClientTestingModule],
//    providers: [
//      HomeService,
//      { provide: CoreService, useClass: MockCoreService }]
//  }));

//  beforeEach(inject([HomeService, HttpTestingController], (service: HomeService, mock: HttpTestingController) => {
//    homeService = service;
//    coreService = TestBed.get(CoreService);
//    httpMock = mock;
//  }));

//  afterEach(() => {
//    httpMock.verify();
//  });

//  it('should be created', () => {
//    expect(homeService).toBeTruthy();
//  });

//  // ---------------Tests for getting Projects------------------------------------

//  describe('SubGroup - Projects', () => {

//    it('getProjectsByOffices() : should return an Observable<Project[]> for single office', () => {
//      // Arrange
//      const startDate = '2018-10-24';
//      const endDate = '2018-12-24';
//      const officeCodes = '112';
//      const startindex = 1;
//      const pageSize = 20;

//      // Act
//      homeService.getProjectsByOffices(startDate, endDate, officeCodes, startindex, pageSize).subscribe(projects => {
//        expect(projects).toBe(FAKE_PROJECTS);
//      });
//      const httpReq = httpMock.expectOne(req => req.method === 'GET' &&
//        req.url === `${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/project/projectsbyoffices`);
//      httpReq.flush(FAKE_PROJECTS);

//      // Assert
//      expect(httpReq.request.method).toBe('GET');
//      expect(httpReq.request.params.get('officeCodes').toString()).toEqual(officeCodes.toString());
//      expect(httpReq.request.params.get('startDate')).toEqual(startDate);
//      expect(httpReq.request.params.get('endDate')).toEqual(endDate);
//    });

//    it('getProjectsByOffices() : should return an Observable<Project[]> for multiple offices', () => {
//      // Arrange
//      const startDate = '2018-10-24';
//      const endDate = '2018-12-24';
//      const officeCodes = '112';
//      const startindex = 1;
//      const pageSize = 20;

//      // Act
//      homeService.getProjectsByOffices(startDate, endDate, officeCodes, startindex, pageSize).subscribe(projects => {
//        expect(projects).toBe(FAKE_PROJECTS);
//      });
//      const httpReq = httpMock.expectOne(req => req.method === 'GET' &&
//        req.url === `${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/project/projectsbyoffices`);
//      httpReq.flush(FAKE_PROJECTS);

//      // Assert
//      expect(httpReq.request.method).toBe('GET');
//      expect(httpReq.request.params.get('officeCodes')).toEqual(officeCodes);
//      expect(httpReq.request.params.get('startDate')).toEqual(startDate);
//      expect(httpReq.request.params.get('endDate')).toEqual(endDate);
//    });

//  });

//  // ---------------Tests for getting/saving Resources------------------------------------

//  describe('SubGroup - Resources', () => {

//    it('getAvailableResourcesByOffices() : should return an Observable<ResourceGroup[]>', () => {
//      // Arrange
//      const startDate = '10-Jun-2019';
//      const endDate = '23-Jun-2019';
//      const officeCodes = '110';


//      // Act
//      homeService.getAvailableResourcesByOffices(startDate, endDate, officeCodes).subscribe(resourceGroups => {
//        expect(resourceGroups).toBe(FAKE_RESOURCEGROUPS);
//      });
//      const httpReq = httpMock.expectOne(req => req.method === 'GET' &&
//        req.url === `${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/aggregations/availableresourcesbyoffices`);
//      httpReq.flush(FAKE_RESOURCEGROUPS);

//      // Assert
//      expect(httpReq.request.method).toBe('GET');
//      expect(httpReq.request.params.get('officeCodes').toString()).toEqual(officeCodes);
//    });

//    it('getResourcesBySearchString() : should return an Observable<Employee[]>', () => {
//      // Arrange
//      const searchString = 'erika';

//      // Act
//      homeService.getResourcesBySearchString(searchString).subscribe(resources => {
//        expect(resources).toBe(FAKE_SEARCHED_RESOURCES);
//      });
//      const httpReq = httpMock.expectOne(req => req.method === 'GET' &&
//        req.url === `${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/resources/employeesBySearchString`);
//      httpReq.flush(FAKE_SEARCHED_RESOURCES);

//      // Assert
//      expect(httpReq.request.method).toBe('GET');
//      expect(httpReq.request.params.get('searchString').toString()).toEqual(searchString);
//    });

//    it('getResourceDetails() : should return an Observable<any>', () => {
//      // Arrange
//      const employeeCode = 37995;
//      const resourceDetailsUrl = `${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/aggregations/resourceDetails`;
//      const employeeDetailsUrl = 'http://localhost:1822/staffing/api/employee/employeebycode';


//      // Act
//      homeService.getResourceDetails(employeeCode).subscribe(details => {
//        expect(details[0]).toEqual({});
//        expect(Object.assign({}, {})).toEqual(
//          jasmine.objectContaining(Object.assign({}, {}))
//        );

//      });
//      const httpResourceDetailsReq = httpMock.expectOne(req => req.method === 'GET' && req.url === resourceDetailsUrl);
//      const httpEmployeeDetailsReq = httpMock.expectOne(req => req.method === 'GET' && req.url === employeeDetailsUrl);
//      httpResourceDetailsReq.flush({});
//      httpEmployeeDetailsReq.flush(FAKE_EMPLOYEE);

//      // Assert
//      expect(httpResourceDetailsReq.request.method).toBe('GET');
//      expect(httpResourceDetailsReq.request.params.get('employeeCode').toString()).toEqual(employeeCode.toString());
//      expect(httpEmployeeDetailsReq.request.method).toBe('GET');
//      expect(httpEmployeeDetailsReq.request.params.get('employeeCode').toString()).toEqual(employeeCode.toString());
//    });

//    it('mapResourceToProject() : should return an Observable<ResourceAllocation>', () => {
//      // Arrange
//      const resourceAllocation: ResourceAllocation = {
//        allocation: 100,
//        caseCode: 0,
//        clientCode: 28105,
//        currentLevelGrade: 'M6',
//        employeeCode: '42AUM',
//        endDate: null,
//        fullName: 'Upmanyu, Arjun',
//        lastUpdatedBy: null,
//        officeAbbreviation: 'NDC',
//        oldCaseCode: null,
//        pipelineId: '178ce26a-091c-4fbf-aed5-e78769fd4005',
//        startDate: '2019-02-01T00:00:00',
//        investmentCode: null
//      };


//      // Act
//      homeService.mapResourceToProject(resourceAllocation).subscribe(resourceAllocated => {
//        expect(resourceAllocated).toBe(resourceAllocation);
//      });


//      const httpReq = httpMock.expectOne(`${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/resourceAllocation`);
//      httpReq.flush(resourceAllocation);

//      // Assert
//      expect(httpReq.request.method).toBe('POST');
//    });

//    it('updateResourceAssignmentToCase() : should return an Observable<ResourceAllocation>', () => {
//      // Arrange
//      const resourceAllocation: ResourceAllocation = {
//        id:'388251c4-6b3e-e911-a990-005056ac2b1d',
//        allocation: 100,
//        caseCode: 0,
//        clientCode: 28105,
//        currentLevelGrade: 'M6',
//        employeeCode: '42AUM',
//        endDate: null,
//        fullName: 'Upmanyu, Arjun',
//        lastUpdatedBy: null,
//        officeAbbreviation: 'NDC',
//        oldCaseCode: null,
//        pipelineId: '178ce26a-091c-4fbf-aed5-e78769fd4005',
//        startDate: '2019-02-01T00:00:00',
//        investmentCode: null
//      };


//      // Act
//      homeService.updateResourceAssignmentToCase(resourceAllocation).subscribe(resourceAllocationUpdated => {
//        expect(resourceAllocationUpdated).toBe(resourceAllocation);
//      });


//      const httpReq = httpMock.expectOne(`${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/resourceAllocation`);
//      httpReq.flush(resourceAllocation);

//      // Assert
//      expect(httpReq.request.method).toBe('PUT');
//    });

//    it('deleteResourceAssignmentFromProject() : should delete resource from case', () => {
//      // Arrange
//      const allocationId = '388251c4-6b3e-e911-a990-005056ac2b1d';

//      // Act
//      homeService.deleteResourceAssignmentFromProject(allocationId).subscribe();

//      const httpReq = httpMock.expectOne(req => req.method === 'DELETE' &&
//        req.url === `${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/resourceAllocation`);

//      // Assert
//      expect(httpReq.request.method).toBe('DELETE');
//      expect(httpReq.request.params.get('allocationId').toString()).toEqual(allocationId);      
//    });

//  });

//  // ---------------Tests for getting Offices------------------------------------

//  describe('SubGroup - Offices', () => {

//    it('getOfficeList() : should return an Observable<Office[]>', () => {
//      // Act
//      homeService.getOfficeList().subscribe(offices => {
//        expect(offices).toBe(FAKE_OFFICES);
//      });
//      const httpReq = httpMock.expectOne(`${coreService.appSettings.ocelotApiGatewayBaseUrl}/api/office/offices`);
//      httpReq.flush(FAKE_OFFICES);

//      // Assert
//      expect(httpReq.request.method).toBe('GET');
//    });
//  });

//});
