//----------------------- Angular Package References ----------------------------------//
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//----------------------- Application References ----------------------------------//
import { StageComponent } from './stage.component';
import { FAKE_EMPLOYEE } from "../../shared/mocks/mock-core-service";
import { FAKE_OFFICES, FAKE_PROJECTS } from '../../shared/mocks/mock-home-service';
import { FilterComponent } from '../filter/filter.component';
import { ProjectResourceComponent } from '../project-resource/project-resource.component';
import { ProjectviewComponent } from '../projectview/projectview.component';

describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StageComponent, ProjectviewComponent, FilterComponent, ProjectResourceComponent],
      imports: [NgMultiSelectDropDownModule, FormsModule, DragDropModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageComponent);
    component = fixture.componentInstance;
    component.projects = JSON.parse(JSON.stringify(FAKE_PROJECTS));
    component.filteredProjects = JSON.parse(JSON.stringify(FAKE_PROJECTS));
    component.offices = JSON.parse(JSON.stringify(FAKE_OFFICES));
    component.homeOffice = JSON.parse(JSON.stringify(FAKE_EMPLOYEE.office));
    fixture.detectChanges();
  });

  describe('- Unit Tests -', () => {

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should get projects on init', () => {
      expect(component.projects).toEqual(FAKE_PROJECTS);
    });

    it('should get New Demands only on application inititalization', () => {
      //Arrange
      let expectedProjects = component.projects.filter(f => f.type !== "ActiveCase");

      //Act
      component.ngOnChanges();

      //Assert
      expect(component.filteredProjects).toEqual(expectedProjects);
    });

    it('should get New Demands and Active Cases on deselecting New Demand CheckBox', () => {
      //Arrange
      component.hideActiveCases = false;

      //Act
      component.ngOnChanges();

      //Assert
      expect(component.filteredProjects).toEqual(FAKE_PROJECTS);
    });

    it('should get offices on init', () => {
      expect(component.offices).toEqual(FAKE_OFFICES);
    });

    it('should get homeOffice on init', () => {
      expect(component.homeOffice).toEqual(FAKE_EMPLOYEE.office);
    });

    it('getProjectsHandler() should emit "getProjects" event',
      (done) => {
        //Arrange
        const officeCodes = "110,112";
        let today = new Date();
        let startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let twoWeeksAfter = new Date(today.setDate(today.getDate() + 14));
        let endDate = twoWeeksAfter.getFullYear() + '-' + (twoWeeksAfter.getMonth() + 1) + '-' + twoWeeksAfter.getDate();
        let dateRange = {
          startDate: startDate,
          endDate: endDate
        };

        //Act
        component.getProjects.subscribe(event => {
          expect(Object.assign({}, event)).toEqual(jasmine.objectContaining(Object.assign({}, { dateRange, officeCodes})));
          done();
        });
        component.getProjectsHandler({dateRange, officeCodes});
      });

    it('showHideActiveCases() should show New Demands and Active Cases on de-selecting [New Demand] checkbox',
      () => {
        //Arrange
        const newDemandCheckBoxStatus = false;

        //Act     
        component.showHideActiveCases(newDemandCheckBoxStatus);

        //Assert
        expect(Object.assign({}, component.filteredProjects)).toEqual(jasmine.objectContaining(Object.assign({}, FAKE_PROJECTS)));
        expect(component.hideActiveCases).toBeFalsy();
      });

    it('showHideActiveCases() should show New Demands only on selecting [New Demand] checkbox',
      () => {
        //Arrange
        const newDemandCheckBoxStatus = true;
        const expectedProjects = component.projects.filter(p => p.type !== "ActiveCase");

        //Act     
        component.showHideActiveCases(newDemandCheckBoxStatus);

        //Assert
        expect(Object.assign({}, component.filteredProjects)).toEqual(jasmine.objectContaining(Object.assign({}, expectedProjects)));
        expect(component.hideActiveCases).toBeTruthy();
      });

    it('mapResourceToProjectHandler() should emit "mapResourceToProject" event',
      (done) => {
        //Arrange
        const testResource = {
          clientCode: 12345,
          caseCode: 12,
          oldCaseCode: 'test',
          employeeCode: '39209',
          fullName: 'Anshul Agarwal',
          currentLevelGrade: 'N1',
          officeAbbreviation: 'BCC',
          allocation: 100,
          startDate: 'testStartDate',
          endDate: 'testEndDate',
          pipelineId: null,
          lastUpdatedBy: null
        };

        //Act
        component.mapResourceToProject.subscribe(resource => {
          //Assert
          expect(resource).toBe(testResource);
          done();
        });
        component.mapResourceToProjectHandler(testResource);
      });

    it('openResourceDetailsDialogHandler() should emit "openResourceDetailsDialog" event',
      (done) => {
        //Arrange
        const testEmployeeCode = "44ACM";

        //Act
        component.openResourceDetailsDialog.subscribe(employeeCode => {
          //Assert
          expect(employeeCode).toBe(testEmployeeCode);
          done();
        });
        component.openResourceDetailsDialogHandler(testEmployeeCode);
      });

  });

  describe('- Integration Tests -', () => {

    it('should show \'Staffing\' as page title', () => {
      const el = fixture.debugElement.query(By.css("#title > h2")).nativeElement;

      expect(el.innerText).toContain("Staffing");
    });

    it('should render each project as a ProjectviewComponent', () => {
      //Arrange
      const projectViewComponentElements = fixture.debugElement.queryAll(By.directive(ProjectviewComponent));

      expect(projectViewComponentElements.length).toEqual(3);
      for (let i = 0; i < projectViewComponentElements.length; i++) {
        expect(projectViewComponentElements[i].componentInstance.project).toEqual(FAKE_PROJECTS[i]);
      }
    });

    it('should render FilterComponent', () => {
      //Arrange
      const filterComponentElement = fixture.debugElement.query(By.directive(FilterComponent));

      //Act
      expect(filterComponentElement.componentInstance.offices).toEqual(FAKE_OFFICES);
      expect(filterComponentElement.componentInstance.homeOffice).toEqual(FAKE_EMPLOYEE.office);
    });

    it('should invoke getProjectsHandler() on emitting getProjects event from FilterComponent', () => {
      //Arrange
      const filterComponentElement = fixture.debugElement.query(By.directive(FilterComponent));
      spyOn(component, 'getProjectsHandler');
      const officeCodes = "110,112";
      let today = new Date();
      let startDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      let twoWeeksAfter = new Date(today.setDate(today.getDate() + 14));
      let endDate = twoWeeksAfter.getFullYear() + '-' + (twoWeeksAfter.getMonth() + 1) + '-' + twoWeeksAfter.getDate();
      let dateRange = {
        startDate: startDate,
        endDate: endDate
      };

      //Act
      filterComponentElement.componentInstance.getProjects.emit({dateRange,officeCodes});

      //Assert      
      expect(component.getProjectsHandler).toHaveBeenCalledWith({ dateRange, officeCodes });

    });

    it('should invoke showHideActiveCases() on emitting toggleActiveCasesVisibility event from FilterComponent', () => {
      //Arrange
      const filterComponentElement = fixture.debugElement.query(By.directive(FilterComponent));
      spyOn(component, 'showHideActiveCases');

      //Act
      filterComponentElement.componentInstance.toggleActiveCasesVisibility.emit(false);

      //Assert
      expect(component.showHideActiveCases).toHaveBeenCalledWith(false);

    });

    it('should invoke mapResourceToProjectHandler() on emitting getProjectsBySelectedOffice event from ProjectViewComponent', () => {
      //Arrange
      const projectComponentElement = fixture.debugElement.query(By.directive(ProjectviewComponent));
      spyOn(component, 'mapResourceToProjectHandler');

      //Act
      projectComponentElement.componentInstance.mapResourceToProject.emit(null);

      //Assert
      expect(component.mapResourceToProjectHandler).toHaveBeenCalled();

    });

    it('should invoke openResourceDetailsDialogHandler() on emitting openResourceDetailsDialog event from ProjectViewComponent', () => {
      //Arrange
      const testEmployeeCode = "44ACM";
      const projectComponentElement = fixture.debugElement.query(By.directive(ProjectviewComponent));
      spyOn(component, 'openResourceDetailsDialogHandler');

      //Act
      projectComponentElement.componentInstance.openResourceDetailsDialog.emit(testEmployeeCode);

      //Assert
      expect(component.openResourceDetailsDialogHandler).toHaveBeenCalledWith(testEmployeeCode);

    });

  });
});
