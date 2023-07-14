// ----------------------- Angular Package References ----------------------------------//
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

// ----------------------- Application References ----------------------------------//
import { HomeComponent } from './home.component';
import { ProjectviewComponent } from './projectview/projectview.component';
import { SidebarComponent } from './supply/sidebar.component';
import { SidebarFilterComponent } from './supply/sidebar-filter/sidebar-filter.component';
import { StageComponent } from './demand/stage.component';
import { HomeService } from './home.service';
import { CoreService } from '../core/core.service';
import { MockHomeService, FAKE_PROJECTS, FAKE_RESOURCEGROUPS, FAKE_OFFICES, FAKE_PROJECTS_DATA } from '../shared/mocks/mock-home-service';
import { MockCoreService, FAKE_EMPLOYEE, FAKE_APP_SETTINGS } from '../shared/mocks/mock-core-service';
import { ResourceviewComponent } from './resourceview/resourceview.component';
import { FilterComponent } from './demand/filter/filter.component';
import { ResourceAllocation } from '../shared/interfaces/resourceAllocation.interface';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProjectResourceComponent } from './project-resource/project-resource.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let updatedResourceGroups: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        ProjectviewComponent,
        SidebarComponent,
        SidebarFilterComponent,
        StageComponent,
        ResourceviewComponent,
        FilterComponent,
        ProjectResourceComponent
      ],
      imports: [
        NgMultiSelectDropDownModule,
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        NgxDaterangepickerMd,
        InfiniteScrollModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: HomeService, useClass: MockHomeService },
        { provide: CoreService, useClass: MockCoreService },
        DatePipe,
        BsModalService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    updatedResourceGroups = component.calculateAvailability(FAKE_RESOURCEGROUPS, component.selectedDateRangeForResources.startDate, component.selectedDateRangeForResources.endDate);
  });

  describe('- Unit Tests -', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('setProjects() should set projects property', () => {
      // Arrange
      component.setProjects(FAKE_PROJECTS_DATA);

      // Assert
      expect(Object.assign({}, component.projects)).toEqual(jasmine.objectContaining(Object.assign({}, FAKE_PROJECTS)));
    });

    it('should set the resourceGroups property',
      () => {
        // Assert
        expect();
        expect(component.resourceGroups).toBe(updatedResourceGroups);
      });

    it('should set the offices property',
      () => {
        // Assert
        expect(component.offices).toBe(FAKE_OFFICES);
      });

    it('should set the homeOffice property',
      () => {
        // Assert
        expect(component.homeOffice).toBe(FAKE_EMPLOYEE.office);
      });

    it('should set the pageSize property',
      () => {
        // Assert
        expect(component.pageSize).toBe(FAKE_APP_SETTINGS.projectsPageSize);
      });

    it('should set the homeOffice property (TO BE REMOVED)',
      () => {
        // Arrange
        FAKE_EMPLOYEE.office.officeCode = 110;

        // Assert
        expect(component.homeOffice).toBe(FAKE_EMPLOYEE.office);
      });

    it('should unsubscribe from the subject',
      () => {
        // Arrange
        spyOn(component.destroy$, 'unsubscribe');

        // Act
        component.ngOnDestroy();

        // Assert
        expect(component.destroy$.unsubscribe).toHaveBeenCalledTimes(1);
      });

    it('getProjectsHandler() should update projects property having startDate and endDate between selected dateRange',
      () => {
        // Arrange
        const initialProjects: any = [
          {
            caseName: 'Workers Comp Market Study',
            caseCode: 'T6BW',
            clientName: 'Apax Partners & Co',
            officeAbbreviation: 'NYC',
            startDate: '2018-10-30',
            endDate: '2018-11-19'
          }
        ];
        component.projects = initialProjects;

        const officeCodes = '110,112';
        const today = new Date();
        const dateRange = {
          startDate: new Date(),
          endDate: new Date(today.setDate(today.getDate() + 14))
        };
        spyOn(component, 'setProjects');
        expect(component.projects).toBe(initialProjects);

        // Act
        component.getProjectsHandler({ dateRange, officeCodes });

        // Assert
        expect(component.setProjects).toHaveBeenCalledWith(FAKE_PROJECTS_DATA);

      });

    it('getProjectsHandler() should update projects property having startDate and endDate between current 2 weeks',
      () => {
        // Arrange
        const initialProjects: any = [
          {
            caseName: 'Workers Comp Market Study',
            caseCode: 'T6BW',
            clientName: 'Apax Partners & Co',
            officeAbbreviation: 'NYC',
            startDate: '2018-10-30',
            endDate: '2018-11-19'
          }
        ];
        component.projects = initialProjects;

        const officeCodes = '110,112';
        const today = new Date();
        const dateRange = {
          startDate: null,
          endDate: null
        };
        spyOn(component, 'setProjects');
        expect(component.projects).toBe(initialProjects);

        // Act
        component.getProjectsHandler({ dateRange, officeCodes });

        // Assert
        expect(component.setProjects).toHaveBeenCalledWith(FAKE_PROJECTS_DATA);

      });

    it('mapResourceToProject() should allocate users to case',
      () => {
        // Arrange
        const resourceAllocation: ResourceAllocation = {
          allocation: 100,
          caseCode: 291,
          clientCode: 9111,
          caseName: null,
          clientName: null,
          opportunityName: null,
          currentLevelGrade: 'C5',
          employeeCode: '42ROS',
          endDate: '2019-03-01T00:00:00',
          employeeName: 'Sapra, Ronika',
          fte: 1,
          lastUpdatedBy: null,
          operatingOfficeAbbreviation: 'NDC',
          operatingOfficeCode: 440,
          operatingOfficeName: 'New Delhi',
          oldCaseCode: 'N7MM',
          pipelineId: null,
          startDate: '2019-01-28T00:00:00',
          serviceLineName: 'AAG',
          investmentCode: 1,
          investmentName: null,
          caseRoleCode: null,
          caseRoleName: null,
          position: null
        };
        component.setProjects(FAKE_PROJECTS_DATA, null);
        const assignedProjectIndex = component.projects.findIndex(p => p.caseCode === resourceAllocation.caseCode
          && p.clientCode === resourceAllocation.clientCode && p.oldCaseCode === resourceAllocation.oldCaseCode);

        component.projects[assignedProjectIndex].allocatedResources.splice(0, 0, resourceAllocation);

        // Act
        component.mapResourceToProjectHandler({ resourceAllocation: resourceAllocation, cdkEvent: null });
        // Assert
        const allocatedResourceIndex = component.projects[assignedProjectIndex].allocatedResources
          .findIndex(e => e.employeeCode === resourceAllocation.employeeCode);
        expect(Object.assign({}, component.projects[assignedProjectIndex].allocatedResources[allocatedResourceIndex]))
          .toEqual(jasmine.objectContaining(Object.assign({}, resourceAllocation)));

      });

  });

  describe('- Integration Tests -', () => {
    it('should render StageComponent',
      () => {
        // Arrange
        component.setProjects(FAKE_PROJECTS_DATA, null);
        let cases = [];
        let projects = [];
        projects = FAKE_PROJECTS_DATA.opportunitiesandallocationsbyoffices;
        cases = FAKE_PROJECTS_DATA.casesandallocationsbyoffices;
        const expectedProjects = projects.concat(cases);
        const stageComponentElement = fixture.debugElement.query(By.directive(StageComponent));

        // Assert
        expect(Object.assign({}, stageComponentElement.componentInstance.projects))
          .toEqual(jasmine.objectContaining(Object.assign({}, expectedProjects)));
        expect(stageComponentElement.componentInstance.offices).toBe(FAKE_OFFICES);
        expect(stageComponentElement.componentInstance.homeOffice).toBe(FAKE_EMPLOYEE.office);
      });

    it('should render SidebarComponent',
      () => {
        // Arrange
        const sidebarComponentElement = fixture.debugElement.query(By.directive(SidebarComponent));

        // Assert
        expect(sidebarComponentElement.componentInstance.resourceGroups).toBe(FAKE_RESOURCEGROUPS);
      });

    it('should call getProjectsHandler() when office dropdown from Filter Components is selected or date range is selected from datePicker',
      () => {
        // Arrange
        spyOn(component, 'getProjectsHandler');
        const stageComponentElement = fixture.debugElement.query(By.directive(StageComponent));
        const selectedOfficeCodes = '110,112';
        const dateRange = {
          startDate: null,
          endDate: null
        };

        // Act
        stageComponentElement.componentInstance.getProjects.emit({ dateRange, selectedOfficeCodes });

        // Assert
        expect(component.getProjectsHandler).toHaveBeenCalledWith({ dateRange, selectedOfficeCodes });
      });

    it('should call mapResourceToProjectHandler() when a resource is assigned(dropped) in the ProjectView Components ',
      () => {
        // Arrange
        spyOn(component, 'mapResourceToProjectHandler');
        const projectviewComponentElement = fixture.debugElement.query(By.directive(ProjectviewComponent));

        // Act
        projectviewComponentElement.componentInstance.mapResourceToProject.emit(null);

        // Assert
        expect(component.mapResourceToProjectHandler).toHaveBeenCalled();
      });

    it('should call openResourceDetailsDialogHandler() when clicked on Employee name Project view',
      () => {
        // Arrange
        spyOn(component, 'openResourceDetailsDialogHandler');
        const stageComponentElement = fixture.debugElement.query(By.directive(StageComponent));
        const employeeCode = '37995';

        // Act
        stageComponentElement.componentInstance.openResourceDetailsDialog.emit(employeeCode);

        // Assert
        expect(component.openResourceDetailsDialogHandler).toHaveBeenCalledWith(employeeCode);
      });

    it('should call openResourceDetailsDialogHandler() when clicked on Employee name from Resource view',
      () => {
        // Arrange
        spyOn(component, 'openResourceDetailsDialogHandler');
        const sidebarComponentElement = fixture.debugElement.query(By.directive(SidebarComponent));
        const employeeCode = '37995';

        // Act
        sidebarComponentElement.componentInstance.openResourceDetailsDialog.emit(employeeCode);

        // Assert
        expect(component.openResourceDetailsDialogHandler).toHaveBeenCalledWith(employeeCode);
      });

  });
});

