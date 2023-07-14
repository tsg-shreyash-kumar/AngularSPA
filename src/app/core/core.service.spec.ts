//----------------------- Angular Package References ----------------------------------//
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

//----------------------- Application References ----------------------------------//
import { CoreService } from './core.service';
import { FAKE_APP_SETTINGS, FAKE_EMPLOYEE } from '../shared/mocks/mock-core-service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../shared/local-storage.service';

describe('CoreService', () => {
  let coreService: CoreService = null;
  let httpMock: HttpTestingController;   //to mock requests and the flush method to provide dummy values as responses

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [environment],
    imports: [HttpClientTestingModule],
    providers: [CoreService, LocalStorageService]
  }));

  beforeEach(inject([CoreService, HttpTestingController], (service: CoreService, mock: HttpTestingController) => {
    coreService = service;
    httpMock = mock;
  }));

  //to make sure that there are no outstanding requests
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(coreService).toBeTruthy();
  });

  it('should load AppSettings', () => {
    //Act
    expect(coreService.appSettings).toEqual(environment.settings);

    //Assert
    const req = httpMock.expectOne(`http://localhost:1822/staffing/api/appSettings`);
    expect(req.request.method).toBe("GET");
    req.flush(FAKE_APP_SETTINGS);
  });

  it('should load logged-in Employee', () => {
    //Act
    coreService.loadEmployee().subscribe(() => {
      expect(coreService.loggedInUser).toEqual(FAKE_EMPLOYEE);
    });

    //Assert
    const req = httpMock.expectOne(`http://localhost:1822/staffing/api/employee/loggedinuser`);
    expect(req.request.method).toBe("GET");
    req.flush(FAKE_EMPLOYEE);
  });

  it('should load impersonated Employee', () => {
    //Arrange
    spyOn(coreService, "getParamValueByName").and.returnValue("37995");
    //Act
    coreService.loadEmployee().subscribe(() => {
      expect(coreService.loggedInUser).toEqual(FAKE_EMPLOYEE);
    });

    //Assert
    const req = httpMock.expectOne(`http://localhost:1822/staffing/api/employee/loggedinuser?userCode=37995`);
    expect(req.request.method).toBe("GET");
    req.flush(FAKE_EMPLOYEE);
  });

});
